import React, {Component} from 'react';
import {connect} from 'react-redux';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {CustomPicker} from '../components';

import * as AppConstant from '../constants';

export class stateDropdown extends Component {
  render() {
    return (
      <CustomPicker
        placeholder={this.props.placeholder}
        value={this.props.value}
        data={this.props.states}
        onValueChange={value => {
          this.props.onValueChange(value);
        }}
        style={{
          viewContainer: {
            borderWidth: 1,
            borderColor: AppConstant.Colors.inputTextPlaceholder,
            borderRadius: 4,
            justifyContent: 'center',
            height: 40,
            ...this.props.style.viewContainer,
          },
          headlessAndroidContainer: {
            height: 40,
            paddingLeft: 5,
            width: '100%',
            borderWidth: 1,
            borderColor: AppConstant.Colors.inputTextPlaceholder,
            borderRadius: 4,
            ...this.props.style.headlessAndroidContainer,
          },
          inputIOS: {
            height: 40,
            color: AppConstant.Colors.black,
            fontSize: wp('4%'),
            ...this.props.style.inputIOS,
          },
          inputAndroid: {
            height: 40,
            marginLeft: 0,
            color: AppConstant.Colors.black,
            fontSize: wp('4%'),
            fontFamily: AppConstant.Fonts.medium,
            ...this.props.style.inputAndroid,
          },
        }}
      />
    );
  }
}

// Mapping redux state to props
const mapSateToProps = state => ({
  states: state.common.states,
});

export default connect(mapSateToProps, null)(stateDropdown);
