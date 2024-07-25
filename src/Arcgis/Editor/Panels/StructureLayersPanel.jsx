import { memo, useState, useEffect, useContext, useMemo } from 'react';
import { compose } from 'redux';
import { isNil, toNumber } from 'lodash';
import { v4 as uuid } from 'uuid';
import { QueryBuilder, Rule as QBRule, useRule } from 'react-querybuilder';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Icon, InlineForm } from '@plone/volto/components';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
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

const RuleComponent = memo((props) => {
  const [inputValue, setInputValue] = useState('');
  const r = useRule(props);

  const dataQuery = props.rule.dataQuery;

  function handleKeyDown(event) {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (dataQuery?.includes(inputValue)) {
          setInputValue('');
          event.preventDefault();
          break;
        }
        r.generateOnChangeHandler('dataQuery')([
          ...(dataQuery || []),
          event.target.value,
        ]);
        setInputValue('');
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  const Select = props.reactSelectCreateable.default;

  return (
    <div className="custom-rule">
      <div>
        <label htmlFor="dataQuery" style={{ fontWeight: '500' }}>
          Query parameters
        </label>
        <p
          style={{
            fontSize: '90%',
            marginBottom: '0.25rem',
            fontStyle: 'italic',
          }}
        >
          When using page level parameters to filter the map, please specify the
          corresponding name
        </p>
        <Select
          id="dataQuery"
          title="Data Query"
          className="react-select"
          classNamePrefix="react-select"
          placeholder=""
          isClearable
          isMulti
          menuIsOpen={false}
          options={[]}
          inputValue={inputValue}
          value={dataQuery?.map((value) => ({ label: value, value })) || null}
          onChange={(newValue) => {
            r.generateOnChangeHandler('dataQuery')(
              newValue?.map((value) => value.value) || [],
            );
          }}
          onInputChange={(newValue) => setInputValue(newValue)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <QBRule {...props} />
    </div>
  );
});

const Rule = compose(injectLazyLibs(['reactSelectCreateable']))(RuleComponent);

function Layer({ layer, layers, index, value, onChangeValue }) {
  const uid = useState(uuid());
  const { servicesApi, layersApi } = useContext(EditorContext);

  const layerPath = useMemo(
    () =>
      !isNil(layer.url) && !isNil(layer.id) ? `${layer.url}/${layer.id}` : null,
    [layer.url, layer.id],
  );

  const $service = useMemo(
    () => ({
      data: servicesApi.data[layer.url],
      error: servicesApi.error[layer.url],
      loading: servicesApi.loading[layer.url],
      loaded: servicesApi.loaded[layer.url],
      load: servicesApi.load,
    }),
    [servicesApi, layer.url],
  );

  const $layer = useMemo(
    () => ({
      data: layersApi.data[layerPath],
      error: layersApi.error[layerPath],
      loading: layersApi.loading[layerPath],
      loaded: layersApi.loaded[layerPath],
      load: layersApi.load,
    }),
    [layersApi, layerPath],
  );

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
            valueSource={'x'}
            controlElements={{
              rule: Rule,
            }}
          />
        </>
      )}
    </>
  );
}

export default function StructureLayersPanel({
  value,
  properties,
  onChangeValue,
}) {
  const data_query = properties?.data_query;

  const layers = useMemo(
    () =>
      getLayers(
        { layers: value.layers, styles: value.styles, data_query },
        false,
      ),
    [value.layers, value.styles, data_query],
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
