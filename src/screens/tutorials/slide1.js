import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AutoHeightImage from 'react-native-auto-height-image';

import * as AppConstant from '../../constants';

class slide1 extends Component {
  render() {
    return (
      <View
        style={{
          height: hp('90%'),
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            minHeight: hp('15%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: wp('6.25%'),
              fontFamily: AppConstant.Fonts.bold,
              color: AppConstant.Colors.black,
            }}>
            Replace stress with joy
          </Text>
          <Text
            style={{
              fontSize: wp('3.75%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.salmon,
              marginTop: hp('2%'),
            }}>
            Never forget an event
          </Text>
        </View>
        <AutoHeightImage width={wp('60%')} source={AppConstant.Images.slide1} />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: hp('11%'),
          }}>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            GyftHint can help you stay connected with
          </Text>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            friends and family. With GyftHint's event
          </Text>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            reminders you'll never miss an important date.
          </Text>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            This is gifting, simplified.
          </Text>
        </View>
        <TouchableWithoutFeedback
          onPress={() => this.props.navigation.navigate('celebrations')}>
          <View style={{marginTop: hp('2.5%'), paddingHorizontal: 20}}>
            <Text
              style={{
                fontSize: wp('3.75%'),
                fontFamily: AppConstant.Fonts.normal,
                color: AppConstant.Colors.salmon,
              }}>
              SKIP
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default slide1;
