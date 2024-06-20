import { useState, useEffect, useContext, useMemo } from 'react';
import { isNil, toNumber } from 'lodash';
import { v4 as uuid } from 'uuid';
import { QueryBuilder } from 'react-querybuilder';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Icon, InlineForm } from '@plone/volto/components';
import addSVG from '@plone/volto/icons/add.svg';
import {
  debounce,
  getLayers,
  getLayerDefaults,
} from '@eeacms/volto-eea-map/Arcgis/helpers';
import EditorContext from '@eeacms/volto-eea-map/Arcgis/Editor/EditorContext';
import Panel from './Panel';
import Fold from '../Fold/Fold';

function getLayersChoices(layers = []) {
  return layers.map((layer) => [
    layer.id.toString(),
    `${
      (layer.parentLayerId > -1 ? `${layer.parentLayerId}.` : '') + layer.id
    } - ${layer.name} (${layer.type})`,
  ]);
}

function getSublayers(subLayerIds, data) {
  return subLayerIds?.reduce((acc, subLayerId) => {
    const subLayer = data?.layers.find((layer) => layer.id === subLayerId);
    if (!subLayer) return acc;
    acc.push({
      ...(subLayer || {}),
      id: subLayerId,
      subLayers: getSublayers(subLayer?.subLayerIds, data),
    });
    return acc;
  }, []);
}

function Layer({ layer, layers, index, value, onChangeValue }) {
  const uid = useState(uuid());
  const { servicesApi, layersApi } = useContext(EditorContext);

  const layerPath = useMemo(
    () =>
      !isNil(layer.url) && !isNil(layer.id) ? `${layer.url}/${layer.id}` : null,
    [layer.url, layer.id],
  );

  const $service = {
    data: servicesApi.data[layer.url],
    error: servicesApi.error[layer.url],
    loading: servicesApi.loading[layer.url],
    loaded: servicesApi.loaded[layer.url],
    load: servicesApi.load,
  };

  const $layer = {
    data: layersApi.data[layerPath],
    error: layersApi.error[layerPath],
    loading: layersApi.loading[layerPath],
    loaded: layersApi.loaded[layerPath],
    load: layersApi.load,
  };

  useEffect(() => {
    if (!$service.loaded && !$service.loading && layer.url) {
      debounce(
        () => {
          $service.load(layer.url);
        },
        300,
        `fetch:${uid}:${layer.url}`,
      );
    }
  }, [uid, $service, layer]);

  useEffect(() => {
    if (!$layer.loaded && !$layer.loading && !$layer.error && layerPath) {
      debounce(
        () => {
          $layer.load(layerPath);
        },
        300,
        `fetch:${uid}:${layerPath}`,
      );
    }
  }, [uid, $layer, layerPath]);

  useEffect(() => {
    if (!$layer.loaded || $layer.data.id !== layer.id) return;
    const defaults = getLayerDefaults($layer.data);
    if (JSON.stringify(defaults) !== JSON.stringify(layer.defaults)) {
      onChangeValue({
        ...value,
        layers: layers.map((layer, i) => {
          if (i !== index) return layer;
          return {
            ...layer,
            defaults,
          };
        }),
      });
    }
  }, [index, layer, $layer, layers, value, onChangeValue]);

  return (
    <>
      <Dimmer active={$service.loading || $layer.loading}>
        <Loader />
      </Dimmer>

      <InlineForm
        schema={{
          title: `Layer ${index + 1}`,
          fieldsets: [
            {
              id: 'default',
              title: 'Default',
              fields: [
                'url',
                ...($service.loaded ? ['layerId'] : []),
                ...($service.loaded && $layer.loaded ? ['zoomToExtent'] : []),
              ],
            },
          ],
          properties: {
            url: {
              title: 'Service URL',
              widget: 'textarea',
              description: $service.error ? (
                <p
                  className="error"
                  style={{
                    fontSize: '10px',
                    overflowWrap: 'break-word',
                  }}
                >
                  {$service.error.message}
                </p>
              ) : null,
            },
            layerId: {
              title: 'Layer',
              choices: getLayersChoices($service.data?.layers),
              widget: 'select',
              description: $layer.error ? (
                <p
                  className="error"
                  style={{
                    fontSize: '10px',
                    overflowWrap: 'break-word',
                  }}
                >
                  {$layer.error.message}
                </p>
              ) : null,
            },
            zoomToExtent: {
              title: 'Zoom to extent',
              type: 'boolean',
            },
          },
          required: [],
        }}
        formData={{
          ...layer,
          layerId: !isNil(layer.id)
            ? {
                label: `${layer.id}${layer.name ? ` - ${layer.name}` : ''}`,
                value: layer.id,
              }
            : null,
        }}
        onChangeField={(id, fieldValue) => {
          let $fieldValue = fieldValue;
          let newLayer = {};

          if (id === 'layerId') {
            $fieldValue = toNumber(fieldValue) || 0;
            newLayer =
              $service.data?.layers.find((layer) => layer.id === $fieldValue) ||
              {};
          }

          onChangeValue({
            ...value,
            layers: layers.map((layer, i) => {
              if (i !== index)
                return {
                  ...layer,
                  ...(id === 'zoomToExtent' ? { zoomToExtent: false } : {}),
                };
              if (id === 'url') {
                return { url: $fieldValue };
              }
              return {
                ...layer,
                ...newLayer,
                [id === 'layerId' ? 'id' : id]: $fieldValue,
                subLayers: getSublayers(newLayer?.subLayerIds, $service.data),
              };
            }),
          });
        }}
      />

      {$service.loaded && $layer.loaded && $layer.data?.fields?.length && (
        <>
          <QueryBuilder
            fields={
              $layer.data.fields.map((field) => {
                return { name: field.name, label: field.name };
              }) || []
            }
            query={layer.definitionExpression}
            onQueryChange={(query) => {
              const newLayers = layers.map((layer, i) => {
                if (i !== index) return layer;
                return {
                  ...layer,
                  definitionExpression: query,
                };
              });
              if (JSON.stringify(newLayers) !== JSON.stringify(layers)) {
                onChangeValue({
                  ...value,
                  layers: newLayers,
                });
              }
            }}
          />
        </>
      )}
    </>
  );
}

export default function StructureLayersPanel({ value, onChangeValue }) {
  const layers = useMemo(
    () => getLayers({ layers: value.layers }, false),
    [value.layers],
  );

  return (
    <Panel
      header={
        <div style={{ width: '100%', textAlign: 'right' }}>
          <button
            className="btn-primary"
            onClick={() => {
              onChangeValue({
                ...value,
                layers: [
                  ...layers,
                  {
                    id: null,
                    url: null,
                    type: null,
                  },
                ],
              });
            }}
          >
            <Icon name={addSVG} size="16px" /> Layer
          </button>
        </div>
      }
      content={
        <>
          {layers.map((layer, index) => (
            <Fold
              key={index}
              title={`Layer ${index + 1}${
                layer.name ? ` - ${layer.name}` : ''
              }`}
              onDelete={() => {
                onChangeValue({
                  ...value,
                  layers: layers.filter((_, i) => i !== index),
                });
              }}
              foldable
              deletable
            >
              <Layer
                layer={layer}
                layers={layers}
                index={index}
                value={value}
                onChangeValue={onChangeValue}
              />
            </Fold>
          ))}
        </>
      }
    />
  );
}
