import React, { useMemo } from 'react';
import { PrivacyProtection } from '@eeacms/volto-embed';
import MapBuilder from '@eeacms/volto-eea-map/Arcgis/Map/MapBuilder';
import ExtraViews from '@eeacms/volto-eea-map/components/ExtraViews';
import { applyQueriesToMapLayers } from '@eeacms/volto-eea-map/utils';

import { getMapVisualizationData } from './helpers';

const View = (props) => {
  const { data } = props;
  const {
    data_query_params,
    enable_queries,
    show_legend = true,
    show_note = true,
    show_more_info = true,
    show_share = true,
    dataprotection = { enabled: true },
    height = '',
  } = data;

  const map_visualization_data = useMemo(
    () => getMapVisualizationData(props),
    [props],
  );

  const [mapData, setMapData] = React.useState('');

  React.useEffect(() => {
    const updatedMapData = applyQueriesToMapLayers(
      map_visualization_data,
      data_query_params,
      enable_queries,
    );
    setMapData(updatedMapData);
  }, [map_visualization_data, data_query_params, enable_queries]);

  const mapUrl = map_visualization_data?.layers?.map_layers[0]?.map_layer
    ?.map_service_url
    ? `${map_visualization_data.layers.map_layers[0].map_layer.map_service_url}?f=jsapi`
    : '';

  if (map_visualization_data?.error) {
    return (
      <p dangerouslySetInnerHTML={{ __html: map_visualization_data.error }} />
    );
  }

  return (
    <PrivacyProtection
      className="embed-map-visualization"
      {...props}
      data={mapUrl ? { ...data, url: mapUrl } : data}
    >
      {!!mapData && (
        <>
          <MapBuilder data={mapData} height={height} />
          <ExtraViews
            data={{
              ...data,
              show_legend,
              show_note,
              show_sources: true,
              show_more_info,
              show_share,
              dataprotection,
              map_visualization_data,
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
