import * as Firebase from 'react-native-firebase';

import * as AppConstant from '../../constants';

import * as Services from '../../services';

import * as Common from '../../common';

import * as Actions from '../actions';

// Save authenticated user in redux
export const saveLoggedInUser = user => {
  return {
    type: AppConstant.ActionTypes.SAVE_USER,
    payload: {
      data: user,
    },
  };
};

// To send verification code via firebase
export const sendSecurityCode = formValues => {
  return async dispatch => {
    try {
      let result;
      const isConnected = await Common.Helper.checkConnection();
      if (isConnected) {
        dispatch(Actions.toggleLoader(true));
        const user = await Services.UserService.checkExistence(
          formValues.countryCode
            ? formValues.countryCode + formValues.phone
            : formValues.phone,
          'phone',
        );

        switch (formValues.type) {
          case 'login': {
            if (user && user.active) {
              formValues = {...user, type: 'login'};
              result = await Services.AuthService.sendSecurityCode(
                formValues.countryCode
                  ? formValues.countryCode + formValues.phone
                  : formValues.phone,
              );
            } else {
              setTimeout(function() {
                // Common.Alert.show(
                //   "",
                //   user
                //     ? AppConstant.Alert.ACCOUNT_BLOCKED
                //     : AppConstant.Alert.LOGIN_NOT_REGISTERED
                // );
                Services.AlertService.show(
                  'error',
                  'Failed',
                  user
                    ? AppConstant.Alert.ACCOUNT_BLOCKED
                    : AppConstant.Alert.LOGIN_NOT_REGISTERED,
                );
              }, 2000);
            }
          }
            break;
          case 'signup': {
            console.log(user);
            if (!user) {
              result = await Services.AuthService.sendSecurityCode(
                formValues.countryCode + formValues.phone,
              );
            } else {
              setTimeout(function() {
                // Common.Alert.show("", AppConstant.Alert.SIGNUP_ALREADY_EXIST);
                Services.AlertService.show(
                  'error',
                  'Failed',
                  AppConstant.Alert.SIGNUP_ALREADY_EXIST,
                );
              }, 2000);
            }
          }
            break;
          default:
            break;
        }
        dispatch(Actions.toggleLoader(false));
        if (result) {
          setTimeout(() => {
            Services.NavigationService.navigate('verificationCode', {
              userDetails: formValues,
            });
          }, 500);
        }
      } else {
        Services.AlertService.show(
          'error',
          'Failed',
          AppConstant.Alert.INTERNET_CONNECTIVITY,
        );
        // Common.Alert.show("", AppConstant.Alert.INTERNET_CONNECTIVITY);
      }
    } catch (error) {
      console.log(error);
      setTimeout(function() {
        dispatch(Actions.toggleLoader(false));
      }, 2000);
    }
  };
};

