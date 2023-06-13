import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { PrivacyProtection } from '@eeacms/volto-embed';

import { getContent } from '@plone/volto/actions';
import Webmap from '../../Webmap';
import ExtraViews from '../../ExtraViews';

const View = (props) => {
  const { data, id, data_provenance = {} } = props || {};
  const { height = '' } = data;

  const [mapData, setMapData] = React.useState('');

  React.useEffect(() => {
    if (props.map_visualization && props.map_visualization !== mapData) {
      setMapData(props.map_visualization);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.map_visualization]);

  React.useEffect(() => {
    if (props.data.vis_url) {
      props.getContent(props.data.vis_url, null, id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data.vis_url]);

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
    <PrivacyProtection data={data} height={height} {...props}>
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
    </PrivacyProtection>
  );
};

export default compose(
  connect(
    (state, props) => ({
      data_provenance:
        state.content.subrequests?.[props.id]?.data?.data_provenance,
      map_visualization:
        state.content.subrequests?.[props.id]?.data?.map_visualization_data,
    }),
    {
      getContent,
    },
  ),
)(View);
