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

const LegendSchema = {
  title: 'Legend',
  fieldsets: [
    {
      id: 'default',
      title: 'Legend',
      fields: ['legend'],
    },
  ],
  properties: {
    legend: {
      title: 'Legend',
      widget: 'legend_widget',
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
      fields: ['print'],
    },
  ],
  properties: {
    print: {
      title: 'Print',
      widget: 'print_widget',
    },
  },
  required: [],
};

const ZoomSchema = {
  title: 'Zoom',
  fieldsets: [
    {
      id: 'default',
      title: 'Zoom',
      fields: ['zoom'],
    },
  ],
  properties: {
    zoom: {
      title: 'Zoom',
      widget: 'zoom_widget',
    },
  },
  required: [],
};

const GeneralSchema = {
  title: 'General',
  fieldsets: [
    {
      id: 'default',
      title: 'General',
      fields: [
        'show_sources',
        'show_description',
        'description',
        'show_download',
        'show_viewer',
      ],
    },
  ],
  properties: {
    show_sources: {
      title: 'Show sources',
      type: 'boolean',
    },
    show_description: {
      title: 'Show description',
      type: 'boolean',
    },
    description: {
      title: 'Description',
      type: 'text',
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
          id: 'general',
          schema: GeneralSchema,
        },
        {
          id: 'base',
          schema: BaseLayerSchema,
        },
        {
          id: 'layers',
          schema: MapLayersSchema,
        },
        {
          id: 'legend',
          schema: LegendSchema,
        },
        {
          id: 'print',
          schema: PrintSchema,
        },
        {
          id: 'zoom',
          schema: ZoomSchema,
        },
      ],
    },
  },
  required: [],
};
