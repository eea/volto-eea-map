import { pickMetadata } from '@eeacms/volto-embed/helpers';

function getMapData({ content = {}, data }) {
  const map_visualization_data =
    content?.map_visualization_data || data?.map_visualization_data || {};
  return {
    ...pickMetadata(content),
    ...map_visualization_data,
  };
}

export { getMapData };
