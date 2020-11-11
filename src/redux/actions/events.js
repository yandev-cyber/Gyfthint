import _ from 'lodash';

import * as AppConstant from '../../constants';

export const selectMonth = value => {
  return {
    type: AppConstant.ActionTypes.SELECT_MONTH,
    payload: {
      data: value,
    },
  };
};

export const saveEvents = events => {
  return (dispatch, getState) => {
    let userIds = [],
      specialEvents,
      holidayEvents;
    userIds = _.map(getState().network.networkUsers, 'friend_id');
    userIds.push(getState().onboard.user.id);
    events = _.filter(events, event => {
      return _.indexOf(userIds, event.user_id) > -1;
    });
    specialEvents = _.filter(events, [
      'event_type',
      AppConstant.Event.SPECIAL_EVENT,
    ]);

    holidayEvents = _.filter(events, event => {
      let dateAfterYear = new Date(
        Date.now() +
        (new Date().getFullYear() % 4 === 0 ? 366 : 365) * 24 * 60 * 60 * 1000,
      );
      return (
        event.event_type === AppConstant.Event.HOLIDAY &&
        new Date(event.occurrence_date.toDate()) <=
        new Date(
          Date.UTC(
            dateAfterYear.getFullYear(),
            dateAfterYear.getMonth(),
            dateAfterYear.getDate(),
            12,
          ),
        )
      );
    });
    holidayEvents = _.uniqBy(holidayEvents, event => {
      return event.name;
    });
    events = [...holidayEvents, ...specialEvents];
    events = _.orderBy(events, ['occurrence_date'], ['asc']);
    events = _.map(events, event => ({
      ...event,
      occurrence_date: new Date(event.occurrence_date.toDate()),
    }));

    let months = [
      {
        label: 'JANUARY',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 0;
        }),
      },
      {
        label: 'FEBRUARY',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 1;
        }),
      },
      {
        label: 'MARCH',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 2;
        }),
      },
      {
        label: 'APRIL',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 3;
        }),
      },
      {
        label: 'MAY',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 4;
        }),
      },
      {
        label: 'JUNE',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 5;
        }),
      },
      {
        label: 'JULY',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 6;
        }),
      },
      {
        label: 'AUGUST',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 7;
        }),
      },
      {
        label: 'SEPTEMBER',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 8;
        }),
      },
      {
        label: 'OCTOBER',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 9;
        }),
      },
      {
        label: 'NOVEMBER',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 10;
        }),
      },
      {
        label: 'DECEMBER',
        events: _.filter(events, event => {
          return event.occurrence_date.getMonth() === 11;
        }),
      },
    ];

    dispatch({
      type: AppConstant.ActionTypes.SAVE_MONTHLY_EVENTS,
      payload: {
        data: months,
      },
    });
  };
};
