export const Schema = () => {
  return {
    title: 'EEA Map',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['customProp'],
      },
    ],
    properties: {
      customProp: {
        title: 'Custom prop',
        description: 'Select customization',
        default: 'default',
      },
    },
    required: [],
  };
};
