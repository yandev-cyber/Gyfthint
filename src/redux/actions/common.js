import * as AppConstant from '../../constants';

// To update user auth state
export const toggleLoader = value => {
  return {
    type: AppConstant.ActionTypes.IS_LOADING,
    payload: {
      data: value,
    },
  };
};

export const tabStateHandler = value => {
  return {
    type: AppConstant.ActionTypes.TAB_STATE,
    payload: {
      data: value,
    },
  };
};

export const saveStates = value => {
  return {
    type: AppConstant.ActionTypes.SAVE_STATES_LIST,
    payload: {
      data: value,
    },
  };
};
