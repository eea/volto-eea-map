import React from 'react';
import { Icon } from '@plone/volto/components';
import { Input, Select, Button, Grid } from 'semantic-ui-react';

import deleteSVG from '@plone/volto/icons/delete.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import saveSVG from '@plone/volto/icons/save.svg';
import closeSVG from '@plone/volto/icons/clear.svg';

import { fetchLayers } from '../../utils';

const LayerSelectWidget = (props) => {
  const { onChange, value = {}, id } = props;

  const { available_layers, map_data, map_service_url, layer } = value;

  const [mapData, setMapData] = React.useState(map_data);
  const [checkColor, setCheckColor] = React.useState('');
  const [serviceUrlError, setServiceUrlError] = React.useState('');
  const [serviceUrl, setServiceUrl] = React.useState(map_service_url);
  const [selectedLayer, setSelectedLayer] = React.useState(layer);
  const [availableLayers, setAvailableLayers] = React.useState(
    available_layers,
  );

  const handleServiceUrlCheck = async () => {
    // fetch url, save it, populate layers options
    try {
      let mapData = await fetchLayers(serviceUrl);
      setCheckColor('green');
      setMapData(mapData);
      setServiceUrlError('');
      if (mapData.layers && mapData.layers.length > 0) {
        setAvailableLayers(
          mapData.layers.map((layer, i) => {
            return { key: layer.id, value: layer, text: layer.name };
          }),
        );
      }
      onChange(id, {
        layer: selectedLayer,
        map_service_url: serviceUrl,
        available_layers: availableLayers,
        map_data: mapData,
      });
    } catch (e) {
      setCheckColor('youtube');
      setServiceUrlError({ error: e.message, status: e.status });
    }
  };

  const handleSelectLayer = (layer) => {
    setSelectedLayer(layer);
    onChange(id, {
      layer,
      map_service_url: serviceUrl,
      available_layers: availableLayers,
      map_data: mapData,
    });
  };

  return (
    <div
      style={{
        padding: '0 5px',
      }}
    >
      <Grid>
        <h4>Service URL</h4>
        <Grid.Row>
          <Input
            type="text"
            onChange={(e, { value }) => setServiceUrl(value)}
            style={{ width: '100%' }}
            value={serviceUrl}
          />
          <Grid.Row>
            <Button
              style={{
                margin: '10px 0',
                display: 'flex',
                alignItems: 'center',
              }}
              color={checkColor}
              onClick={handleServiceUrlCheck}
            >
              <p style={{ fontSize: '14px', margin: '0', marginRight: '5px' }}>
                Check Url
              </p>
              <Icon
                name={serviceUrlError ? closeSVG : checkSVG}
                style={{ marginLeft: '5px' }}
                title="Check Url"
                size="17px"
              />
            </Button>
          </Grid.Row>
        </Grid.Row>
        <h4>Layer</h4>
        <Grid.Row>
          <Select
            onChange={(e, { value }) => handleSelectLayer(value)}
            options={availableLayers}
            style={{ width: '100%' }}
            placeholder="Select layer"
            value={selectedLayer}
          />
        </Grid.Row>
        <Grid.Row stretched></Grid.Row>
      </Grid>
    </div>
  );
};

export default LayerSelectWidget;
