import * as AppConstant from '../../constants';

import * as Services from '../../services';

import * as Actions from '../actions';

export const sendNotification = (sender, receiver, type) => {
  return async (dispatch) => {
    try {
      dispatch(Actions.toggleLoader(true));
      await Services.NotificationService.add(sender, receiver, type);

      dispatch(Actions.toggleLoader(false));
    } catch (error) {
      console.log(error);
    }
  };
};

export const saveNotifications = notifications => {
  return {
    type: AppConstant.ActionTypes.SAVE_NOTIFICATION,
    payload: {
      data: notifications,
    },
  };
};

export const toggleNotification = state => {
  return async (dispatch, getState) => {
    try {
      if (getState().onboard.user.has_new_notification && !state) {
        await Services.UserService.update(getState().onboard.user.id, {
          has_new_notification: false,
        });
        await Services.NotificationService.resetNotificationBadgeCount();
      }

      dispatch({
        type: AppConstant.ActionTypes.TOGGLE_NOTIFICATION_MODAL,
        payload: {
          data: state,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
};
