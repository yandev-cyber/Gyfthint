import React from 'react';
import {createDrawerNavigator} from 'react-navigation';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import * as Screen from '../screens';

import * as AppConstant from '../constants';

import * as Common from '../common';

import {SideDrawer} from '../components';

import bottomTabsStack from './bottomTabs.stack';
import addPreferencesStack from './addPreferences.stack';

export default createDrawerNavigator(
  {
    bottomTabs: bottomTabsStack,
    addPreferences: {
      screen: addPreferencesStack,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
    userNetwork: {
      screen: Common.Stack.stackNavigator([
        {
          routeName: 'user-network',
          screen: Screen.UserNetwork,
        },
        {
          routeName: 'user-list',
          screen: Screen.UserList,
        },
        {
          routeName: 'user-detail',
          screen: Screen.UserDetail,
        },
        {
          routeName: 'address',
          screen: Screen.Address,
        },
      ]),
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
    purchaseHistory: {
      screen: Common.Stack.stackNavigator([
        {
          routeName: 'purchase-history',
          screen: Screen.PurchaseHistory,
        },
      ]),
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
    paymentInformation: {
      screen: Common.Stack.stackNavigator([
        {
          routeName: 'payment-information',
          screen: Screen.PaymentInformation,
        },
      ]),
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
    privacyPolicy: {
      screen: Common.Stack.stackNavigator([
        {
          routeName: 'privacy-policy',
          screen: Screen.PrivacyPolicy,
        },
      ]),
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
    termsAndConditions: {
      screen: Common.Stack.stackNavigator([
        {
          routeName: 'terms-and-conditions',
          screen: Screen.TermsAndConditions,
        },
      ]),
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
    contactUs: {
      screen: Common.Stack.stackNavigator([
        {
          routeName: 'contact-us',
          screen: Screen.ContactUs,
        },
      ]),
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
    manageCelebrations: {
      screen: Common.Stack.stackNavigator([
        {
          routeName: 'manage-celebrations',
          screen: Screen.ManageCelebrations,
        },
      ]),
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
    anniversary: {
      screen: Common.Stack.stackNavigator([
        {
          routeName: 'my-anniversary',
          screen: Screen.Anniversary,
        },
      ]),
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
    editProfile: {
      screen: Common.Stack.stackNavigator([
        {
          routeName: 'edit-profile',
          screen: Screen.EditProfile,
        },
      ]),
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
  },
  {
    contentComponent: props => <SideDrawer {...props} />,
    drawerWidth: wp('100%'),
    drawerBackgroundColor: AppConstant.Colors.drawerBackground,
  },
);
