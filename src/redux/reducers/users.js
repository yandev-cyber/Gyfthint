import * as AppConstant from '../../constants';

const initialState = {
  users: [],
  hasMore: true,
  cards: [],
};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case AppConstant.ActionTypes.ALL_USERS: {
      return {
        ...state,
        users: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.HAS_MORE: {
      return {
        ...state,
        hasMore: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.SAVE_CARDS: {
      return {
        ...state,
        cards: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.INITIATE_USERS: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};
