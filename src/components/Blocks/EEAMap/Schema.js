export const Schema = () => {
  return {
    title: 'EEA Map Block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['description', 'height', 'map_data'],
      },
    ],
    properties: {
      height: {
        title: 'Height',
        type: 'number',
      },
      description: {
        title: 'Description',
        widget: 'slate',
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
