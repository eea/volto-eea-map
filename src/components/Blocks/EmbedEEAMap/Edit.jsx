import React from 'react';
import { SidebarPortal } from '@plone/volto/components';

import { connect } from 'react-redux';
import { compose } from 'redux';

import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import Webmap from '@eeacms/volto-eea-map/components/Webmap';
import ExtraViews from '@eeacms/volto-eea-map/components/ExtraViews';

import { Schema } from './Schema';
import {
  applyQueriesToMapLayers,
  updateBlockQueryFromPageQuery,
} from '@eeacms/volto-eea-map/utils';

import { getVisualization } from '@eeacms/volto-eea-map/actions';

const Edit = (props) => {
  const {
    block,
    data: initialData,
    onChangeBlock,
    selected,
    data_provenance = {},
  } = props;
  const { height = '' } = initialData;
  const schema = Schema(props);
  const [mapData, setMapData] = React.useState('');

  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    if (!Object.hasOwn(data, 'show_legend')) {
      setData((prevData) => ({
        ...prevData,
        show_legend: true,
      }));
    }
    if (!Object.hasOwn(data, 'show_sources')) {
      setData((prevData) => ({
        ...prevData,
        show_sources: true,
      }));
    }
    if (!Object.hasOwn(data, 'dataprotection')) {
      setData((prevData) => ({
        ...prevData,
        dataprotection: { enabled: true },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.show_legend, data.show_sources, data.dataprotection]);

  React.useEffect(() => {
    props.getVisualization(props.data.vis_url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data.vis_url]);

  React.useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      ...props.data,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  React.useEffect(() => {
    if (props.data_query) {
      //if block data_query_params do not exist, init them
      if (!props?.data?.data_query_params) {
        setData((prevData) => ({
          ...prevData,
          data_query_params: [...props.data_query],
        }));
      }

      //if block data_query_params exist, deep check them then change them in block data
      if (props?.data_query && data?.data_query_params) {
        const newDataQuery = updateBlockQueryFromPageQuery(
          props?.data_query,
          data?.data_query_params,
        );

        setData((prevData) => ({
          ...prevData,
          data_query_params: [...newDataQuery],
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data_query]);

  React.useEffect(() => {
    const updatedMapData = applyQueriesToMapLayers(
      props.map_visualization,
      props.data.data_query_params,
      props.data.enable_queries,
    );
    setMapData(updatedMapData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.map_visualization,
    props.data.data_query_params,
    props.data.enable_queries,
    JSON.stringify(props.data.data_query_params),
  ]);

  return (
    <>
      {mapData && (
        <div>
          <Webmap data={mapData} height={height} isEdit={true} />
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
      data_query: state.content.data.data_query,
      map_visualization: props.data.vis_url
        ? state.map_visualizations?.data[props.data.vis_url]?.data
        : '',
      data_provenance: props.data.vis_url
        ? state.map_visualizations?.data[props.data.vis_url]?.data_provenance
        : '',
    }),
    {
      getVisualization,
    },
  ),
)(Edit);
