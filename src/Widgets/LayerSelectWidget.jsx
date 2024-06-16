import React from 'react';
import { Icon } from '@plone/volto/components';
import { Input, Select, Button, Grid, Checkbox } from 'semantic-ui-react';
import { QueryBuilder } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

import { flattenToAppURL } from '@plone/volto/helpers';
import RichTextWidget from '@plone/volto-slate/widgets/RichTextWidget';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { getContent } from '@plone/volto/actions';

import checkSVG from '@plone/volto/icons/check.svg';
import closeSVG from '@plone/volto/icons/clear.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import resetSVG from '@plone/volto/icons/reset.svg';

import { fetchArcGISData } from '@eeacms/volto-eea-map/utils';

const LayerSelectWidget = (props) => {
  const { onChange, id, data_query } = props;

  const value = React.useMemo(() => props.value || {}, [props.value]);

  const {
    available_layers,
    map_data,
    map_service_url,
    layer,
    fields = [],
    query = '',
    description = '',
    hide = false,
  } = value;

  const [mapData, setMapData] = React.useState(map_data);
  const [checkColor, setCheckColor] = React.useState('');
  const [serviceUrlError, setServiceUrlError] = React.useState('');
  const [serviceUrl, setServiceUrl] = React.useState(map_service_url);
  const [selectedLayer, setSelectedLayer] = React.useState(layer);

  const [availableLayers, setAvailableLayers] = React.useState(
    available_layers,
  );

  const [builtQuery, setBuiltQuery] = React.useState(query);

  const handleServiceUrlCheck = async () => {
    // fetch url, save it, populate layers options
    try {
      let mapData = await fetchArcGISData(serviceUrl);
      setCheckColor('green');
      setMapData(mapData);
      setServiceUrlError('');
      if (mapData.layers && mapData.layers.length > 0) {
        const mappedLayers = mapData.layers
          .filter(
            (layer) => layer && layer.type && layer.type !== 'Group Layer',
          )
          .map((layer, i) => {
            return {
              key: layer.id,
              value: layer,
              text: `${layer.name} (${layer.type})`,
            };
          });
        setAvailableLayers(mappedLayers);
      }
      onChange(id, {
        ...value,
        layer: selectedLayer,
        map_service_url: serviceUrl,
        available_layers: availableLayers,
        map_data: mapData,
        description,
        hide,
      });
    } catch (e) {
      setCheckColor('youtube');
      setServiceUrlError({ error: e.message, status: e.status });
    }
  };

  React.useEffect(() => {
    props.getContent('', null, id);
    //    eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (query && !builtQuery) {
      setBuiltQuery(query);
    }
  }, [query, builtQuery]);

  React.useEffect(() => {
    //detect existing queries in block content. If it exists. Apply matching queries to layer on fresh layer load
    if (
      map_service_url &&
      layer &&
      !query &&
      data_query &&
      data_query.length > 0
    ) {
      let autoQuery = {
        combinator: 'or',
        rules: [],
      };
      data_query.forEach((param, i) => {
        if (
          fields &&
          fields.length > 0 &&
          fields.filter(
            (field, j) => field.name === param.alias || field.name === param.i,
          ).length > 0
        ) {
          autoQuery.rules = [
            ...autoQuery.rules,
            { field: param.alias || param.i, operator: '=', value: param.v[0] },
          ];
        }
      });
      if (autoQuery.rules.length > 0) {
        onChange(id, {
          ...value,
          query: autoQuery,
        });
        setBuiltQuery(autoQuery);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map_service_url, layer, query, data_query, fields]);

  const handleLayerFetch = async (service_url, id) => {
    try {
      let fullLayer = await fetchArcGISData(`${service_url}/${id}`);
      return fullLayer;
    } catch (e) {}
  };

  const handleSelectLayer = async (layer) => {
    const fullLayer = await handleLayerFetch(serviceUrl, layer.id);
    setSelectedLayer(layer);
    onChange(id, {
      ...value,
      layer,
      fullLayer,
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

  const handleChangeDescription = (val) => {
    if (val) {
      onChange(id, {
        ...value,
        description: val,
      });
    }
  };

  const handleOpacityChange = (val) => {
    onChange(id, {
      ...value,
      opacity: val,
    });
  };

  const handleChangeServiceUrl = (value) => {
    setServiceUrlError('');
    setCheckColor('');
    setAvailableLayers('');
    setBuiltQuery('');
    setSelectedLayer('');
    setMapData('');

    setServiceUrl(value);
  };

  const handleMinScaleChange = (minScaleOverride) => {
    onChange(id, {
      ...value,
      minScaleOverride,
    });
  };

  const handleMaxScaleChange = (maxScaleOverride) => {
    onChange(id, {
      ...value,
      maxScaleOverride,
    });
  };

  const handleReset = () => {
    setServiceUrlError('');
    setServiceUrl(map_service_url);
    setCheckColor('');
    setAvailableLayers(available_layers);
    setBuiltQuery('');
    setSelectedLayer(layer);
    setMapData(map_data);
  };

  const handleHideInLegend = (v) => {
    onChange(id, {
      ...value,
      hide: v,
    });
  };

  return (
    <div
      style={{
        padding: '0 5px',
      }}
    >
      <Grid>
        <div className="spaced-row">
          <Grid.Row stretched>
            <h5 style={{ padding: '0', margin: '15px 0px 5px 0px' }}>
              Service URL
            </h5>
          </Grid.Row>

          <Grid.Row>
            <Input
              type="text"
              onChange={(e, { value }) => handleChangeServiceUrl(value)}
              style={{ width: '100%' }}
              error={serviceUrlError}
              value={serviceUrl}
            ></Input>

            <span style={{ fontSize: '12px', color: 'darkred' }}>
              {serviceUrlError.error}
            </span>
          </Grid.Row>
          {serviceUrl && (
            <Grid.Row style={{ display: 'flex' }}>
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
        </div>
        {mapData && mapData.mapName && (
          <div className="spaced-row">
            <Grid.Row>
              <h5 style={{ padding: '0', margin: '15px 0px 5px 0px' }}>
                Map name:
              </h5>
              <p>{mapData.mapName}</p>
            </Grid.Row>
          </div>
        )}
        {availableLayers && availableLayers.length > 0 && (
          <div className="spaced-row">
            <Grid.Row>
              <h5 style={{ padding: '0', margin: '15px 0px 5px 0px' }}>
                Layer
              </h5>
            </Grid.Row>
            <Grid.Row>
              <Select
                onChange={(e, { value }) => handleSelectLayer(value)}
                options={availableLayers}
                style={{ width: '100%' }}
                placeholder="Select layer"
                value={selectedLayer}
              />
            </Grid.Row>
          </div>
        )}
        {availableLayers && availableLayers.length > 0 && selectedLayer && (
          <div className="spaced-row">
            <Grid.Row stretched>
              <h5>Opacity:</h5>
              <input
                className="map-number-input"
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={value?.opacity ? value?.opacity : 1}
                onChange={(e) => handleOpacityChange(e.target.value)}
              />
              <input
                className="map-range-input"
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={value?.opacity ? value?.opacity : 1}
                onChange={(e) => handleOpacityChange(e.target.value)}
              />
            </Grid.Row>
            <Grid.Row stretched>
              <h5 style={{ padding: '0', margin: '15px 0px 5px 0px' }}>
                Min scale:
              </h5>
              <input
                className="map-number-input"
                type="number"
                min={0}
                step={1}
                value={
                  value?.minScaleOverride
                    ? value?.minScaleOverride
                    : value?.layer?.minScale
                }
                onChange={(e) => handleMinScaleChange(e.target.value)}
              />
            </Grid.Row>
            <Grid.Row stretched>
              <h5 style={{ padding: '0', margin: '15px 0px 5px 0px' }}>
                Max scale:
              </h5>
              <input
                className="map-number-input"
                type="number"
                min={0}
                step={1}
                value={
                  value?.maxScaleOverride
                    ? value?.maxScaleOverride
                    : value?.layer?.maxScale
                }
                onChange={(e) => handleMaxScaleChange(e.target.value)}
              />
            </Grid.Row>
            <Grid.Row stretched>
              <h5 style={{ padding: '0', margin: '15px 0px 5px 0px' }}>
                Description
              </h5>
            </Grid.Row>
            <Grid.Row stretched>
              <div className="map-layer-description-field">
                <RichTextWidget
                  title="description"
                  onChange={(name, value) => {
                    handleChangeDescription(value);
                  }}
                  value={value.description}
                  placeholder="Set Description"
                />
              </div>
            </Grid.Row>
            <Grid.Row stretched>
              <h5>Hide in legend:</h5>{' '}
              <Checkbox
                label="Layer will be hidden in legend"
                checked={hide}
                onChange={(e, { checked }) => handleHideInLegend(checked)}
              />
            </Grid.Row>
          </div>
        )}
        {availableLayers && fields && fields.length > 0 && (
          <div className="spaced-row">
            <h5 style={{ padding: '0', margin: '15px 0px 5px 0px' }}>
              Query Layer
            </h5>
            <Grid.Row>
              <QueryBuilder
                fields={fields.map((fi, i) => {
                  return { name: fi.name, label: fi.name };
                })}
                query={builtQuery}
                onQueryChange={(q) => setBuiltQuery(q)}
                enableDragAndDrop={false}
              />
            </Grid.Row>
            {builtQuery && (
              <Grid.Row style={{ display: 'flex' }}>
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
          </div>
        )}
      </Grid>
    </div>
  );
};

export default compose(
  connect(
    (state) => {
      const pathname = flattenToAppURL(state.content.data['@id']);
      return {
        content: state.content.data,
        data_query: state.connected_data_parameters.byContextPath[pathname],
      };
    },
    {
      getContent,
    },
  ),
)(LayerSelectWidget);
