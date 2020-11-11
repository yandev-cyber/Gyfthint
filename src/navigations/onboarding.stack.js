import React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import * as Screen from '../screens';
import * as AppConstant from '../constants';

import {BackButton} from '../components';

export default createStackNavigator(
  {
    welcome: {
      screen: Screen.Welcome,
      navigationOptions: {
        header: null,
      },
    },
    registration: {
      screen: Screen.Registration,
      navigationOptions: ({navigation}) => ({
        headerLeft: <BackButton goBack={navigation.goBack} />,
      }),
    },
    login: {
      screen: Screen.Login,
      navigationOptions: ({navigation}) => ({
        headerTitle: '',
        headerLeft: <BackButton goBack={navigation.goBack} />,
      }),
    },
    postFacebook: {
      screen: Screen.PostFacebook,
      navigationOptions: () => ({
        headerTitle: 'Continue as',
        headerTitleStyle: {
          color: AppConstant.Colors.black,
          fontSize: wp('4.5%'), // 18,
          fontFamily: AppConstant.Fonts.regular,
          fontWeight: undefined,
        },
      }),
    },
    verificationCode: {
      screen: Screen.VerificationCode,
      navigationOptions: ({navigation}) => ({
        headerTitle: '',
        headerLeft: <BackButton goBack={navigation.goBack} />,
      }),
    },
    tutorials: {
      screen: Screen.Tutorials,
      navigationOptions: () => ({
        header: null,
      }),
    },
    celebrations: {
      screen: Screen.Celebrations,
      navigationOptions: () => ({
        headerTitle: 'Celebrations',
      }),
    },
    addCelebrations: {
      screen: Screen.AddCelebrations,
      navigationOptions: () => ({
        headerTitle: 'Celebrations',
      }),
    },
  },
  {
    defaultNavigationOptions: () => ({
      headerTitle: 'Create Profile',
      headerTitleContainerStyle: {
        justifyContent: 'center',
      },
      headerTitleStyle: {
        color: AppConstant.Colors.black,
        fontSize: wp('5%'),
        fontFamily: AppConstant.Fonts.medium,
        fontWeight: undefined,
      },
      headerStyle: {
        elevation: 0,
        backgroundColor: AppConstant.Colors.white,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerLeft: <View />,
      headerRight: <View />,
    }),
  },
);
