import React from 'react';
import {View, TouchableWithoutFeedback, Image} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import * as Screen from '../screens';
import * as AppConstant from '../constants';

import {BackButton} from '../components';

export default createStackNavigator(
  {
    dashboard: Screen.Dashboard,
    'user-detail': {
      screen: Screen.UserDetail,
      navigationOptions: ({navigation}) => ({
        headerLeft: <BackButton goBack={() => navigation.goBack()} />,
        headerRight: <View />,
      }),
    },
    'user-list': {
      screen: Screen.UserList,
      navigationOptions: ({navigation}) => ({
        headerLeft: <BackButton goBack={() => navigation.goBack()} />,
        headerRight: <View />,
      }),
    },
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
      headerLeft: (
        <TouchableWithoutFeedback onPress={() => navigation.toggleDrawer()}>
          <View style={{marginLeft: wp('3%'), padding: 10}}>
            <Image source={AppConstant.Images.menuIcon} />
          </View>
        </TouchableWithoutFeedback>
      ),
      headerRight: <View/>,
    }),
  },
);