//To check verification code on firebase
export const verifySecurityCode = (verificationCode, details) => {
  return async dispatch => {
    try {
      const isConnected = await Common.Helper.checkConnection(),
        userDetails = Common.Helper.trimObj(details);

      if (isConnected) {
        dispatch(Actions.toggleLoader(true));
        const result = await Services.AuthService.verifySecurityCode(
          verificationCode,
          !!(userDetails.id && userDetails.type === 'signup'),
        );
        if (result) {
          if (userDetails.type === 'signup') {
            console.log(userDetails);
            userDetails.id = result.user.uid;
            await Services.UserService.add(userDetails);
            userDetails.dob.month = userDetails.dob.month + 1;
            console.log(userDetails);
            await Services.EventService.addEvents(
              [
                {
                  occurrence_date: new Date(
                    Date.UTC(
                      new Date().getMonth() <= details.dob.month
                        ? new Date().getFullYear()
                        : new Date().getFullYear() + 1,
                      details.dob.month,
                      details.dob.day,
                      12,
                    ),
                  ),
                  is_recurring: AppConstant.Event.RECURRING,
                  event_type: AppConstant.Event.SPECIAL_EVENT,
                  name: `birthday#${userDetails.id}#${
                    userDetails.is_birth_year ? userDetails.dob.year : null
                  }#${userDetails.first_name} ${userDetails.last_name}`,
                },
              ],
              userDetails.id,
            );
          }
          dispatch(saveLoggedInUser({...userDetails, id: result.user.uid}));
          await Common.Helper.saveData('isAuthenticated', 'true');
          Services.AnalyticsService.logEvent(
            AppConstant.AnalyticsEvents[
              userDetails.type === 'signup' ? 'SIGNUP' : 'LOGIN'
              ],
          );
          Services.NavigationService.navigate(
            userDetails.type === 'signup' ? 'tutorials' : 'landing',
          );
        }
        dispatch(Actions.toggleLoader(false));
      } else {
        setTimeout(function() {
          // Common.Alert.show("", AppConstant.Alert.INTERNET_CONNECTIVITY);
          Services.AlertService.show(
            'error',
            'Failed',
            AppConstant.Alert.INTERNET_CONNECTIVITY,
          );
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const facebookAuthentication = () => {
  return async dispatch => {
    try {
      const isConnected = await Common.Helper.checkConnection();
      if (isConnected) {
        const userDetails = await Services.AuthService.facebookAuthentication();
        dispatch(Actions.toggleLoader(true));
        if (userDetails) {
          const user = await Services.UserService.checkExistence(
            userDetails.email,
            'email',
          );
          if (!user) {
            setTimeout(() => {
              Services.NavigationService.navigate('postFacebook', {
                userDetails: userDetails,
              });
            }, 1000);
          } else {
            await Services.AuthService.facebookFirebaseLogin();
            dispatch(saveLoggedInUser(user));
            await Common.Helper.saveData('isAuthenticated', 'true');
            setTimeout(() => {
              Services.NavigationService.navigate('landing');
            }, 1000);
          }
        }
        dispatch(Actions.toggleLoader(false));
      } else {
        setTimeout(function() {
          // Common.Alert.show("", AppConstant.Alert.INTERNET_CONNECTIVITY);
          Services.AlertService.show(
            'error',
            'Failed',
            AppConstant.Alert.INTERNET_CONNECTIVITY,
          );
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const celebrationsList = () => {
  return async dispatch => {
    try {
      const celebrations = await Services.CelebrationService.getAll();
   
      if (celebrations) {
        dispatch({
          type: AppConstant.ActionTypes.CELEBRATION_LIST,
          payload: {
            data: celebrations,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const subscribeCelebrations = celebration => {
  function findCelebration(item) {
    return item.id === celebration.id;
  }

  return (dispatch, getState) => {
    let subscribedCelebrations = [...getState().onboard.subscribedCelebrations];
    if (
      subscribedCelebrations.length > 0 &&
      subscribedCelebrations.findIndex(findCelebration) > -1
    ) {
      subscribedCelebrations.splice(
        subscribedCelebrations.findIndex(findCelebration),
        1,
      );
    } else {
      // subscribedCelebrations.push(celebration);
      let occurrenceYear = celebration.occurrence_date.split('-')[0],
        occurrenceMonth = celebration.occurrence_date.split('-')[1],
        occurrenceDay = celebration.occurrence_date.split('-')[2];

      let event = {
        has_last_day: false,
        ...celebration,
        occurrence_date: new Date(
          Date.UTC(occurrenceYear, +occurrenceMonth - 1, occurrenceDay, 12),
        ),
      };
      if (event.has_last_day) {
        let lastOccurrenceYear = event.last_day_occurrence_date.split('-')[0],
          lastOccurrenceMonth = event.last_day_occurrence_date.split('-')[1],
          lastOccurrenceDay = event.last_day_occurrence_date.split('-')[2];
        event.last_day_occurrence_date = new Date(
          Date.UTC(
            lastOccurrenceYear,
            +lastOccurrenceMonth - 1,
            lastOccurrenceDay,
            12,
          ),
        );
      }
      subscribedCelebrations.push(event);
    }
    dispatch({
      type: AppConstant.ActionTypes.SUBSCRIBE_CELEBRATION,
      payload: {
        data: subscribedCelebrations,
      },
    });
  };
};

export const addEvents = (events, path) => {
  console.log(path);
  return async (dispatch, getState) => {
    try {
      dispatch(Actions.toggleLoader(true));
      if (events.length > 0) {
        const result = await Services.UserService.addEvents(
          events,
          getState().onboard.user.id,
        );
        if (result) {
          Services.NavigationService.navigate(path);
        }
      } else {
        Services.NavigationService.navigate(path);
      }
      dispatch(Actions.toggleLoader(false));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateAddress = (userDetail, productDetail, user) => {
  return async (dispatch, getState) => {
    try {
      if (!userDetail.is_mailing) {
        userDetail.mailing_address = userDetail.shipping_address;
      }

      dispatch(Actions.toggleLoader(true));

      dispatch({
        type: AppConstant.ActionTypes.UPDATE_ADDRESS,
        payload: {
          data: userDetail,
        },
      });

      const result = await Services.UserService.update(
        getState().onboard.user.id,
        userDetail,
      );

      if (result) {
        if (productDetail) {
          Services.NavigationService.navigate(
            productDetail.type === AppConstant.Status.hintType.WEB
              ? 'addHint_web_preview'
              : 'addHint_product_detail',
            {
              formValues: productDetail,
            },
          );
        }
        if (user) {
          Services.NavigationService.navigate('user-detail', {user: user});
        }
      }

      dispatch(Actions.toggleLoader(false));
    } catch (error) {
      console.log(error);
    }
  };
};

export const signOut = () => {
  return async dispatch => {
    try {
      dispatch({type: AppConstant.ActionTypes.INITIATE_ONBOARDING});
      dispatch({type: AppConstant.ActionTypes.INITIATE_USERS});
      dispatch({type: AppConstant.ActionTypes.INITIATE_NOTIFICATION});
      dispatch({type: AppConstant.ActionTypes.INITIATE_NETWORK});
      dispatch({type: AppConstant.ActionTypes.INITIATE_COMMON});
      dispatch({type: AppConstant.ActionTypes.INITIATE_EVENT});
      dispatch({type: AppConstant.ActionTypes.INITIATE_GOOGLE_SEARCH});
      Services.NavigationService.navigate('onboarding');
      await Services.UserService.update(null, {fbiid: ''});
      await Common.Helper.clearData();
      await Services.AuthService.customFacebookLogout();
      Firebase.auth().signOut();
    } catch (error) {
      console.log(error);
    }
  };
};
