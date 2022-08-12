import React from 'react';
import { Icon } from '@plone/volto/components';
import { Input, Select, Button, Grid } from 'semantic-ui-react';
import { QueryBuilder } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
// import {
//   bootstrapControlClassnames,
//   bootstrapControlElements,
// } from 'react-querybuilder/bootstrap';

import checkSVG from '@plone/volto/icons/check.svg';
import closeSVG from '@plone/volto/icons/clear.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import resetSVG from '@plone/volto/icons/reset.svg';

import { fetchArcgisData } from '../../utils';

const LayerSelectWidget = (props) => {
  const { onChange, id } = props;

  const value = React.useMemo(() => props.value || {}, [props.value]);

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
  //const [layerQuery, setLayerQuery] = React.useState(query);

  const [builtQuery, setBuiltQuery] = React.useState(query);

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
    setBuiltQuery('');
  };

  const handleQueryLayer = () => {
    if (builtQuery) {
      onChange(id, {
        ...value,
        query: builtQuery,
      });
    }
  };

  const handleChangeServiceUrl = (value) => {
    setServiceUrlError('');
    setCheckColor('');
    setServiceUrl(value);
    setAvailableLayers('');
    setBuiltQuery('');
    setSelectedLayer('');
  };

  const handleReset = () => {
    setServiceUrlError('');
    setServiceUrl(map_service_url);
    setCheckColor('');
    setAvailableLayers(available_layers);
    setBuiltQuery('');
    setSelectedLayer(layer);
  };

  return (
    <div
      style={{
        padding: '0 5px',
      }}
    >
      <Grid>
        <h5 style={{ padding: '0', margin: '15px 0px 5px 0px' }}>
          Service URL
        </h5>
        <Grid.Row>
          <Input
            type="text"
            onChange={(e, { value }) => handleChangeServiceUrl(value)}
            style={{ width: '100%' }}
            error={serviceUrlError}
            value={serviceUrl}
            // action
            // actionPosition="right"
          ></Input>

          <span style={{ fontSize: '12px', color: 'darkred' }}>
            {serviceUrlError.error}
          </span>
        </Grid.Row>
        {serviceUrl && (
          <Grid.Row>
            {serviceUrl !== map_service_url && (
              <Button
                size="small"
                compact
                className="layer-reset-button"
                onClick={handleReset}
              >
                <Icon name={resetSVG} title="Reset" size="20px" />
              </Button>
            )}
            <Button
              size="small"
              color={checkColor}
              compact
              className="layer-check-button"
              onClick={handleServiceUrlCheck}
            >
              <Icon
                name={serviceUrlError ? closeSVG : checkSVG}
                title="Submit"
                size="20px"
              />
            </Button>
          </Grid.Row>
        )}
        {availableLayers && availableLayers.length > 0 && (
          <>
            <h5 style={{ padding: '0', margin: '15px 0px 5px 0px' }}>Layer</h5>
            <Grid.Row>
              <Select
                onChange={(e, { value }) => handleSelectLayer(value)}
                options={availableLayers}
                style={{ width: '100%' }}
                placeholder="Select layer"
                value={selectedLayer}
              />
            </Grid.Row>
          </>
        )}
        {availableLayers && fields && fields.length > 0 && (
          <>
            <h5 style={{ padding: '0', margin: '15px 0px 5px 0px' }}>
              Query Layer
            </h5>
            <Grid.Row stretched>
              {/* <Input
                type="text"
                style={{ width: '100%' }}
                onChange={(e, { value }) => setLayerQuery(value)}
                value={layerQuery}
              ></Input> */}
            </Grid.Row>
            <Grid.Row>
              <QueryBuilder
                fields={fields.map((fi, i) => {
                  return { name: fi.name, label: fi.name };
                })}
                query={builtQuery}
                onQueryChange={(q) => setBuiltQuery(q)}
                enableDragAndDrop={false}
                //controlElements={bootstrapControlElements}
                //controlClassnames={bootstrapControlClassnames}
              />
            </Grid.Row>
            {builtQuery && (
              <Grid.Row>
                <Button
                  type="submit"
                  size="tiny"
                  compact
                  className="layer-submit-button "
                  color={'green'}
                  onClick={handleQueryLayer}
                >
                  <Icon name={aheadSVG} title="Check Url" size="20px" />
                </Button>
              </Grid.Row>
            )}
            <Grid.Row>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: 'darkgray',
                }}
              >
                Available Fields:
              </p>
            </Grid.Row>
            {fields.map((field, id) => (
              <p style={{ fontSize: '12px', padding: '0 5px' }}>
                <strong>{field.alias}</strong> ({field.type})
              </p>
            ))}
          </>
        )}
      </Grid>
    </div>
  );
};

export default LayerSelectWidget;
