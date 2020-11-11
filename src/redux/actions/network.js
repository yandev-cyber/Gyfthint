import * as AppConstant from '../../constants';

import * as Services from '../../services';

export const toggleNetworkUsersHasMore = value => {
  return {
    type: AppConstant.ActionTypes.HAS_MORE,
    payload: {
      data: value,
    },
  };
};
export const networkUsersList = users => {
  return {
    type: AppConstant.ActionTypes.SAVE_NETWORK_USERS,
    payload: {
      data: users,
    },
  };
};
export const getAllNetworkUsers = (cursor, keyword) => {
  return async (dispatch, getState) => {
    try {
      let users = await Services.NetworkService.get(cursor, keyword);

      dispatch(toggleNetworkUsersHasMore(users.length >= 30));

      if (users) {
        if (cursor) {
          users = getState().network.networkUsers.concat(users);
        }

        dispatch(networkUsersList(users));
      }
    } catch (error) {
      console.log(error);
    }
  };
};
