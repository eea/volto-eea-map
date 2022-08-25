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
          'enable_queries',
          ...(props.data.enable_queries ? ['data_query_params'] : []),
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
      show_viewer: {
        title: 'Show web viewer',

        type: 'boolean',
      },
      enable_queries: {
        title: 'Enable queries',
        description:
          'Will import Criteria from content-type and try to query map layer fields.',
        type: 'boolean',
      },
      data_query_params: {
        title: 'Query parameters',
        description:
          'Detected parameters from content-type Criteria. Layers fields will be automatically queried by criteria title. If Alias is set on a Criteria, it will try to match the field with Alias.',
        widget: 'data_query_widget',
      },
    },
    required: [],
  };
};
