import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { PrivacyProtection } from '@eeacms/volto-embed';

import { getContent } from '@plone/volto/actions';
import Webmap from '../../Webmap';
import ExtraViews from '../../ExtraViews';

import { StyleWrapperView } from '@eeacms/volto-block-style/StyleWrapper';
import cx from 'classnames';

const View = (props) => {
  const { data, id, isEdit, map_visualization = '', data_provenance = {} } =
    props || {};
  const { height = '', vis_url = '', enable_queries } = data;

  const [mapData, setMapData] = React.useState(map_visualization);

  React.useEffect(() => {
    if (vis_url) {
      props.getContent(vis_url, null, id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vis_url, enable_queries]);

  React.useEffect(() => {
    var altMapData = { ...map_visualization };
    const query_params = isEdit
      ? props.data?.data_query_params
      : props?.data_query;
    if (
      enable_queries &&
      map_visualization &&
      query_params &&
      query_params.length > 0 &&
      altMapData.layers &&
      altMapData.layers.map_layers &&
      altMapData.layers.map_layers.length > 0
    ) {
      let rules = [];

      altMapData.layers.map_layers.forEach((l, j) => {
        query_params.forEach((param, i) => {
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
            rules = rules.concat(newRules);
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
  }, [map_visualization, props.data, props.data_query, isEdit, enable_queries]);

  return (
    <StyleWrapperView
      {...props}
      data={data}
      styleData={{
        ...data.styles,
        customClass: cx(
          data.styles?.customClass || '',
          'columns-tabs-container',
        ),
      }}
    >
      <PrivacyProtection data={data} height={height} {...props}>
        {mapData && (
          <div>
            <Webmap data={mapData} height={height} />
            <ExtraViews
              data={{
                ...data,
                data_provenance,
                map_data: map_visualization,
              }}
            />
          </div>
        )}
        {!mapData && (
          <p>No map view to show. Set visualization in block configuration.</p>
        )}
      </PrivacyProtection>
    </StyleWrapperView>
  );
};

export default compose(
  connect(
    (state, props) => ({
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
)(View);
