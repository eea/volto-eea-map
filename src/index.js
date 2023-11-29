import { uniqBy } from 'lodash';

import EmbedMapView from './components/Blocks/EmbedEEAMap/View';
import EmbedMapEdit from './components/Blocks/EmbedEEAMap/Edit';

import world from '@plone/volto/icons/world.svg';

import DataQueryWidget from './components/widgets/DataQueryWidget';
import LayerSelectWidget from './components/widgets/LayerSelectWidget';

import VisualizationEditorWidget from './components/visualization/VisualizationEditorWidget';
import VisualizationViewWidget from './components/visualization/VisualizationViewWidget';
import VisualizationView from './components/visualization/VisualizationView';

import SimpleColorPickerWidget from './components/widgets/SimpleColorPickerWidget';

import './less/global.less';

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
    'utility.arcgisonline.com',
  ];

  config.blocks.blocksConfig.embed_eea_map_block = {
    id: 'embed_eea_map_block', // The name (id) of the block
    title: 'Embed Map layers (ArcGis)', // The display name of the block
    icon: world, // The icon used in the block chooser
    group: 'data_visualizations', // The group (blocks can be grouped, displayed in the chooser)
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
        view: EmbedMapView,
      },
    ],
  };

  config.blocks.groupBlocksOrder = uniqBy(
    [
      ...config.blocks.groupBlocksOrder,
      { id: 'data_visualizations', title: 'Data Visualizations' },
    ],
    'id',
  );

  config.widgets.widget.map_layers_widget = LayerSelectWidget;
  config.widgets.widget.data_query_widget = DataQueryWidget;
  config.widgets.widget.simple_color_picker_widget = SimpleColorPickerWidget;

  //map editor for the visualization(content-type)
  config.widgets.id.map_visualization_data = VisualizationEditorWidget;
  config.widgets.views.id.map_visualization_data = VisualizationViewWidget;
  //map viewer for the visualization(content-type)
  config.views.contentTypesViews.map_visualization = VisualizationView;

  return config;
};
