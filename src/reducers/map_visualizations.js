import { GET_MAP_VISUALIZATION } from '../actionTypes';

const initialState = {
  data: {},
  error: null,
  loaded: false,
  loading: false,
};

export default function data_providers(state = initialState, action = {}) {
  const path = action.path
    ? action.path.replace(`/@map-visualization`, '')
    : undefined;

  switch (action.type) {
    case `${GET_MAP_VISUALIZATION}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };

    case `${GET_MAP_VISUALIZATION}_SUCCESS`:
      return {
        ...state,
        error: null,
        data: {
          ...state.data,
          [path]: action.result.map_visualization,
        },
        loaded: true,
        loading: false,
      };

    case `${GET_MAP_VISUALIZATION}_FAIL`:
      return {
        ...state,
        error: action.error,
        data: { ...state.data },
        loaded: false,
        loading: false,
      };

    default:
      return state;
  }
}
