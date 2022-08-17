export const Schema = (props) => {
  return {
    title: 'Embed EEA Map Block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'vis_url',
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
