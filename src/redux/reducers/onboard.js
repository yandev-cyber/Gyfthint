import * as AppConstant from '../../constants';

const initialState = {
  isLoading: true,
  isAuthenticated: false,
  confirmResult: null,
  user: {
    image: '',
    // image: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2534904423250334&height=50&width=50&ext=1556192416&hash=AeRoyvnJLU24h_Tb',
    dob: {
      month: 2,
      day: 22,
      year: '1998',
    },
    first_name: '',
    last_name: '',
    shipping_address: {
      line_1: '',
      line_2: '',
      state: '',
      zip: '',
      city: '',
    },
    mailing_address: {
      line_1: '',
      line_2: '',
      state: '',
      zip: '',
      city: '',
    },
    blocked_users: [],
    preferences: [],
  },
  celebrations: [],
  subscribedCelebrations: [],
};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case AppConstant.ActionTypes.AUTHENTICATION: {
      return {
        ...state,
        isAuthenticated: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.INITIATE_ONBOARDING: {
      return {
        ...initialState,
      };
    }
    case AppConstant.ActionTypes.SAVE_USER: {
      return {
        ...state,
        user: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.CELEBRATION_LIST: {
      return {
        ...state,
        celebrations: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.SUBSCRIBE_CELEBRATION: {
      return {
        ...state,
        subscribedCelebrations: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.UPDATE_ADDRESS: {
      return {
        ...state,
        user: {
          ...state.user,
          shipping_address: action.payload.data.shipping_address,
          mailing_address: action.payload.data.mailing_address,
          is_mailing: action.payload.data.is_mailing,
        },
      };
    }
    default:
      return state;
  }
};
