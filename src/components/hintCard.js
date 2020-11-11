import React, {useState, useEffect} from 'react';
import {TouchableWithoutFeedback, View, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';

import * as AppConstant from '../constants';
import * as Common from '../common';
import * as Services from '../services';

export default props => {
  const [imageHeight, setimageHeight] = useState(100);

  useEffect(() => {
    Common.Helper.calculateImageHeight(
      props.hint.image
        ? props.hint.image
        : AppConstant.Images.productPlaceHolder,
      wp('40%'),
    ).then(height => {
      setimageHeight(height);
    });
  });

  return (
    <TouchableWithoutFeedback
      onLongPress={props.hint.user_id === props.user.id ? () => props.deleteHint(props.hint) : null}
      onPress={() => {
        Services.AnalyticsService.logEvent(
          AppConstant.AnalyticsEvents.HINT_DETAIL,
        );
        props.selectHint(props.hint);
        props.openModal();
      }}>
      <View
        removeClippedSubviews={false}
        key={props.hint.id}
        style={{
          marginBottom: hp('3%'),
          alignItems: 'center',
          borderRadius: 10,
          width: wp('40%'),
          backgroundColor: 'white',
          elevation: 10,
          shadowColor: AppConstant.Colors.black,
          shadowOffset: {height: 0.1, width: 0.0},
          shadowOpacity: 0.2,
          shadowRadius: 6,
        }}>
        <View
          style={{
            overflow: 'hidden',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <FastImage
            style={{
              width: wp('40%'),
              height: imageHeight,
            }}
            source={
              props.hint.image
                ? {uri: props.hint.image}
                : AppConstant.Images.productPlaceHolder
            }
          />
          {props.hint.status === AppConstant.Status.hint.PURCHASED &&
          props.hint.user_id !== props.user.id && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: AppConstant.Colors.hintOverlay,
                opacity: 0.92,
                justifyContent: 'center',
                alignItems: 'center',
                height: imageHeight,
              }}>
              <Text
                style={{
                  color: AppConstant.Colors.overlayFont,
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('4%'),
                }}>
                Already Gifted
              </Text>
            </View>
          )}
          <Text
            style={{
              textAlign: 'center',
              marginVertical: hp('1%'),
              fontFamily: AppConstant.Fonts.medium,
              fontSize: wp('3%'),
              color: AppConstant.Colors.black,
            }}>
            {props.hint.name}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: hp('1%'),
              fontFamily: AppConstant.Fonts.medium,
              fontSize: wp('3.25%'),
              color: AppConstant.Colors.titlePlaceholder,
            }}>{`$ ${(
            props.hint.price +
            props.hint.shipping_and_handling +
            props.hint.sales_tax
          ).toFixed(2)}`}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
