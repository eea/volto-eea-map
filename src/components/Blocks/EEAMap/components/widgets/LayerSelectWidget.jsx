import React from 'react';
import { Icon } from '@plone/volto/components';
import { Input, Select, Button, Grid } from 'semantic-ui-react';

import checkSVG from '@plone/volto/icons/check.svg';
import closeSVG from '@plone/volto/icons/clear.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';

import { fetchArcgisData } from '../../utils';

const LayerSelectWidget = (props) => {
  const { onChange, value = {}, id } = props;

  const {
    available_layers,
    map_data,
    map_service_url,
    layer,
    fields = [],
    query = '',
  } = value;

  const [mapData, setMapData] = React.useState(map_data);
  const [checkColor, setCheckColor] = React.useState('');
  const [serviceUrlError, setServiceUrlError] = React.useState('');
  const [serviceUrl, setServiceUrl] = React.useState(map_service_url);
  const [selectedLayer, setSelectedLayer] = React.useState(layer);
  const [availableLayers, setAvailableLayers] = React.useState(
    available_layers,
  );
  const [layerQuery, setLayerQuery] = React.useState(query);

  const handleServiceUrlCheck = async () => {
    // fetch url, save it, populate layers options
    try {
      let mapData = await fetchArcgisData(serviceUrl);
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
        ...value,
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

  const handleLayerFetch = async (service_url, id) => {
    try {
      let fullLayer = await fetchArcgisData(`${service_url}/${id}`);
      return fullLayer;
    } catch (e) {}
  };

  const handleSelectLayer = async (layer) => {
    const fullLayer = await handleLayerFetch(serviceUrl, layer.id);
    setSelectedLayer(layer);
    onChange(id, {
      ...value,
      layer,
      fields: fullLayer.fields,
      map_service_url: serviceUrl,
      available_layers: availableLayers,
      map_data: mapData,
      query: '',
    });
    setLayerQuery('');
  };

  const handleQueryLayer = () => {
    onChange(id, {
      ...value,
      query: layerQuery,
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
            style={{ width: '70%' }}
            value={serviceUrl}
            action
            actionPosition="right"
          >
            <input />
            <Button
              type="submit"
              size="tiny"
              compact
              color={checkColor}
              onClick={handleServiceUrlCheck}
            >
              <Icon
                name={serviceUrlError ? closeSVG : checkSVG}
                title="Check Url"
                size="17px"
              />
            </Button>
          </Input>
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
        <h4>Query Layer</h4>
        <Grid.Row stretched>
          <Input
            type="text"
            onChange={(e, { value }) => setLayerQuery(value)}
            style={{ width: '70%' }}
            value={layerQuery}
            action
            actionPosition="right"
          >
            <input />
            <Button
              type="submit"
              size="tiny"
              compact
              color={'green'}
              onClick={handleQueryLayer}
            >
              <Icon name={aheadSVG} title="Check Url" size="17px" />
            </Button>
          </Input>
        </Grid.Row>
        <Grid.Row>
          <p style={{ fontSize: '12px', fontWeight: 'bold' }}>
            Available Fields:
          </p>
        </Grid.Row>
        {fields &&
          fields.length > 0 &&
          fields.map((field, id) => (
            <p style={{ fontSize: '12px' }}>{field.alias}</p>
          ))}
      </Grid>
    </div>
  );
};

export default LayerSelectWidget;
