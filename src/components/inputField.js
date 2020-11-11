import React, {Component} from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import * as AppConstant from '../constants';

export class inputField extends Component {
  render() {
    return (
      <TextInput
        {...this.props}
        underlineColorAndroid={AppConstant.Colors.white}
        autoCorrect={false}
        placeholderTextColor={AppConstant.Colors.inputTextPlaceholder}
        style={[styles.input, this.props.style]}
      />
    );
  }
}

export default inputField;

const styles = StyleSheet.create({
  input: {
    borderColor: AppConstant.Colors.separator,
    borderBottomWidth: 1,
    padding: 0,
    paddingBottom: hp('0.5%'),
    paddingLeft: wp('1%'),
    fontSize: wp('4%'), //16,
    fontFamily: AppConstant.Fonts.light,
  },
});
