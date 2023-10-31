import React from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { expandToBackendURL } from '@plone/volto/helpers';

import { PrivacyProtection } from '@eeacms/volto-embed';

import Webmap from '@eeacms/volto-eea-map/components/Webmap';
import ExtraViews from '@eeacms/volto-eea-map/components/ExtraViews';
import { applyQueriesToMapLayers } from '@eeacms/volto-eea-map/utils';
import { getVisualization } from '@eeacms/volto-eea-map/actions';

const View = (props) => {
  const { data, data_provenance = {}, figure_note = [] } = props || {};
  const { height = '' } = data;

  const [mapData, setMapData] = React.useState('');

  React.useEffect(() => {
    if (props.data.vis_url) {
      props.getVisualization(expandToBackendURL(props.data.vis_url));
    }
    if (!props.data.vis_url) {
      setMapData('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data.vis_url]);

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
  ]);

  return (
    <PrivacyProtection
      data={data}
      className="embed-map-visualization"
      {...props}
    >
      {mapData && (
        <>
          <Webmap data={mapData} height={height} />
          <ExtraViews
            data={{
              ...data,
              data_provenance,
              figure_note,
              map_data: props.map_visualization,
              '@id': props['@id'],
            }}
          />
        </>
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
      '@id': props.data.vis_url
        ? state.map_visualizations?.data[
            expandToBackendURL(props.data.vis_url)
          ]?.['@id']
        : props.content['@id'],
      map_visualization: props.data.vis_url
        ? state.map_visualizations?.data[expandToBackendURL(props.data.vis_url)]
            ?.data
        : '',
      data_provenance: props.data.vis_url
        ? state.map_visualizations?.data[expandToBackendURL(props.data.vis_url)]
            ?.data_provenance
        : '',
      figure_note: props.data.vis_url
        ? state.map_visualizations?.data[expandToBackendURL(props.data.vis_url)]
            ?.figure_note
        : '',
    }),
    {
      getVisualization,
    },
  ),
)(View);
