import React from 'react';
import {Text, Image} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import * as AppConstant from '../constants';

import {BottomTabBar} from '../components';

import dashboardStack from './dashboard.stack';
import networkStack from './network.stack';
import calendarStack from './calendar.stack';
import hintStack from './hints.stack';

export default createBottomTabNavigator(
  {
    'MY DASHBOARD': dashboardStack,
    'MY NETWORK': networkStack,
    'ADD HINT': () => <Text>Coming Soon</Text>,
    'MY CALENDAR': calendarStack,
    'MY HINTS': hintStack,
  },
  {
    initialRouteName: 'MY DASHBOARD',
    backBehavior: 'none',
    tabBarComponent: props => <BottomTabBar {...props} />,
    defaultNavigationOptions: ({navigation}) => {
      const {routeName} = navigation.state;
      return {
        tabBarIcon: ({focused, horizontal, tintColor}) => {
          let iconName = '';
          switch (routeName) {
            case 'MY DASHBOARD': {
              iconName = `${focused ? 'active' : 'inactive'}_dashboard`;
              break;
            }
            case 'MY NETWORK': {
              iconName = `${focused ? 'active' : 'inactive'}_network`;
              break;
            }
            case 'MY ORGANIZERS': {
              iconName = `${focused ? 'active' : 'inactive'}_organizers`;
              break;
            }
            case 'MY HINTS': {
              iconName = `${focused ? 'active' : 'inactive'}_hints`;
              break;
            }
            case 'ADD HINT': {
              if (focused) {
                console.log('clicked on add hints');
              }
              iconName = `addHint`;
              break;
            }
            default:
              return iconName;
          }

          return (
            <Image
              style={{marginBottom: routeName === 'ADD HINT' ? hp('3%') : 0}}
              source={AppConstant.Images[iconName]}
            />
          );
        },
        tabBarLabel: ({focused}) => {
          return (
            <Text
              style={{
                fontSize: wp('2%'), // 8,
                textAlign: 'center',
                fontFamily: AppConstant.Fonts.medium,
                color:
                  focused && routeName !== 'ADD HINT'
                    ? AppConstant.Colors.checkBox
                    : routeName === 'ADD HINT'
                    ? AppConstant.Colors.salmon
                    : AppConstant.Colors.titlePlaceholder,
                marginBottom: hp('1%'),
              }}>
              {routeName}
            </Text>
          );
        },
        tabBarOptions: {
          tabStyle: {
            paddingVertical: hp('1%'),
          },
          style: {
            height: hp('10'),
            elevation: 30,
            backgroundColor: AppConstant.Colors.white,
            shadowColor: 'transparent',
            shadowOpacity: 0,
            borderTopWidth: 0,
          },
        },
      };
    },
  },
);
