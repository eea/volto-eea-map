export const Schema = () => {
  return {
    title: 'EEA Map Block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'vis_url',
          'description',
          'height',
          'map_data',
          'show_sources',
          'show_legend',
          'show_download',
          'show_viewer',
        ],
      },
    ],
    properties: {
      vis_url: {
        widget: 'object_by_path',
        title: 'Visualization',
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
      show_sources: {
        title: 'Show sources',
        type: 'boolean',
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
