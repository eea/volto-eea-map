import React from 'react';
import { SidebarPortal } from '@plone/volto/components';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { getContent } from '@plone/volto/actions';

import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import Webmap from '@eeacms/volto-eea-map/components/Webmap';
import ExtraViews from '@eeacms/volto-eea-map/components/ExtraViews';
import '@eeacms/volto-eea-map/styles/map.css';

import { Schema } from './Schema';
import { applyQueriesToMapLayers } from '@eeacms/volto-eea-map/utils';

const Edit = (props) => {
  const {
    block,
    data,
    onChangeBlock,
    selected,
    id,
    data_provenance = {},
  } = props;
  const { height = '' } = data;
  const schema = Schema(props);
  const [mapData, setMapData] = React.useState('');

  React.useEffect(() => {
    if (!Object.hasOwn(data, 'show_legend')) {
      onChangeBlock(block, {
        ...data,
        show_legend: true,
      });
    }
    if (!Object.hasOwn(data, 'show_sources')) {
      onChangeBlock(block, {
        ...data,
        show_sources: true,
      });
    }
    if (!Object.hasOwn(data, 'dataprotection')) {
      onChangeBlock(block, {
        ...data,
        dataprotection: { enabled: true },
      });
    }

    //      eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.show_legend, data.show_sources, data.dataprotection]);

  React.useEffect(() => {
    props.getContent(props.data.vis_url, null, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data.vis_url]);

  //Handling data_query_params in block data from page data_query
  //updates them automatically from page data_query
  // TODO: improve and move in a helper function
  React.useEffect(() => {
    if (props.data_query) {
      //if block data_query_params do not exist, init them
      if (!props.data?.data_query_params) {
        onChangeBlock(block, {
          ...props.data,
          data_query_params: [...props.data_query],
        });
      }

      //if block data_query_params exist, deep check them then change them in block data
      if (props?.data_query && data?.data_query_params) {
        const newDataQuery = [...props.data_query].map((parameter, index) => {
          //check if the parameter exists in data and has value
          // then get its alias value and update it
          //check if data_query param value is changed
          //and change it in block data
          if (
            data?.data_query_params &&
            data?.data_query_params[index] &&
            parameter.i &&
            data?.data_query_params[index].i &&
            parameter.i === data?.data_query_params[index].i
          ) {
            return {
              ...parameter,
              alias: data?.data_query_params[index]?.alias
                ? data?.data_query_params[index]?.alias
                : '',
              v: parameter?.v ? parameter?.v : '',
            };
          }

          return parameter;
        });
        onChangeBlock(block, {
          ...data,
          data_query_params: [...newDataQuery],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data_query]);

  //Effect to check props.data.data_query_params in block data
  //and remakes layer by filtering matching layer fields with block data
  React.useEffect(() => {
    const updatedMapData = applyQueriesToMapLayers(
      props.map_visualization,
      props.data.data_query_params,
      props.data.enable_queries,
    );
    setMapData(updatedMapData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.map_visualization, props.data]);

  return (
    <>
      {mapData && (
        <div>
          <Webmap data={mapData} height={height} />
          <ExtraViews
            data={{
              ...data,
              data_provenance,
              map_data: props.map_visualization,
            }}
          />
        </div>
      )}
      {!mapData && (
        <p>No map view to show. Set visualization in block configuration.</p>
      )}
      <SidebarPortal selected={selected}>
        <BlockDataForm
          block={block}
          title={schema.title}
          schema={schema}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </>
  );
};

export default compose(
  connect(
    (state, props) => ({
      data_in_state: state.content.subrequests?.[props.id]?.data,
      data_query: state.content.data.data_query,
      data_provenance:
        state.content.subrequests?.[props.id]?.data?.data_provenance,
      map_visualization:
        state.content.subrequests?.[props.id]?.data?.map_visualization_data,
    }),
    {
      getContent,
    },
  ),
)(Edit);
