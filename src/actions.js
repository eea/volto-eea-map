import { GET_MAP_VISUALIZATION } from './actionTypes';

export function getVisualization(path) {
  return {
    type: GET_MAP_VISUALIZATION,
    path,
    request: {
      op: 'get',
      path: `${path}/@map-visualization`,
    },
  };
}
