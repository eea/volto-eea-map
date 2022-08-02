import { base_layers } from '../../constants';

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
      choices: base_layers,
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

const PrintSchema = {
  title: 'Print',
  fieldsets: [
    {
      id: 'default',
      title: 'Print',
      fields: ['show_print', 'position'],
    },
  ],
  properties: {
    show_print: {
      title: 'Show print',
      type: 'boolean',
    },
    position: {
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

const ZoomSchema = ({ data = {} }) => {
  const centerOnExtent = data?.map_data?.zoom?.centerOnExtent;

  return {
    title: 'Zoom',
    fieldsets: [
      {
        id: 'default',
        title: 'Zoom',
        fields: [
          'show_zoom',
          'centerOnExtent',
          'position',
          ...(!centerOnExtent ? ['zoom_level', 'long', 'lat'] : []),
        ],
      },
    ],
    properties: {
      show_zoom: {
        title: 'Show zoom',
        type: 'boolean',
      },
      centerOnExtent: {
        title: 'Center on extent',
        type: 'boolean',
        description: 'This will override latitude/longitude/zoom level',
      },
      position: {
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
      },
      lat: {
        title: 'Latitude',
        type: 'number',
      },
    },
    required: [],
  };
};

export default ({ data = {} }) => {
  const zoomSchema = ZoomSchema({ data });

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
            id: 'base',
            schema: BaseLayerSchema,
          },
          {
            id: 'layers',
            schema: MapLayersSchema,
          },
          {
            id: 'print',
            schema: PrintSchema,
          },
          {
            id: 'zoom',
            schema: zoomSchema,
          },
        ],
      },
    },
    required: [],
  };
};
