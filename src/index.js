import { EEAMapEdit, EEAMapView } from '@eeacms/volto-eea-map/components';
import world from '@plone/volto/icons/world.svg';

const applyConfig = (config) => {
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
  };
  return config;
};

export default applyConfig;
