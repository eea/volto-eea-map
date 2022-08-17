export const Schema = (props) => {
  return {
    title: 'EEA Map Block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'map_data',
          'description',
          'height',
          'show_legend',
          'show_download',
          'show_viewer',
          'show_sources',
        ],
      },
    ],
    properties: {
      show_sources: {
        title: 'Show sources',
        type: 'boolean',
      },
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
      show_legend: {
        title: 'Show legend',
        type: 'boolean',
      },
      show_download: {
        title: 'Show download',
        type: 'boolean',
      },
      show_viewer: {
        title: 'Show web viewer',
        type: 'boolean',
      },
    },
    required: [],
  };
};
