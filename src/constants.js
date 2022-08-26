const positions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'].map(
  (n) => {
    return { key: n, value: n, text: n };
  },
);

const base_layers = [
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

export { positions, base_layers };
