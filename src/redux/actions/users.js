import _ from 'lodash';

import * as AppConstant from '../../constants';

import * as Services from '../../services';

export const toggleHasMore = value => {
  return {
    type: AppConstant.ActionTypes.HAS_MORE,
    payload: {
      data: value,
    },
  };
};

export const saveCards = cards => {
  return (dispatch, getState) => {
    dispatch({
      type: AppConstant.ActionTypes.SAVE_CARDS,
      payload: {
        data: getState().users.cards.concat(cards),
      },
    });
  };
};

export const deleteCard = card => {
  return (dispatch, getState) => {
    let cards = getState().users.cards.filter(item => {
      return item.id !== card.id;
    });
    dispatch({
      type: AppConstant.ActionTypes.SAVE_CARDS,
      payload: {
        data: cards,
      },
    });
  };
};

export const updateUsers = users => {
  return {
    type: AppConstant.ActionTypes.ALL_USERS,
    payload: {
      data: users,
    },
  };
};

export const getAllUsers = (cursor, keyword) => {
  return async (dispatch, getState) => {
    try {
      let users = await Services.UserService.getAll(cursor, keyword),
        usersToExclude = [
          getState().onboard.user.id,
          ..._.map(getState().onboard.user.blocked_users || [], 'block_by'),
        ];

      dispatch(toggleHasMore(users.length >= 30));

      if (users) {
        if (cursor) {
          users = getState().users.users.concat(users);
        }

        const finalList = users.filter(user => {
          return _.indexOf(usersToExclude, user.id) === -1;
        });

        dispatch(updateUsers(finalList));
      }
    } catch (error) {
      console.log(error);
    }
  };
};
