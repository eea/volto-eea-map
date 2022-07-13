import React from 'react';
import { Icon } from '@plone/volto/components';
import { Input, Select, Button, Grid } from 'semantic-ui-react';

import deleteSVG from '@plone/volto/icons/delete.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import saveSVG from '@plone/volto/icons/save.svg';
import closeSVG from '@plone/volto/icons/clear.svg';

import { fetchLayers } from '../../utils';

const LayerSelectWidget = ({ index, layer, onChange, block, data }) => {
  const [mapData, setMapData] = React.useState(layer.map_data);
  const [checkColor, setCheckColor] = React.useState('');
  const [serviceUrlError, setServiceUrlError] = React.useState('');
  const [serviceUrl, setServiceUrl] = React.useState(layer.map_service_url);
  const [selectedLayer, setSelectedLayer] = React.useState(layer.layer);
  const [availableLayers, setAvailableLayers] = React.useState(
    layer.available_layers,
  );

  const handleDeleteLayer = (index) => {
    onChange('map_data', {
      ...data,
      map_layers: [
        ...data.map_layers.slice(0, index),
        ...data.map_layers.slice(index + 1),
      ],
    });
  };

  const handleSaveLayer = () => {
    const newLayer = {
      layer: selectedLayer,
      map_service_url: serviceUrl,
      available_layers: availableLayers,
      map_data: mapData,
    };
    onChange('map_data', {
      ...data,
      map_layers: [
        ...data.map_layers.slice(0, index),
        newLayer,
        ...data.map_layers.slice(index + 1),
      ],
    });
  };

  const handleServiceUrlCheck = async () => {
    //fetch url, save it, populate layers options
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
    } catch (e) {
      setCheckColor('youtube');
      setServiceUrlError({ error: e.message, status: e.status });
    }
  };

  return (
    <div
      style={{
        margin: '10px 0',
        padding: '5px 0',
        borderBottom: '2px solid lightgray',
      }}
    >
      <Grid>
        <Grid.Row>
          <h2>Layer {index + 1}</h2>
        </Grid.Row>
        <Grid.Row>
          <p style={{ fontSize: '13px', fontWeight: 'bold' }}>Service URL</p>
          <Input
            type="text"
            onChange={(e, { value }) => setServiceUrl(value)}
            style={{ width: '100%' }}
            value={serviceUrl}
            action
            actionPosition="right"
          >
            <input />
            <Button
              color={checkColor}
              size="tiny"
              type="submit"
              onClick={handleServiceUrlCheck}
            >
              <Icon
                name={serviceUrlError ? closeSVG : checkSVG}
                size="14px"
                title="Check Url"
              />
            </Button>
          </Input>
        </Grid.Row>
        <Grid.Row>
          <p style={{ fontSize: '13px', fontWeight: 'bold' }}>Layer</p>
          <Select
            onChange={(e, { value }) => setSelectedLayer(value)}
            style={{ width: '100%' }}
            options={availableLayers}
            placeholder="Select layer"
            value={selectedLayer}
          />
        </Grid.Row>
        <Grid.Row stretched>
          <Button color="green" icon size="tiny" onClick={handleSaveLayer}>
            <Icon name={saveSVG} size="16px" title="Save changes" />
          </Button>
          <Button
            icon
            size="tiny"
            color="youtube"
            style={{ marginLeft: 'auto' }}
            onClick={() => handleDeleteLayer(index)}
          >
            <Icon name={deleteSVG} size="16px" title="Delete block" />
          </Button>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default LayerSelectWidget;
