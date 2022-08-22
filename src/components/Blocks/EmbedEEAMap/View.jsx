import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { PrivacyProtection } from '@eeacms/volto-embed';
import Webmap from '../EEAMap/components/Webmap';
import ExtraViews from '../EEAMap/components/widgets/ExtraViews';
import { getContent } from '@plone/volto/actions';

const View = (props) => {
  const { data, viz_content = {}, id } = props || {};
  const { height = '', vis_url = '' } = data;

  const { map_visualization_data = '', data_provenance = {} } =
    viz_content || {};

  const [mapData, setMapData] = React.useState(map_visualization_data);

  React.useEffect(() => {
    if (vis_url && !map_visualization_data) {
      props.getContent(vis_url, null, id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vis_url]);

  React.useEffect(() => {
    if (
      props.data_query &&
      props.data_query.length > 0 &&
      map_visualization_data
    ) {
      let altMapData = { ...map_visualization_data };

      props.data_query.forEach((param, i) => {
        if (
          map_visualization_data.layers &&
          map_visualization_data.layers.map_layers &&
          map_visualization_data.layers.map_layers.length > 0
        ) {
          map_visualization_data.layers.map_layers.forEach((l, j) => {
            if (
              l.map_layer &&
              l.map_layer.fields &&
              l.map_layer.fields.length > 0 &&
              l.map_layer.fields.filter(
                (field, k) =>
                  field.name === param.alias || field.name === param.i,
              ).length > 0
            ) {
              let autoQuery = {
                combinator: 'or',
                rules: props.data_query.map((q, i) => {
                  return {
                    field: param.alias ? param.alias : param.i,
                    operator: '=',
                    value: param.v[0],
                  };
                }),
              };
              altMapData.layers.map_layers[j].map_layer.query = autoQuery;
            }
          });
        }
      });
      setMapData(altMapData);
    }
  }, [props.data_query, map_visualization_data]);

  return (
    <div>
      <PrivacyProtection data={data} {...props}>
        {map_visualization_data && (
          <div>
            <Webmap data={mapData} height={height} />
            <ExtraViews
              data={{
                ...data,
                data_provenance,
                map_data: map_visualization_data,
              }}
            />
          </div>
        )}
        {!map_visualization_data && (
          <p>No map view to show. Set visualization in block configuration.</p>
        )}
      </PrivacyProtection>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      data_query: state.content.data.data_query,
      viz_content: state.content.subrequests?.[props.id]?.data,
    }),
    {
      getContent,
    },
  ),
)(View);
