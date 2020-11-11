import React from 'react';
import {View, Image, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import * as AppConstant from '../constants';

export default props => {
  return (
    <TouchableWithoutFeedback onPress={props.onClick}>
      <View
        style={[
          styles.checkBox,
          props.style,
          {
            backgroundColor: props.isSelected
              ? AppConstant.Colors.checkBox
              : AppConstant.Colors.white,
          },
        ]}>
        <Image source={AppConstant.Images.checkBoxTick} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  checkBox: {
    width: wp('5%'),
    height: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: AppConstant.Colors.checkBox,
    borderWidth: 1,
    borderRadius: wp('1%'),
  },
});
