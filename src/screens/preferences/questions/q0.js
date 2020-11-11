import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {CustomButton, InputField, StepIndicator} from '../../../components';

import * as AppConstant from '../../../constants';

import * as Common from '../../../common';

import * as Services from '../../../services';

import * as Actions from '../../../redux/actions';

class Q0 extends Component {
  state = {
    q0: [
      {
        label: 'shoe',
        value: '',
      },
      {
        label: 'shirt',
        value: '',
      },
      {
        label: 'dress',
        value: '',
      },
      {
        label: 'glove',
        value: '',
      },
      {
        label: 'pant',
        value: '',
      },
    ],
  };

  submitHandler = async () => {
    try {
      this.props.toggleLoader(true);
      Common.Helper.dismissKeyboard();
      await Services.UserService.update(this.props.user.id, {
        preferences: {
          q0: Common.Helper.trimObj(this.state.q0),
          ...this.props.navigation.getParam('preferences'),
        },
      });
      this.props.toggleLoader(false);
      this.props.navigation.navigate(this.props.activeTab);
    } catch (error) {
      console.log(error);
      this.props.toggleLoader(false);
    }
  };

  onChangeTextHandler = (index, value) => {
    let q0 = [...this.state.q0];
    q0[index].value = value;
    this.setState({q0: q0});
  };

  renderField = (item, index) => {
    return (
      <View key={index + ''} style={{marginTop: hp('3%')}}>
        <Text
          style={{
            fontFamily: AppConstant.Fonts.normal,
            fontSize: wp('3.5%'),
            color: AppConstant.Colors.titlePlaceholder,
          }}>
          {`What's your ${item.label} size?`}
        </Text>
        <InputField
          onChangeText={value => this.onChangeTextHandler(index, value)}
          placeholder="Size"
          value={item.value}
          style={{
            borderWidth: 1,
            height: 40,
            width: wp('80%'),
            fontSize: wp('4%'),
            paddingLeft: 15,
            paddingBottom: 0,
            marginTop: 5,
            fontFamily: AppConstant.Fonts.light,
            color: AppConstant.Colors.black,
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              marginVertical: hp('5%'),
            }}>
            <StepIndicator currentPosition={6}/>
          </View>
          <View style={{alignItems: 'center', marginTop: hp('2%')}}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('5%'),
                  color: AppConstant.Colors.titlePlaceholder,
                }}>
                Which sizes do you wear?
              </Text>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.light,
                  fontSize: wp('3%'),
                  color: AppConstant.Colors.orText,
                  marginTop: 5,
                }}>
                Only answered questions will be apperared on your profile
              </Text>
            </View>
          </View>
          {/* <View> */}
          {this.state.q0.map((item, index) => this.renderField(item, index))}
          <CustomButton
            onClick={() => this.submitHandler()}
            title="Finish and View Profile"
            containerStyle={{
              backgroundColor: AppConstant.Colors.darkGreen,
              marginTop: hp('5%'),
            }}
            iconName
          />
          {/* </View> */}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

// Mapping redux state to props
const mapSateToProps = state => ({
  user: state.onboard.user,
  activeTab: state.common.activeTab,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
});

export default connect(mapSateToProps, mapDispatchToProps)(Q0);
