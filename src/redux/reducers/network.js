import * as AppConstant from '../../constants';

const initialState = {
  networkUsers: [],
  hasMore: true,
};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case AppConstant.ActionTypes.SAVE_NETWORK_USERS: {
      return {
        ...state,
        networkUsers: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.HAS_MORE: {
      return {
        ...state,
        hasMore: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.INITIATE_NETWORK: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};
