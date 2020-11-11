import React from 'react';
import {View, Image} from 'react-native';
import {createStackNavigator} from 'react-navigation';

import {BackButton} from '../components';

import * as AppConstant from '../constants';

const stackNavigator = routes => {
  let configuration = {};
  for (let i = 0; i < routes.length; i++) {
    configuration[routes[i].routeName] = routes[i].screen;
  }

  return createStackNavigator(configuration, {
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
      headerLeft: <BackButton goBack={() => navigation.goBack()}/>,
      headerRight: <View/>,
    }),
  });
};

export default {
  stackNavigator,
};
