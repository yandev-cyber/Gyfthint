import React from 'react';
import {View, Image} from 'react-native';
import {createStackNavigator} from 'react-navigation';

import * as Screen from '../screens';

import * as AppConstant from '../constants';

import {BackButton} from '../components';

export default createStackNavigator(
  {
    addHint_web_input: {
      screen: Screen.WebInput,
      navigationOptions: {
        headerTitle: (
          <Image
            resizeMode="contain"
            source={require('../assets/images/header-logo.png')}
          />
        ),
      },
    },
    addHint_web_search: {
      screen: Screen.WebSearch,
      navigationOptions: {
        headerTitle: (
          <Image
            resizeMode="contain"
            source={require('../assets/images/header-logo.png')}
          />
        ),
      },
    },
    addHint_web: {
      screen: Screen.Web,
      navigationOptions: {
        headerTitle: (
          <Image
            resizeMode="contain"
            source={require('../assets/images/header-logo.png')}
          />
        ),
      },
    },
    addHint_web_preview: {
      screen: Screen.WebPreview,
      navigationOptions: {
        headerTitle: (
          <Image
            resizeMode="contain"
            source={require('../assets/images/header-logo.png')}
          />
        ),
      },
    },
    addHint_camera: {
      screen: Screen.Camera,
      navigationOptions: () => ({
        header: null,
      }),
    },
    addHint_scanner: {
      screen: Screen.Scanner,
      navigationOptions: () => ({
        header: null,
      }),
    },
    addHint_image_preview: {
      screen: Screen.ImagePreview,
      navigationOptions: () => ({
        header: null,
      }),
    },
    addHint_product_info_1: {
      screen: Screen.ProductInfo1,
    },
    addHint_product_info_2: {
      screen: Screen.ProductInfo2,
    },
    addHint_product_info_3: {
      screen: Screen.ProductInfo3,
    },
    addHint_address: {
      screen: Screen.Address,
    },
    addHint_product_detail: {
      screen: Screen.ProductDetail,
    },
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      headerTitle: '',
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
