export const Schema = () => {
  return {
    title: 'EEA Map Block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['height', 'map_data'],
      },
    ],
    properties: {
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
