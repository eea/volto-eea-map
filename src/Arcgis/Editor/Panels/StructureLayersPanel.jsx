import { useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { isNil } from 'lodash';
import { Icon, SelectWidget, TextareaWidget } from '@plone/volto/components';
import Panel from './Panel';

import addSVG from '@plone/volto/icons/add.svg';
import { debounce, getLayers } from '@eeacms/volto-eea-map/Arcgis/helpers';
import EditorContext from '@eeacms/volto-eea-map/Arcgis/Editor/EditorContext';
import SliderWidget from '@eeacms/volto-eea-map/Arcgis/Editor/Widgets/SliderWidget';
import Fold from '../Fold/Fold';

function getLayersChoices(layers = []) {
  return layers.map((layer) => [
    layer.id,
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

function Layer({ layer, layers, value, onChangeValue }) {
  const { servicesData, setServicesData } = useContext(EditorContext);

  const [url, setUrl] = useState(layer.url);
  const [opacity, setOpacity] = useState(layer.opacity ?? 1);
  const [uid] = useState(uuid());
  const data = servicesData[layer.url];
  const error = data?.error?.message;

  const normalizedValue =
    !error &&
    data?.layers.reduce((acc, $layer) => {
      if ($layer.id === layer.id) {
        acc.label = `${layer.id} - ${$layer.name}`;
        acc.value = $layer.id;
        return acc;
      }
      return acc;
    }, {});

  useEffect(() => {
    if (servicesData[layer.url] || !layer.url) {
      return;
    }

    debounce(
      () => {
        fetch(`${layer.url}?f=pjson`)
          .then(async (response) => {
            try {
              const result = await response.json();
              setServicesData((servicesData) => ({
                ...servicesData,
                [layer.url]: result,
              }));
            } catch {}
          })
          .catch((error) => {
            setServicesData((servicesData) => ({
              ...servicesData,
              [layer.url]: { error },
            }));
          });
      },
      300,
      `fetch:${uid}`,
    );
  }, [uid, layer, servicesData, setServicesData]);

  return (
    <>
      <TextareaWidget
        title="Service URL"
        id="url"
        value={url}
        onChange={(_, newUrl) => {
          setUrl(newUrl);
          debounce(
            () => {
              onChangeValue({
                ...value,
                layers: layers.map(($layer) => {
                  if ($layer.id === layer.id) {
                    return { url: newUrl };
                  }
                  return $layer;
                }),
              });
            },
            600,
            `update:url:${uid}`,
          );
        }}
      />

      {!!error && (
        <p
          className="error"
          style={{
            fontSize: '10px',
            marginTop: '0.5rem',
            overflowWrap: 'break-word',
          }}
        >
          {error}
        </p>
      )}

      {!error && (
        <SelectWidget
          title="Layer"
          id="id"
          choices={getLayersChoices(data?.layers)}
          value={normalizedValue}
          onChange={(_, newId) => {
            const newLayer =
              data?.layers.find((layer) => layer.id === newId) || {};
            onChangeValue({
              ...value,
              layers: layers.map(($layer) => {
                if ($layer.id === layer.id) {
                  return {
                    ...$layer,
                    ...(newLayer || {}),
                    id: newId,
                    subLayers: getSublayers(newLayer?.subLayerIds, data),
                  };
                }
                return $layer;
              }),
            });
          }}
        />
      )}

      {!error && !isNil(layer.id) && (
        <SliderWidget
          title="Opacity"
          id="opacity"
          value={opacity}
          onChange={(_, newOpacity) => {
            setOpacity(newOpacity);
            debounce(
              () => {
                onChangeValue({
                  ...value,
                  layers: layers.map(($layer) => {
                    if ($layer.id === layer.id) {
                      return {
                        ...$layer,
                        opacity: newOpacity,
                      };
                    }
                    return $layer;
                  }),
                });
              },
              600,
              `update:opacity:${uid}`,
            );
          }}
        />
      )}
    </>
  );
}

export default function StructureLayersPanel({ value, onChangeValue }) {
  const layers = getLayers(value);

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
              title={`Layer ${index + 1}`}
              onDelete={() => {
                onChangeValue({
                  ...value,
                  layers: layers.filter((_, $index) => $index !== index),
                });
              }}
              foldable
              deletable
            >
              <Layer
                layer={layer}
                layers={layers}
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
