import { EEAMapEdit, EEAMapView } from '@eeacms/volto-eea-map/components';
import world from '@plone/volto/icons/world.svg';
import BaseLayerPanel from './components/Blocks/EEAMap/components/widgets/BaseLayerPanel';
import GeneralPanelWidget from './components/Blocks/EEAMap/components/widgets/GeneralPanelWidget';
import LayerSelectWidget from './components/Blocks/EEAMap/components/widgets/LayerSelectWidget';
import LegendWidget from './components/Blocks/EEAMap/components/widgets/LegendWidget';
import MapEditorWidget from './components/Blocks/EEAMap/components/widgets/MapEditorWidget';
import ObjectTypesWidget from './components/Blocks/EEAMap/components/widgets/ObjectTypesWidget';
import PrintWidget from './components/Blocks/EEAMap/components/widgets/PrintWidget';
import ZoomWidget from './components/Blocks/EEAMap/components/widgets/ZoomWidget';

export default (config) => {
  config.blocks.blocksConfig.eea_map_block = {
    id: 'eea_map_block', // The name (id) of the block
    title: 'EEA Map', // The display name of the block
    icon: world, // The icon used in the block chooser
    group: 'common', // The group (blocks can be grouped, displayed in the chooser)
    view: EEAMapView, // The view mode component
    edit: EEAMapEdit, // The edit mode component
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
  config.widgets.widget.map_base_layer_widget = BaseLayerPanel;
  config.widgets.widget.map_layers_widget = LayerSelectWidget;
  config.widgets.widget.object_types_widget = ObjectTypesWidget;
  config.widgets.widget.legend_widget = LegendWidget;
  config.widgets.widget.print_widget = PrintWidget;
  config.widgets.widget.zoom_widget = ZoomWidget;
  config.widgets.widget.general_panel_widget = GeneralPanelWidget;

  return config;
};
