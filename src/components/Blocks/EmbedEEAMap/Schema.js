const ProtectionSchema = () => ({
  title: 'Data Protection',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'privacy_statement',
        'privacy_cookie_key',
        'enabled',
        'background_image',
      ],
    },
  ],

  properties: {
    privacy_statement: {
      title: 'Privacy statement',
      description: 'Defined in template. Change only if necessary',
      widget: 'slate_richtext',
      className: 'slate-Widget',
      defaultValue: [
        {
          children: [
            {
              text:
                'This map is hosted by a third party, Environmental Systems Research Institute. By showing the external content you accept the terms and conditions of ',
            },
            {
              type: 'a',
              url: 'https://www.esri.com',
              children: [
                {
                  text: 'esri.com',
                },
              ],
            },
            {
              text:
                '. This includes their cookie policies, which we have no control over.',
            },
          ],
        },
      ],
    },
    privacy_cookie_key: {
      title: 'Privacy cookie key',
      description: 'Use default for Esri maps, otherwise change',
      defaultValue: 'esri-maps',
    },
    enabled: {
      title: 'Data protection disclaimer enabled',
      description: 'Enable/disable the privacy protection',
      type: 'boolean',
    },
    background_image: {
      title: 'Static map preview image',
      widget: 'file',
    },
  },

  required: [],
});

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
          'show_viewer',
          'show_sources',
          'enable_queries',
          ...(props.data.enable_queries ? ['data_query_params'] : []),
          'dataprotection',
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
        description: 'Will show sources set in this page Data provenance',
        type: 'boolean',
      },
      show_legend: {
        title: 'Show legend',
        type: 'boolean',
      },
      show_viewer: {
        title: 'Show API link',
        description: 'Open the map on ArcGIS js service',
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
          'When using page level parameters to filter the map, please map those to the corresponding field name from the ArcGIS service',
        widget: 'data_query_widget',
      },
      dataprotection: {
        widget: 'object',
        schema: ProtectionSchema(),
      },
    },
    required: [],
  };
};
