export const Schema = () => {
  return {
    title: 'EEA Map Block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['height', 'base_layer', 'map_data'],
      },
    ],
    properties: {
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
      map_data: {
        title: 'Edit map',
        description: 'Open the map customization interface',
        widget: 'map_edit_widget',
      },
    },
    required: [],
  };
};
