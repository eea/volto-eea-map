import { isArray } from 'lodash';
import { formatQuery as $formatQuery } from 'react-querybuilder';
import { getDefaultWidgets } from '@eeacms/volto-eea-map/constants';

const timer = {};

export function formatQuery(...args) {
  let query = args[0];
  const data_query = args[1];
  if (query?.rules) {
    query = {
      ...query,
      rules: query.rules
        .map((rule) => {
          if (!data_query) return rule;
          data_query.forEach((query) => {
            if (rule.dataQuery.includes(query.i)) {
              rule.value = query.v;
              if (
                isArray(rule.value) &&
                rule.value.length > 1 &&
                rule.operator === '='
              ) {
                rule.operator = 'in';
              }
            }
          });
          return rule;
        })
        .filter((rule) => rule.value),
    };
  }
  return $formatQuery(query, ...args.slice(2));
}

export function debounce(func, wait = 300, id) {
  if (typeof func !== 'function') return;
  const name = id || func.name || 'generic';
  if (timer[name]) clearTimeout(timer[name]);
  timer[name] = setTimeout(func, wait);
}

export function omitBy(obj, keys = []) {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

export function getBasemap(data) {
  if (!data) return {};
  return {
    name: data.basemap?.name || data.base?.base_layer,
    url_template: data.basemap?.url_template || data.base?.custom_base_layer,
  };
}

export function getLayers(data = {}, parseQuery = true) {
  if (!data?.layers) return [];
  const { data_query } = data;
  const renderer = getOldRenderer(data.styles);

  return (
    (
      (Array.isArray(data.layers) ? data.layers : data.layers?.map_layers) || []
    )?.map(($layer) => {
      const layer = $layer.map_layer ? $layer.map_layer?.layer : $layer;
      const url = $layer.url ?? $layer.map_layer?.map_service_url;
      const subLayers = getLayers({ layers: $layer.subLayers, data_query });

      let definitionExpression =
        layer.definitionExpression || data.definitionExpression;

      try {
        definitionExpression =
          parseQuery && definitionExpression
            ? formatQuery(definitionExpression, data_query, 'sql')
            : definitionExpression;
      } catch {}

      return {
        ...(renderer ? { renderer } : {}),
        ...omitBy(layer, ['geometryType', 'blendMode', 'definitionExpression']),
        ...(definitionExpression ? { definitionExpression } : {}),
        blendMode: layer.blendMode ?? 'normal',
        url,
        title: layer.name,
        subLayers: subLayers.length > 0 ? subLayers : null,
      };
    }) || []
  );
}

export function getLayerDefaults(layer = {}) {
  const renderer = layer.drawingInfo?.renderer;
  return {
    minScale: layer.minScale,
    maxScale: layer.maxScale,
    renderer: renderer ? { ...renderer, autocast: false } : undefined,
    blendMode: layer.blendMode || 'normal',
    opacity: 1,
  };
}

export function getWidgets(data = {}) {
  return data.widgets ?? getDefaultWidgets(data.settings?.map?.dimension);
}

export function getOldRenderer(styles) {
  if (!styles) return;
  return {
    type: 'simple',
    autocast: true,
    symbol: {
      type: 'simple-fill',
      color: styles?.symbol_color
        ? styles?.symbol_color?.rgb
        : {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
          },
      style: 'solid',
      outline: {
        color: styles?.outline_color
          ? styles?.outline_color?.rgb
          : {
              r: 0,
              g: 0,
              b: 0,
              a: 1,
            },
        width: styles?.outline_width ? styles?.outline_width : 1,
      },
    },
  };
}
