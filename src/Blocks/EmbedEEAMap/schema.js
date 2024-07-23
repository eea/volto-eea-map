const protectionSchema = {
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
      required: true,
    },
  },

  required: ['background_image'],
};

export const schema = {
  title: 'Embed Map layers (ArcGis)',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['vis_url', 'description', 'height'],
    },
    {
      id: 'toolbar',
      title: 'Toolbar',
      fields: ['show_note', 'show_more_info', 'show_share'],
    },
    {
      fields: ['dataprotection'],
      title: 'Data Protection',
    },
  ],
  properties: {
    vis_url: {
      widget: 'internal_url',
      title: 'Visualization',
    },
    height: {
      title: 'Height',
      description:
        'Map block height in px. Default is 500px. Change only if necessary',
      type: 'number',
    },
    description: {
      title: 'Description',
      widget: 'slate',
    },
    show_note: {
      title: 'Show note',
      type: 'boolean',
      defaultValue: true,
    },
    show_sources: {
      title: 'Show sources',
      description: 'Will show sources set in this page Data provenance',
      type: 'boolean',
      defaultValue: true,
    },
    show_more_info: {
      title: 'Show more info',
      type: 'boolean',
      defaultValue: true,
    },
    show_share: {
      title: 'Show share button',
      type: 'boolean',
      defaultValue: true,
    },
    dataprotection: {
      widget: 'object',
      schema: protectionSchema,
      default: { enabled: true },
    },
  },
  required: [],
};
