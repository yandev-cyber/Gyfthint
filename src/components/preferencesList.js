import React from 'react';
import {View, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import * as AppConstant from '../constants';

export default props => {
  const sizePreferences = props.preferences.q0.filter(item => item.value);
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      bounces={false}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'flex-end',
        paddingBottom: hp('5%'),
        paddingTop: 10,
      }}>
      <View
        style={{
          minHeight: 60,
          // minWidth: wp("50%"),
          maxWidth: wp('95%'),
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: AppConstant.Colors.blue,
          paddingRight: 25,
          paddingLeft: 50,
          paddingVertical: 7,
          marginTop: 10,
          borderTopLeftRadius: 50,
          borderBottomLeftRadius: 50,
        }}>
        <Text
          style={{
            color: AppConstant.Colors.black,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('3.5%'),
          }}>
          {`Best Gift Cards to Give ${
            props.userName ? _.capitalize(props.userName) : 'Me'
          }`}
        </Text>
        <Text
          style={{
            color: AppConstant.Colors.white,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('4.5%'),
            textAlign: 'right',
            marginTop: 7,
          }}>
          {props.preferences.q1.length
            ? _.join(props.preferences.q1, ', ')
            : 'N/A'}
        </Text>
      </View>
      <View
        style={{
          minHeight: 60,
          // minWidth: wp("50%"),
          maxWidth: wp('95%'),
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: AppConstant.Colors.lightGreen,
          paddingRight: 25,
          paddingLeft: 50,
          paddingVertical: 7,
          marginTop: 10,
          borderTopLeftRadius: 50,
          borderBottomLeftRadius: 50,
        }}>
        <Text
          style={{
            color: AppConstant.Colors.black,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('3.5%'),
          }}>
          {`${
            props.userName ? _.capitalize(props.userName + "'s") : 'My'
          } favourite Spirits`}
        </Text>
        <Text
          style={{
            color: AppConstant.Colors.white,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('4.5%'),
            textAlign: 'right',
            marginTop: 7,
          }}>
          {props.preferences.q2.length
            ? _.join(props.preferences.q2, ', ')
            : 'N/A'}
        </Text>
      </View>
      <View
        style={{
          minHeight: 60,
          // minWidth: wp("50%"),
          maxWidth: wp('95%'),
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: AppConstant.Colors.lightYellow,
          paddingRight: 25,
          paddingLeft: 50,
          paddingVertical: 7,
          marginTop: 10,
          borderTopLeftRadius: 50,
          borderBottomLeftRadius: 50,
        }}>
        <Text
          style={{
            color: AppConstant.Colors.black,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('3.5%'),
          }}>
          {`${
            props.userName ? _.capitalize(props.userName + "'s") : 'My'
          } Sports Teams`}
        </Text>
        <Text
          style={{
            color: AppConstant.Colors.white,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('4.5%'),
            textAlign: 'right',
            marginTop: 7,
          }}>
          {props.preferences.q3.length
            ? _.join(props.preferences.q3, ', ')
            : 'N/A'}
        </Text>
      </View>
      <View
        style={{
          minHeight: 60,
          // minWidth: wp("50%"),
          maxWidth: wp('95%'),
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: AppConstant.Colors.blue,
          paddingRight: 25,
          paddingLeft: 50,
          paddingVertical: 7,
          marginTop: 10,
          borderTopLeftRadius: 50,
          borderBottomLeftRadius: 50,
        }}>
        <Text
          style={{
            color: AppConstant.Colors.black,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('3.5%'),
          }}>
          {`Things ${
            props.userName ? _.capitalize(props.userName) : 'I'
          } loves to Do`}
        </Text>
        <Text
          style={{
            color: AppConstant.Colors.white,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('4.5%'),
            textAlign: 'right',
            marginTop: 7,
          }}>
          {props.preferences.q4.length
            ? _.join(props.preferences.q4, ', ')
            : 'N/A'}
        </Text>
      </View>
      <View
        style={{
          minHeight: 60,
          // minWidth: wp("50%"),
          maxWidth: wp('95%'),
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: AppConstant.Colors.lightGreen,
          paddingRight: 25,
          paddingLeft: 50,
          paddingVertical: 7,
          marginTop: 10,
          borderTopLeftRadius: 50,
          borderBottomLeftRadius: 50,
        }}>
        <Text
          style={{
            color: AppConstant.Colors.black,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('3.5%'),
          }}>
          {`${
            props.userName ? _.capitalize(props.userName) : 'I'
          } would Love This Gift`}
        </Text>
        <Text
          style={{
            color: AppConstant.Colors.white,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('4.5%'),
            textAlign: 'right',
            marginTop: 7,
          }}>
          {props.preferences.q5.length
            ? _.join(props.preferences.q5, ', ')
            : 'N/A'}
        </Text>
      </View>
      <View
        style={{
          minHeight: 60,
          // minWidth: wp("50%"),
          maxWidth: wp('95%'),
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: AppConstant.Colors.blue,
          paddingRight: 25,
          paddingLeft: 50,
          paddingVertical: 7,
          marginTop: 10,
          borderTopLeftRadius: 50,
          borderBottomLeftRadius: 50,
        }}>
        <Text
          style={{
            color: AppConstant.Colors.black,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('3.5%'),
          }}>
          {`${
            props.userName ? _.capitalize(props.userName + "'s") : 'My'
          } Sizes`}
        </Text>
        <Text
          style={{
            color: AppConstant.Colors.white,
            fontFamily: AppConstant.Fonts.medium,
            fontSize: wp('4.5%'),
            textAlign: 'right',
            marginTop: 7,
          }}>
          {sizePreferences.length
            ? sizePreferences.map((item, index) => {
                return (
                  _.capitalize(item.label) +
                  ' size - ' +
                  item.value +
                  `${index === sizePreferences.length - 1 ? '' : ', '}`
                );
              })
            : 'N/A'}
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};
