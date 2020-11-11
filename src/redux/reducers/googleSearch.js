import * as AppConstant from '../../constants';

const initialState = {
  searchResults: [],
  hasMore: true,
  startIndex: 1,
};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case AppConstant.ActionTypes.SAVE_GOOGLE_SEARCH_RESULTS: {
      return {
        ...state,
        searchResults: action.payload.results,
        startIndex: action.payload.startIndex,
      };
    }
    case AppConstant.ActionTypes.HAS_MORE: {
      return {
        ...state,
        hasMore: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.INITIATE_GOOGLE_SEARCH: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};
