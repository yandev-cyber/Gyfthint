import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AutoHeightImage from 'react-native-auto-height-image';

import * as AppConstant from '../../constants';

class slide2 extends Component {
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
            Everyone gets what they want
          </Text>
        </View>
        <AutoHeightImage width={wp('75%')} source={AppConstant.Images.slide2}/>
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
            When you see something you like, add it to
          </Text>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            your hints. GyftHint is always in your back
          </Text>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            pocket; it's as easy as taking out your phone
          </Text>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            and taking a picture.
          </Text>
        </View>
        <TouchableWithoutFeedback
          onPress={() => this.props.navigation.navigate('celebrations')}>
          <View style={{paddingHorizontal: 20}}>
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

export default slide2;
