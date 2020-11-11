import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import * as AppConstant from '../../constants';

class Network extends Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: wp('4%'),
            fontFamily: AppConstant.Fonts.normal,
            color: AppConstant.Colors.black,
          }}>
          Coming Soon...
        </Text>
      </View>
    );
  }
}

export default Network;
