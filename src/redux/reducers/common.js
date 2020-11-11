import * as AppConstant from '../../constants';

const initialState = {
  isLoading: false,
  activeTab: 'MY DASHBOARD',
  states: [],
};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case AppConstant.ActionTypes.IS_LOADING: {
      return {
        ...state,
        isLoading: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.TAB_STATE: {
      return {
        ...state,
        activeTab: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.SAVE_STATES_LIST: {
      return {
        ...state,
        states: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.INITIATE_COMMON: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};
