import { formatQuery } from 'react-querybuilder';

const timer = {};

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
  return (
    (
      (Array.isArray(data.layers) ? data.layers : data.layers?.map_layers) || []
    )?.map(($layer) => {
      let definitionExpression;
      const layer = $layer.map_layer ? $layer.map_layer?.layer : $layer;
      const url = $layer.url ?? $layer.map_layer?.map_service_url;
      const subLayers = getLayers({ layers: $layer.subLayers });

      try {
        definitionExpression =
          parseQuery && layer.definitionExpression
            ? formatQuery(layer.definitionExpression, 'sql')
            : layer.definitionExpression;
      } catch {}

      return {
        ...layer,
        ...(definitionExpression ? { definitionExpression } : {}),
        url,
        title: layer.name,
        subLayers: subLayers.length > 0 ? subLayers : null,
      };
    }) || []
  );
}
