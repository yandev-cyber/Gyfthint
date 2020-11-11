import React, {Component} from 'react';
import {StyleSheet, View, Linking} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Firebase from 'react-native-firebase';
import VersionCheck from 'react-native-version-check';
import RNExitApp from 'react-native-exit-app';

import * as AppConstant from '../constants';

import * as Services from '../services';

import * as Common from '../common';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextRoute: 'onboarding',
      isUpdated: false,
      isConnected: false,
    };
    Services.AnalyticsService.logEvent(AppConstant.AnalyticsEvents.APP_OPEN);
  }

  async componentDidMount() {
    if (!(await Common.Helper.checkConnection())) {
      return Common.Alert.show(
        'Connection',
        'Please check your internet connection',
        null,
        [
          {
            text: 'OK',
            onPress: async () => {
              RNExitApp.exitApp();
            },
          },
        ],
      );
    } else {
      this.setState({isConnected: true});
    }

    VersionCheck.needUpdate()
      .then(async res => {
        if (res && res.isNeeded) {
          Common.Alert.show(
            'New version available',
            'Please, update app to new version to continue.',
            null,
            [
              {
                text: 'Update',
                onPress: async () => {
                  Linking.openURL(await VersionCheck.getStoreUrl());
                },
              },
            ],
          );
        } else {
          this.setState({isUpdated: true});
        }
      })
      .catch(err => {
        console.log(err);
      });

    console.log('ASYNCSTORAGE', await Common.Helper.getData('isAuthenticated'));
    console.log('Component Mounted');

    if (await Common.Helper.getData('isAuthenticated')) {
      console.log('Authenticated');
      this.setState({
        nextRoute: 'landing',
      });
    }

    Firebase.links().onLink(url => {
      console.log(Common.Helper.parseUrl(url));
    });

    Firebase.links()
      .getInitialLink()
      .then(url => {
        if (url) {
          console.log(Common.Helper.parseUrl(url));
        }
      });

    const enabled = await Firebase.messaging().hasPermission();
    if (!enabled) {
      // user has permissions
      try {
        await Firebase.messaging().requestPermission();
        // User has authorised
      } catch (error) {
        console.log(error);
        // User has rejected permissions
      }
    }

    Firebase.notifications().onNotificationDisplayed(notification => {
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      if (!Common.Helper.isAndroid()) {
        Services.UserService.update(null, {
          badgeCount: 0,
        });
        Firebase.notifications().setBadge(0);
      }
      console.log(notification);
    });
    Firebase.notifications().onNotification(notification => {
      // Process your notification as required
      if (!Common.Helper.isAndroid()) {
        Services.UserService.update(null, {
          badgeCount: 0,
        });
        Firebase.notifications().setBadge(0);
      }
      console.log(notification);
    });
    Firebase.notifications().onNotificationOpened(response => {
      // Get the action triggered by the notification being opened
      const action = response.action;

      if (!Common.Helper.isAndroid()) {
        Services.UserService.update(null, {
          badgeCount: 0,
        });
        Firebase.notifications().setBadge(0);
      }
      // Get information about the notification that was opened
      const notification = response.notification;
      console.log(action);
      console.log(notification);
    });

    const notificationOpen = await Firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      // App was opened by a notification
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification = notificationOpen.notification;
      console.log(action);
      console.log(notification);
    }

    Common.Helper.networkChangeListener();
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isUpdated && this.state.isConnected && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              {/* <Animatable.Text onAnimationEnd={() => Services.NavigationService.navigate(this.state.nextRoute)} style={{ fontSize: 30 }} animation="bounceIn" duration={2500} delay={3000}>LOGO</Animatable.Text> */}
              <Animatable.Image
                onAnimationEnd={() =>
                  Services.NavigationService.navigate(this.state.nextRoute)
                }
                animation="bounceIn"
                duration={2000}
                delay={1500}
                source={AppConstant.Images.bulbIcon}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: 'white',
              }}>
              <Animatable.Text
                style={{
                  fontSize: wp('10%'),
                  color: AppConstant.Colors.salmon,
                  fontFamily: AppConstant.Fonts.sylfaen,
                  height: 'auto',
                }}
                animation="fadeIn"
                duration={1000}
                delay={500}>
                Gyft
              </Animatable.Text>
              <Animatable.Text
                style={{
                  fontSize: wp('10%'),
                  color: AppConstant.Colors.lightBlue,
                  fontFamily: AppConstant.Fonts.sylfaen,
                  height: 'auto',
                }}
                animation="fadeIn"
                duration={1000}
                delay={1000}>
                Hint
              </Animatable.Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default Splash;
