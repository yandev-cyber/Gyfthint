import React from 'react';
import {View, Image} from 'react-native';
import {createStackNavigator} from 'react-navigation';

import * as Screen from '../screens';

import * as AppConstant from '../constants';

import {BackButton} from '../components';

export default createStackNavigator(
  {
    addPreference_intro: Screen.Introduction,
    addPreference_q1: Screen.Q1,
    addPreference_q2: Screen.Q2,
    addPreference_q3: Screen.Q3,
    addPreference_q4: Screen.Q4,
    addPreference_q5: Screen.Q5,
    addPreference_q0: Screen.Q0,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      headerTitle: (
        <Image
          resizeMode="contain"
          source={require('../assets/images/header-logo.png')}
        />
      ),
      headerTitleContainerStyle: {
        justifyContent: 'center',
      },
      headerStyle: {
        elevation: 0,
        backgroundColor: AppConstant.Colors.white,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerLeft: <BackButton goBack={() => navigation.goBack()} />,
      headerRight: <View />,
    }),
  },
);
