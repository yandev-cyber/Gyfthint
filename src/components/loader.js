import React from 'react';
import {ActivityIndicator} from 'react-native';

import * as AppConstant from '../constants';

import * as Common from '../common';

export default props => {
  return (
    <ActivityIndicator
      style={props.style}
      color={props.color || AppConstant.Colors.salmon}
      size={Common.Helper.isAndroid() ? 40 : 1}
    />
  );
};
