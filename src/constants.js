export const positions = [
  'bottom-right',
  'bottom-left',
  'top-right',
  'top-left',
].map((n) => {
  return { key: n, value: n, text: n };
});

export const basemaps = [
  'positron-composite',
  'blossom-composite',
  'dark-gray',
  'dark-gray-vector',
  'gray',
  'gray-vector',
  'hybrid',
  'national-geographic',
  'oceans',
  'osm',
  'satellite',
  'streets',
  'streets-navigation-vector',
  'streets-night-vector',
  'streets-relief-vector',
  'streets-vector',
  'terrain',
  'topo',
  'topo-vector',
].map((n) => {
  return [n, n];
});

export const layersMapping = {
  'Raster Layer': 'MapImageLayer',
};

export const withSublayers = ['MapImageLayer'];

export const geometryMapping = {
  esriGeometryPolygon: 'polygon',
};
