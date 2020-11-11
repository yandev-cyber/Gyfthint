import React from 'react';
import {StatusBar, Platform, Dimensions} from 'react-native';
import Modal from 'react-native-modal';

import * as AppConstant from '../constants';

import * as Common from '../common';

export default props => {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight =
    Platform.OS === 'ios'
      ? Dimensions.get('window').height
      : require('react-native-extra-dimensions-android').get(
          'REAL_WINDOW_HEIGHT',
        );

  return (
    <Modal
      {...props}
      style={{margin: 0}}
      backdropColor={
        props.backgroundColor ? props.backgroundColor : AppConstant.Colors.white
      }
      backdropOpacity={props.opacity ? props.opacity : 0.7}
      animationIn={Common.Helper.isAndroid() ? 'slideInUp' : 'fadeIn'}
      animationOut={Common.Helper.isAndroid() ? 'slideOutDown' : 'fadeOut'}
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      deviceHeight={props.height ? props.height : deviceHeight}
      deviceWidth={deviceWidth}
      isVisible={props.isVisible}>
      <StatusBar backgroundColor={AppConstant.Colors.modalStatusBar} />
      {props.children}
    </Modal>
  );
};
