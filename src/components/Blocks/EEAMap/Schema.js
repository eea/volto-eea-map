export const Schema = () => {
  return {
    title: 'EEA Map',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['id', 'height', 'customProp'],
      },
    ],
    properties: {
      id: {
        title: 'ArcGIS map id',
        type: 'string',
      },
      height: {
        title: 'Height',
        type: 'number',
      },
      customProp: {
        title: 'Custom prop',
        description: 'Select customization',
        default: 'default',
      },
    },
    required: [],
  };
};
