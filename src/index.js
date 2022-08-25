import {
  EEAMapEdit,
  EEAMapView,
  EmbedMapView,
  EmbedMapEdit,
} from '@eeacms/volto-eea-map/components';
import world from '@plone/volto/icons/world.svg';
import DataQueryWidget from './components/Blocks/EEAMap/components/widgets/DataQueryWidget';
import LayerSelectWidget from './components/Blocks/EEAMap/components/widgets/LayerSelectWidget';
import MapEditorWidget from './components/Blocks/EEAMap/components/widgets/MapEditorWidget';
import ObjectTypesWidget from './components/Blocks/EEAMap/components/widgets/ObjectTypesWidget';
import VisualizationEditorWidget from './components/Blocks/EEAMap/components/widgets/VisualizationEditorWidget';
import VisualizationView from './components/Blocks/EEAMap/components/widgets/VisualizationView';

import { data_visualizations } from './middlewares';
import * as addonReducers from './reducers';

export default (config) => {
  config.settings.allowed_cors_destinations = [
    ...(config.settings.allowed_cors_destinations || []),
    'land.discomap.eea.europa.eu',
    'marine.discomap.eea.europa.eu',
    'climate.discomap.eea.europa.eu',
    'image.discomap.eea.europa.eu',
    'ldp.discomap.eea.europa.eu',
    'bio.discomap.eea.europa.eu',
    'air.discomap.eea.europa.eu',
    'maratlas.discomap.eea.europa.eu',
    'forest.discomap.eea.europa.eu',
    'water.discomap.eea.europa.eu',
    'noise.discomap.eea.europa.eu',
    'copernicus.discomap.eea.europa.eu',
  ];

  // EEA MAP BLOCK

  // config.blocks.blocksConfig.eea_map_block = {
  //   id: 'eea_map_block', // The name (id) of the block
  //   title: 'EEA Map', // The display name of the block
  //   icon: world, // The icon used in the block chooser
  //   group: 'common', // The group (blocks can be grouped, displayed in the chooser)
  //   view: EEAMapView, // The view mode component
  //   edit: EEAMapEdit, // The edit mode component
  //   sidebarTab: 1, // The sidebar tab you want to be selected when selecting the block
  //   security: {
  //     addPermission: [], // Future proof (not implemented yet) add user permission role(s)
  //     view: [], // Future proof (not implemented yet) view user role(s)
  //   },
  //   variations: [
  //     {
  //       id: 'default',
  //       title: 'EEA Map (default)',
  //       isDefault: true,
  //       view: EEAMapView,
  //     },
  //     {
  //       id: 'extra',
  //       title: 'Extra variation (expand if needed)',
  //       isDefault: true,
  //       view: EEAMapView,
  //     },
  //   ],
  // };

  config.blocks.blocksConfig.embed_eea_map_block = {
    id: 'embed_eea_map_block', // The name (id) of the block
    title: 'Embed EEA Map', // The display name of the block
    icon: world, // The icon used in the block chooser
    group: 'common', // The group (blocks can be grouped, displayed in the chooser)
    view: EmbedMapView, // The view mode component
    edit: EmbedMapEdit, // The edit mode component
    sidebarTab: 1, // The sidebar tab you want to be selected when selecting the block
    security: {
      addPermission: [], // Future proof (not implemented yet) add user permission role(s)
      view: [], // Future proof (not implemented yet) view user role(s)
    },
    variations: [
      {
        id: 'default',
        title: 'EEA Map (default)',
        isDefault: true,
        view: EEAMapView,
      },
      {
        id: 'extra',
        title: 'Extra variation (expand if needed)',
        isDefault: true,
        view: EEAMapView,
      },
    ],
  };

  config.widgets.widget.map_edit_widget = MapEditorWidget;
  config.widgets.widget.map_layers_widget = LayerSelectWidget;
  config.widgets.widget.object_types_widget = ObjectTypesWidget;
  config.widgets.widget.data_query_widget = DataQueryWidget;

  //map editor for the visualization(content-type)
  config.widgets.id.map_visualization_data = VisualizationEditorWidget;
  //map viewer for the visualization(content-type)
  config.views.contentTypesViews.map_visualization = VisualizationView;

  config.settings.storeExtenders = [
    ...(config.settings.storeExtenders || []),
    data_visualizations,
  ];

  config.addonReducers = {
    ...config.addonReducers,
    ...addonReducers,
  };

  return config;
};
