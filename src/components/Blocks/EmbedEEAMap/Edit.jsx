import React from 'react';
import { SidebarPortal } from '@plone/volto/components';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { getContent } from '@plone/volto/actions';

import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import Webmap from '../../Webmap';
import ExtraViews from '../../ExtraViews';
import '../../../styles/map.css';

import { Schema } from './Schema';

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

  // React.useEffect(() => {
  //   if (props.map_visualization) {
  //     setMapData(props.map_visualization);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.map_visualization]);

  React.useEffect(() => {
    if (props.data.vis_url) {
      props.getContent(props.data.vis_url, null, id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data.vis_url]);

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
          if (
            data?.data_query_params &&
            data?.data_query_params[index] &&
            // data?.data_query_param[index] === parameter &&
            data?.data_query_params[index]?.alias
          ) {
            return {
              ...parameter,
              alias: data?.data_query_params[index]?.alias,
            };
          }
          return parameter;
        });
        onChangeBlock(block, {
          ...data,
          data_query_params: newDataQuery,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data_query]);

  React.useEffect(() => {
    var altMapData = { ...props.map_visualization };

    if (
      props?.data?.enable_queries &&
      props.data?.data_query_params &&
      props.data?.data_query_params.length > 0 &&
      altMapData.layers &&
      altMapData.layers.map_layers &&
      altMapData.layers.map_layers.length > 0
    ) {
      let rules = [];
      altMapData.layers.map_layers.forEach((l, j) => {
        props.data.data_query_params.forEach((param, i) => {
          const matchingFields =
            l.map_layer && l.map_layer.fields && l.map_layer.fields.length > 0
              ? l.map_layer.fields.filter(
                  (field, k) =>
                    field.name === param.alias || field.name === param.i,
                )
              : [];
          matchingFields.forEach((m, i) => {
            const newRules = param.v
              ? param.v.map((paramVal, i) => {
                  return {
                    field: m.name,
                    operator: '=',
                    value: paramVal,
                  };
                })
              : [];
            const concatRules = rules.concat(newRules);
            const filteredRules = concatRules.filter(
              (v, i, a) =>
                a.findLastIndex(
                  (v2) => v2.field === v.field && v2.value === v.value,
                ) === i,
            );
            rules = filteredRules;
          });
        });
        let autoQuery = {
          combinator: 'or',
          rules,
        };
        altMapData.layers.map_layers[j].map_layer.query = autoQuery;
      });
    }

    setMapData(altMapData);
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
      content: state.content,
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
