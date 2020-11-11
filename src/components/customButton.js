import React from 'react';
import {Image, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import _ from 'lodash';

import * as AppConstant from '../constants';

export default props => {
  let onClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={_.debounce(onClick, 500, {
        leading: true,
        trailing: false,
      })}>
      <View style={[styles.container, props.containerStyle]}>
        {props.facebook && (
          <Image
            style={styles.facebookIcon}
            source={AppConstant.Images.facebookIcon}
          />
        )}
        {props.leftIcon && (
          <Image style={props.leftIconStyle} source={props.leftIcon}/>
        )}
        <Text style={[styles.title, props.titleStyle]}>{props.title}</Text>
        {props.iconName && (
          <Image
            style={[styles.icon, props.iconStyle]}
            source={AppConstant.Images.forwardArrowIcon}
          />
        )}
        {props.children}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: hp('4%'),
    elevation: 3,
    shadowColor: AppConstant.Colors.black,
    shadowOffset: {height: 3, width: 0},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: wp('4%'), // 16,
    fontFamily: AppConstant.Fonts.medium,
    color: AppConstant.Colors.white,
  },
  icon: {
    marginLeft: wp('3%'),
  },
  facebookIcon: {
    marginRight: wp('3%'),
  },
});
