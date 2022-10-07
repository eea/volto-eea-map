import { base_layers } from '../../constants';

const customBaselayers = [['positron-composite', 'positron-composite']];

const BaseLayerSchema = {
  title: 'Base Layer',
  fieldsets: [
    {
      id: 'base',
      title: 'Base Layer',
      fields: ['base_layer'],
    },
  ],
  properties: {
    base_layer: {
      title: 'Base Layer',
      choices: [...customBaselayers, ...base_layers],
    },
  },
  required: [],
};

const LayerSchema = {
  title: 'Layer',
  fieldsets: [
    {
      id: 'default',
      title: 'Layer',
      fields: ['map_layer'],
    },
  ],
  properties: {
    map_layer: {
      title: 'Map layer configuration',
      widget: 'map_layers_widget',
    },
  },
  required: [],
};

const MapLayersSchema = {
  title: 'Map Layers',
  fieldsets: [
    {
      id: 'default',
      title: 'Map Data',
      fields: ['map_layers'],
    },
  ],
  properties: {
    map_layers: {
      title: 'Map Layers',
      description: 'Add/Edit Map Layers',
      widget: 'object_list',
      schema: LayerSchema,
    },
  },
  required: [],
};

const GeneralSchema = ({ data = {} }) => {
  const centerOnExtent = data?.map_data?.general?.centerOnExtent;

  return {
    title: 'General',
    fieldsets: [
      {
        id: 'default',
        title: 'Zoom',
        fields: [
          'print_position',
          'zoom_position',
          'scalebar',
          'centerOnExtent',
          ...(!centerOnExtent ? ['zoom_level', 'long', 'lat'] : []),
        ],
      },
    ],
    properties: {
      centerOnExtent: {
        title: 'Center on extent',
        type: 'boolean',
        description:
          'This will override latitude/longitude/zoom level and will lock zoom/moving the map.',
      },
      scalebar: {
        title: 'Scalebar',
        choices: ['metric', 'non-metric', 'dual'].map((n) => {
          return [n, n];
        }),
      },
      zoom_position: {
        title: 'Zoom position',
        choices: ['bottom-right', 'bottom-left', 'top-right', 'top-left'].map(
          (n) => {
            return [n, n];
          },
        ),
      },
      zoom_level: {
        title: 'Zoom level',
        type: 'number',
      },
      long: {
        title: 'Longitude',
        type: 'number',
        description: `Will set the map center long coordinate. See: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#center`,
      },
      lat: {
        title: 'Latitude',
        type: 'number',
        description: `Will set the map center lat coordinate. See: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#center`,
      },

      print_position: {
        title: 'Print position',
        choices: ['bottom-right', 'bottom-left', 'top-right', 'top-left'].map(
          (n) => {
            return [n, n];
          },
        ),
      },
    },
    required: [],
  };
};

export default ({ data = {} }) => {
  const generalSchema = GeneralSchema({ data });

  return {
    title: 'Map Editor',
    fieldsets: [
      {
        id: 'default',
        title: 'Map Editor Sections',
        fields: ['map_data'],
      },
    ],
    properties: {
      map_data: {
        title: 'Panels',
        widget: 'object_types_widget',
        schemas: [
          {
            id: 'general',
            schema: generalSchema,
          },
          {
            id: 'base',
            schema: BaseLayerSchema,
          },
          {
            id: 'layers',
            schema: MapLayersSchema,
          },
        ],
      },
    },
    required: [],
  };
};
