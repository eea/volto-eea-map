import { GET_MAP_VISUALIZATION } from '../actionTypes';

export const data_visualizations = (middlewares) => [
  (store) => (next) => (action) => {
    if (action.type === GET_MAP_VISUALIZATION) {
      store.dispatch({
        type: `${GET_MAP_VISUALIZATION}_PENDING`,
        path: action.path,
      });
    }
    return next(action);
  },
  ...middlewares,
];
