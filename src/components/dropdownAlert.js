import React from 'react';
import {Image, View} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import * as Services from '../services';
import * as AppConstant from '../constants';

export default props => {
  return (
    <DropdownAlert
      zIndex={999999}
      successColor={AppConstant.Colors.success}
      errorColor={AppConstant.Colors.red}
      infoColor={AppConstant.Colors.blue}
      successImageSrc={AppConstant.Images.successIcon}
      errorImageSrc={AppConstant.Images.failureIcon}
      titleStyle={{
        fontWeight: null,
        fontFamily: AppConstant.Fonts.medium,
        fontSize: wp('5.75%'),
        color: AppConstant.Colors.white,
        marginBottom: 5,
      }}
      messageStyle={{
        fontWeight: null,
        fontFamily: AppConstant.Fonts.regular,
        fontSize: wp('4%'),
        color: AppConstant.Colors.white,
      }}
      renderImage={(_props, data) => {
        return (
          <View
            style={{
              width: wp('10%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={
                data.type === 'success'
                  ? AppConstant.Images.successIcon
                  : AppConstant.Images.failureIcon
              }
            />
          </View>
        );
      }}
      inactiveStatusBarBackgroundColor={AppConstant.Colors.white}
      updateStatusBar={true}
      ref={ref => {
        if (props.modal) {
          props.modal === 'purchase'
            ? Services.AlertService.purchaseModalConfig(ref)
            : Services.AlertService.hintDetailModalConfig(ref);
        } else {
          Services.AlertService.configureAlert(ref);
        }
      }}
    />
  );
};
