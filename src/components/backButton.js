import React from 'react';
import {TouchableWithoutFeedback, View, Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import * as AppConstant from '../constants';

export default props => {
  return (
    <TouchableWithoutFeedback onPress={() => props.goBack()}>
      <View style={{marginLeft: wp('3%'), padding: 10}}>
        <Image source={AppConstant.Images.backIcon}/>
      </View>
    </TouchableWithoutFeedback>
  );
};
