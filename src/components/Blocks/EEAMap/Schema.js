export const Schema = () => {
  return {
    title: 'EEA Map',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['id', 'height', 'base_layer', 'customProp'],
      },
    ],
    properties: {
      id: {
        title: 'Map Server URL',
      },
      base_layer: {
        title: 'Base topographic layer',
        choices: [
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
        ].map((n) => [n, n]),
      },
      height: {
        title: 'Height',
        type: 'number',
      },
      customProp: {
        title: 'Custom prop',
        description: 'Select customization',
        default: 'default',
      },
    },
    required: [],
  };
};
