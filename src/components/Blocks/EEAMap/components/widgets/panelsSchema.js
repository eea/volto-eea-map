import internalSVG from '@plone/volto/icons/nav.svg';
import hashlinkSVG from 'volto-slate/icons/hashlink.svg';

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
      //description: 'Open the map customization interface',
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
      //description: 'Open the map customization interface',
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
  //TODO: object list widget with map layers widget
  properties: {
    map_layers: {
      title: 'Edit map',
      description: 'Open the map customization interface',
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
          icon: internalSVG,
          schema: BaseLayerSchema,
        },
        {
          id: 'layers',
          icon: hashlinkSVG,
          schema: MapLayersSchema,
        },
      ],
    },
  },
  required: [],
};
