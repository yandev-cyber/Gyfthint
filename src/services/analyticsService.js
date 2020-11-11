import * as firebase from 'react-native-firebase';
let Analytics = firebase.analytics();

const setUser = userId => {
  Analytics.setUserId(userId);
};

const logEvent = (eventName, params) => {
  Analytics.logEvent(eventName, params);
};

export default {
  setUser,
  logEvent,
};
