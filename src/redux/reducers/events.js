import * as AppConstant from '../../constants';

const initialState = {
  selectedMonth: {
    label: 'JANUARY',
    events: [],
  },
  months: [
    {
      label: 'JANUARY',
      events: [],
    },
    {
      label: 'FEBRUARY',
      events: [],
    },
    {
      label: 'MARCH',
      events: [],
    },
    {
      label: 'APRIL',
      events: [],
    },
    {
      label: 'MAY',
      events: [],
    },
    {
      label: 'JUNE',
      events: [],
    },
    {
      label: 'JULY',
      events: [],
    },
    {
      label: 'AUGUST',
      events: [],
    },
    {
      label: 'SEPTEMBER',
      events: [],
    },
    {
      label: 'OCTOBER',
      events: [],
    },
    {
      label: 'NOVEMBER',
      events: [],
    },
    {
      label: 'DECEMBER',
      events: [],
    },
  ],
};

export default (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case AppConstant.ActionTypes.SAVE_MONTHLY_EVENTS: {
      return {
        ...state,
        months: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.SELECT_MONTH: {
      return {
        ...state,
        selectedMonth: action.payload.data,
      };
    }
    case AppConstant.ActionTypes.INITIATE_EVENT: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};
