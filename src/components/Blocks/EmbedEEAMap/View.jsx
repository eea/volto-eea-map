import React from 'react';
import { PrivacyProtection } from '@eeacms/volto-embed';
import Webmap from '@eeacms/volto-eea-map/components/Webmap';
import ExtraViews from '@eeacms/volto-eea-map/components/ExtraViews';
import { applyQueriesToMapLayers } from '@eeacms/volto-eea-map/utils';

const View = (props) => {
  const {
    map_visualization_data,
    query_params,
    enable_queries,
    height = '',
  } = props.data;
  const { data_provenance = {}, figure_note = [] } = map_visualization_data;
  const [mapData, setMapData] = React.useState('');

  React.useEffect(() => {
    const updatedMapData = applyQueriesToMapLayers(
      map_visualization_data,
      query_params,
      enable_queries,
    );
    setMapData(updatedMapData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map_visualization_data, query_params, enable_queries]);

  return (
    <PrivacyProtection
      data={props.data}
      className="embed-map-visualization"
      {...props}
    >
      {mapData && (
        <>
          <Webmap data={mapData} height={height} />
          <ExtraViews
            data={{
              ...props.data,
              data_provenance,
              figure_note,
              map_data: map_visualization_data,
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

export default View;
