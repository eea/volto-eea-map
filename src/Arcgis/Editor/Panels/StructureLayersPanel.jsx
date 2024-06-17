import { useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { isNil } from 'lodash';
import { QueryBuilder } from 'react-querybuilder';
import { Icon, SelectWidget, TextareaWidget } from '@plone/volto/components';
import addSVG from '@plone/volto/icons/add.svg';
import { debounce, getLayers } from '@eeacms/volto-eea-map/Arcgis/helpers';
import EditorContext from '@eeacms/volto-eea-map/Arcgis/Editor/EditorContext';
import SliderWidget from '@eeacms/volto-eea-map/Arcgis/Editor/Widgets/SliderWidget';
import Panel from './Panel';
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

function Layer({ layer, layers, index, value, onChangeValue }) {
  const { servicesData, layersData, setServicesData, setLayersData } =
    useContext(EditorContext);

  const [query, setQuery] = useState(layer.definitionExpression);
  const [uid] = useState(uuid());
  const data = servicesData[layer.url];
  const layerData = layersData[`${layer.url}/${layer.id}`];
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

  useEffect(() => {
    if (isNil(layer.id) || layerData) return;
    debounce(
      () => {
        fetch(`${layer.url}/${layer.id}?f=pjson`).then(async (response) => {
          try {
            const result = await response.json();
            setLayersData((layersData) => ({
              ...layersData,
              [`${layer.url}/${layer.id}`]: result,
            }));
          } catch {}
        });
      },
      300,
      `fetch:layer:${uid}`,
    );
  }, [uid, layer, layerData, setLayersData]);

  return (
    <>
      <TextareaWidget
        title="Service URL"
        id="url"
        value={layer.url}
        onChange={(_, newUrl) => {
          onChangeValue({
            ...value,
            layers: layers.map(($layer, i) => {
              if (i === index) {
                return { url: newUrl };
              }
              return $layer;
            }),
          });
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
              layers: layers.map(($layer, i) => {
                if (i === index) {
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

      {/* {!error && !isNil(layer.id) && layerData?.id === layer.id && (
        <>
          <QueryBuilder
            fields={layerData.fields.map((field) => {
              return { name: field.name, label: field.name };
            })}
            query={query}
            onQueryChange={(query) => {
              setQuery(query);
              debounce(
                () => {
                  onChangeValue({
                    ...value,
                    layers: layers.map(($layer) => {
                      if ($layer.id === layer.id) {
                        return {
                          ...$layer,
                          definitionExpression: query,
                        };
                      }
                      return $layer;
                    }),
                  });
                },
                600,
                `update:query:${uid}`,
              );
            }}
            enableDragAndDrop={false}
          />
        </>
      )} */}

      {/* {!error && !isNil(layer.id) && (
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
      )} */}
    </>
  );
}

export default function StructureLayersPanel({ value, onChangeValue }) {
  const layers = getLayers(value, false);

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
