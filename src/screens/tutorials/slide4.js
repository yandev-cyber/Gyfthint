import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import AutoHeightImage from 'react-native-auto-height-image';

import * as AppConstant from '../../constants';

export class Slide4 extends Component {
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
            Skip the line and buy with GyftHint
          </Text>
        </View>
        <AutoHeightImage width={wp('60%')} source={AppConstant.Images.slide4} />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: hp('13%'),
          }}>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            When you know what you're going to buy there's
          </Text>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            no need to go search for it. Tap to buy the gift
          </Text>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            item right off GyftHint- we'll take it from there.
          </Text>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            Let us know if you want to ship it to yourself or{' '}
          </Text>
          <Text
            style={{
              fontSize: wp('3.25%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            right to the person you're giving it to!
          </Text>
        </View>
        <View
          style={{
            minHeight: hp('15%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: wp('4%'),
              fontFamily: AppConstant.Fonts.bold,
              color: AppConstant.Colors.black,
              marginBottom: hp('3%'),
            }}>
            Let's do this!
          </Text>
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.navigate('celebrations')}>
            <LinearGradient
              start={{x: 0.0, y: 0.25}}
              end={{x: 0.5, y: 1.0}}
              colors={['rgb(175,223,226)', 'rgb(131,208,214)']}
              style={{
                paddingVertical: hp('1.75%'),
                paddingHorizontal: wp('8%'),
                borderRadius: hp('4%'),
              }}>
              <Text
                style={{
                  fontSize: wp('4%'),
                  fontFamily: AppConstant.Fonts.medium,
                  color: AppConstant.Colors.white,
                }}>
                Add holidays you celebrate!
              </Text>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

export default Slide4;
