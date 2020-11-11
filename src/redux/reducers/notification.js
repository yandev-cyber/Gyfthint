import * as AppConstant from '../../constants';

const initialState = {
  notifications: [],
  showNotificationModal: false,
};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case AppConstant.ActionTypes.SAVE_NOTIFICATION: {
      return {
        ...state,
        notifications: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.TOGGLE_NOTIFICATION_MODAL: {
      return {
        ...state,
        showNotificationModal: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.INITIATE_NOTIFICATION: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};
