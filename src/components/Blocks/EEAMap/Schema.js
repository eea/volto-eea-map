export const Schema = (props) => {
  return {
    title: 'EEA Map Block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'map_data',
          //...(use_visualization ? ['vis_url'] : ['map_data']),
          'description',
          'height',
          'show_legend',
          'show_download',
          'show_viewer',
        ],
      },
    ],
    properties: {
      // use_visualization: {
      //   title: 'Use visualization',
      //   description:
      //     'This setting will enable importing the map data from a visualization. If is enabled, editing the map manually will not be possible',
      //   type: 'boolean',
      // },
      // vis_url: {
      //   widget: 'object_by_path',
      //   title: 'Visualization',
      // },
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
