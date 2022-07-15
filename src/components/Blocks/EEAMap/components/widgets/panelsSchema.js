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
      title: 'Base layer configuration',
      widget: 'map_base_layer_widget',
      defaultValue: 'topo',
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

export const panelsSchema = {
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
      ],
    },
  },
  required: [],
};
