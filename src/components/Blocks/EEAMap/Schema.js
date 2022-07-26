export const Schema = () => {
  return {
    title: 'EEA Map Block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['show_description', 'description', 'height', 'map_data'],
      },
    ],
    properties: {
      height: {
        title: 'Height',
        type: 'number',
      },
      show_description: {
        title: 'Show description',
        type: 'boolean',
      },
      description: {
        title: 'Description',
        type: 'text',
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
