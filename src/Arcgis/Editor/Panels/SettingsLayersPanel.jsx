import { useState, useEffect, useContext, useMemo } from 'react';
import { Segment } from 'semantic-ui-react';
import { isNil, toNumber } from 'lodash';
import { v4 as uuid } from 'uuid';
import { InlineForm } from '@plone/volto/components';
import {
  debounce,
  getLayers,
  getLayerDefaults,
} from '@eeacms/volto-eea-map/Arcgis/helpers';
import { blendModes } from '@eeacms/volto-eea-map/constants';
import EditorContext from '@eeacms/volto-eea-map/Arcgis/Editor/EditorContext';
import Panel from './Panel';
import Fold from '../Fold/Fold';

function Layer({ $map, layer, layers, index, value, onChangeValue }) {
  const uid = useState(uuid());
  const [isReady, setIsReady] = useState(false);
  const { layersApi } = useContext(EditorContext);

  const layerPath = useMemo(
    () =>
      !isNil(layer.url) && !isNil(layer.id) ? `${layer.url}/${layer.id}` : null,
    [layer.url, layer.id],
  );

  const $layer = {
    data: layersApi.data[layerPath],
    error: layersApi.error[layerPath],
    loading: layersApi.loading[layerPath],
    loaded: layersApi.loaded[layerPath],
    load: layersApi.load,
  };

  const schema = useMemo(
    () => ({
      title: 'General',
      fieldsets: [
        {
          id: 'default',
          title: 'Default',
          fields: ['blendMode', 'minScale', 'maxScale', 'opacity', 'renderer'],
        },
      ],
      properties: {
        blendMode: {
          title: 'Blend mode',
          choices: blendModes,
        },
        minScale: {
          title: 'Min scale',
          type: 'number',
          minimum: 0,
        },
        maxScale: {
          title: 'Max scale',
          type: 'number',
          minimum: 0,
        },
        opacity: {
          title: 'Opacity',
          widget: 'arcgis_slider',
        },
        renderer: {
          title: 'Renderer',
          widget: 'arcgis_renderer',
          $map,
        },
      },
      required: [],
    }),
    [$map],
  );

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
    setIsReady(true);
  }, [index, layer, $layer, layers, value, onChangeValue]);

  if (!isReady) return null;

  return (
    <>
      <InlineForm
        schema={schema}
        formData={{
          ...(layer.defaults || {}),
          ...layer,
        }}
        onChangeField={(id, fieldValue) => {
          let $fieldValue = fieldValue;

          if (
            ['minScale', 'maxScale', 'minZoom', 'maxZoom', 'opacity'].includes(
              id,
            )
          ) {
            $fieldValue = Math.max(toNumber(fieldValue) || 0, 0);
          }

          onChangeValue({
            ...value,
            layers: layers.map((layer, i) => {
              if (i !== index) return layer;
              return {
                ...layer,
                [id]: $fieldValue,
              };
            }),
          });
        }}
      />
      {layer.defaults && (
        <Segment attached style={{ textAlign: 'right' }}>
          <button
            className="btn-primary"
            onClick={() => {
              const defaults = { ...layer };
              Object.keys(schema.properties).forEach((key) => {
                if (key in layer.defaults) {
                  defaults[key] = layer.defaults[key];
                }
              });
              onChangeValue({
                ...value,
                layers: layers.map((layer, i) => {
                  if (i !== index) return layer;
                  return defaults;
                }),
              });
            }}
          >
            Defaults
          </button>
        </Segment>
      )}
    </>
  );
}

export default function SettingsLayersPanel({ $map, value, onChangeValue }) {
  const layers = useMemo(
    () => getLayers({ layers: value.layers }, false),
    [value.layers],
  );

  return (
    <Panel
      content={
        <>
          {layers.map((layer, index) => (
            <Fold
              key={index}
              title={`Layer ${index + 1}${
                layer.name ? ` - ${layer.name}` : ''
              }`}
              foldable
            >
              <Layer
                $map={$map}
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
