import React from 'react';
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {CustomModal} from '../components';

import * as AppConstant from '../constants';

export default props => {
  return (
    <CustomModal
      onBackdropPress={() => props.closeModal()}
      isVisible={props.isVisible}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            height: hp('30%'),
            width: '80%',
            alignItems: 'center',
            borderRadius: 20,
            backgroundColor: 'white',
            elevation: props.isVisible ? 5 : 0,
            shadowColor: AppConstant.Colors.black,
            shadowOffset: {height: 0.1, width: 0.0},
            shadowOpacity: 0.5,
            shadowRadius: 5,
          }}>
          <View
            style={{
              height: hp('10%'),
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{width: '90%'}}>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.bold,
                  fontSize: wp('5.5%'),
                  color: AppConstant.Colors.black,
                }}>
                {`${props.user.first_name} ${props.user.last_name}`}
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={props.closeModal}>
              <View
                style={{
                  width: '10%',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Image source={AppConstant.Images.drawerCloseIcon}/>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              flex: 1,
              width: '90%',
            }}>
            <View style={{height: hp('13%')}}/>
            <View
              style={{
                height: hp('4%'),
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image source={AppConstant.Images.trashIcon}/>
                <TouchableWithoutFeedback onPress={props.remove}>
                  <View
                    style={{
                      paddingLeft: 10,
                    }}>
                    <Text
                      style={{
                        fontFamily: AppConstant.Fonts.normal,
                        fontSize: wp('3.5%'),
                        color: AppConstant.Colors.red,
                      }}>
                      Remove from network
                    </Text>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: AppConstant.Colors.red,
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <TouchableWithoutFeedback onPress={props.block}>
                <View>
                  <Text
                    style={{
                      fontFamily: AppConstant.Fonts.normal,
                      fontSize: wp('3.5%'),
                      color: AppConstant.Colors.darkGray,
                    }}>
                    Block user
                  </Text>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: AppConstant.Colors.darkGray,
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    </CustomModal>
  );
};
