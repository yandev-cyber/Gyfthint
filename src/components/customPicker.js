import React from 'react';
import {StyleSheet, Image} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import * as AppConstant from '../constants';
import * as Common from '../common';

export default props => {
  return (
    <RNPickerSelect
      Icon={() => <Image source={AppConstant.Images.dropDownIcon} />}
      placeholder={props.placeholder}
      items={props.data}
      // useNativeAndroidPickerStyle={true}
      onValueChange={props.onValueChange}
      style={{
        ...pickerSelectStyles,
        ...props.style,
        iconContainer: {
          top: 17,
          right: Common.Helper.isAndroid() ? 25 : 15,
        },
      }}
      value={props.value}
      disabled={props.disabled}
      placeholderTextColor={AppConstant.Colors.inputTextPlaceholder}
      useNativeAndroidPickerStyle={false}
    />
  );
};

const pickerSelectStyles = StyleSheet.create({
  viewContainer: {
    fontSize: wp('4%'),
    borderWidth: 1,
    borderColor: AppConstant.Colors.inputTextPlaceholder,
    borderRadius: 4,
    justifyContent: 'center',
    height: 40,
  },
  inputAndroid: {
    height: 40,
    marginLeft: 0,
    color: AppConstant.Colors.black,
    fontSize: wp('4%'),
    fontFamily: AppConstant.Fonts.medium,
  },
  headlessAndroidPicker: {
    height: 40,
    marginLeft: 0,
    color: AppConstant.Colors.black,
    fontSize: wp('4%'),
    fontFamily: AppConstant.Fonts.medium,
  },
  headlessAndroidContainer: {
    height: 40,
    paddingLeft: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: AppConstant.Colors.inputTextPlaceholder,
    borderRadius: 4,
  },
  inputIOS: {
    height: 40,
    paddingLeft: 10,
    color: AppConstant.Colors.black,
    fontSize: wp('4%'),
    fontFamily: AppConstant.Fonts.medium,
  },
});
