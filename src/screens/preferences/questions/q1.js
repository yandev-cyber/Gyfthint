import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import _ from 'lodash';
import Swipeout from 'react-native-swipeout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {CustomButton, InputField} from '../../../components';

import * as AppConstant from '../../../constants';

import * as Common from '../../../common';

class Q1 extends Component {
  state = {
    q1: [],
    showForm: false,
    name: '',
    activeRow: null,
    nahBgColor: 'lightGray',
  };

  yeahHandler = () => {
    this.setState({showForm: true});
  };

  nahHandler = () => {
    this.setState({
      nahBgColor: 'red',
      showForm: false,
      q1: [],
    });
    setTimeout(() => {
      this.props.navigation.navigate('addPreference_q2', {
        preferences: {q1: this.state.q1},
      });
    }, 1000);
  };

  addAnotherHandler = () => {
    if (this.state.name.trim().length) {
      this.setState({
        q1: _.uniq([...this.state.q1, this.state.name.trim()]),
        name: '',
      });
    }
  };

  deleteNameHandler = name => {
    this.setState({
      q1: _.filter(this.state.q1, function(item) {
        return item !== name;
      }),
    });
  };

  submitHandler = () => {
    Common.Helper.dismissKeyboard();
    if (this.state.name.trim().length) {
      this.setState({
        q1: _.uniq([...this.state.q1, this.state.name.trim()]),
        name: '',
      });
    }
    setTimeout(() => {
      this.props.navigation.navigate('addPreference_q2', {
        preferences: {q1: this.state.q1},
      });
    }, 100);
  };

  activeButton = () => {
    return !!(this.state.q1.length || this.state.name.trim().length);
  };

  onSwipeOpen(rowId, direction) {
    if (typeof direction !== 'undefined') {
      this.setState({activeRow: rowId});
    }
  }

  onSwipeClose(rowId, direction) {
    if (rowId === this.state.activeRow && typeof direction !== 'undefined') {
      this.setState({activeRow: null});
    }
  }

  renderNamesRow = (name, index) => {
    let swipeoutBtns = [
      {
        type: 'delete',
        backgroundColor: AppConstant.Colors.white,
        component: (
          <View
            style={{
              height: 40,
              backgroundColor: AppConstant.Colors.red,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 12,
            }}>
            <Image
              resizeMode="contain"
              style={{height: '40%', width: '40%'}}
              source={AppConstant.Images.deleteIcon}
            />
          </View>
        ),
        onPress: () => this.deleteNameHandler(name),
        disabled: this.state.activeRow !== index,
      },
    ];
    return (
      <Swipeout
        key={index}
        buttonWidth={wp('30%')}
        close={this.state.activeRow !== index}
        backgroundColor={AppConstant.Colors.white}
        autoClose={true}
        rowID={index}
        right={swipeoutBtns}
        onOpen={(secId, rowId, direction) => this.onSwipeOpen(rowId, direction)}
        onClose={(secId, rowId, direction) =>
          this.onSwipeClose(rowId, direction)
        }>
        <View
          key={index + ''}
          style={{
            borderWidth: 1,
            borderColor: AppConstant.Colors.separator,
            justifyContent: 'center',
            height: 40,
            width: wp('80%'),
            paddingLeft: 15,
            paddingBottom: 0,
            marginTop: 12,
          }}>
          <Text
            style={{
              fontFamily: AppConstant.Fonts.medium,
              fontSize: wp('3.5%'),
              color: AppConstant.Colors.black,
            }}>
            {name}
          </Text>
        </View>
      </Swipeout>
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
          <View style={{alignItems: 'center', marginTop: hp('3%')}}>
            <Text
              style={{
                fontFamily: AppConstant.Fonts.medium,
                fontSize: wp('5%'),
                color: AppConstant.Colors.black,
              }}>
              Tell us about yourself, and
            </Text>
            <Text
              style={{
                fontFamily: AppConstant.Fonts.medium,
                fontSize: wp('5%'),
                color: AppConstant.Colors.black,
              }}>
              we'll let your friends and
            </Text>
            <Text
              style={{
                fontFamily: AppConstant.Fonts.medium,
                fontSize: wp('5%'),
                color: AppConstant.Colors.black,
              }}>
              family know
            </Text>
            <Text
              style={{
                fontFamily: AppConstant.Fonts.light,
                fontSize: wp('3.5%'),
                color: AppConstant.Colors.orText,
                marginTop: 5,
              }}>
              (so they'll stop asking you)
            </Text>
          </View>
          <View style={{alignItems: 'center', marginTop: hp('5%')}}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('5%'),
                  color: AppConstant.Colors.titlePlaceholder,
                }}>
                Do you like gift cards to shops
              </Text>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('5%'),
                  color: AppConstant.Colors.titlePlaceholder,
                }}>
                and restaurants?
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: hp('23%'),
                marginTop: 25,
              }}>
              <CustomButton
                onClick={() => this.yeahHandler()}
                title="YEAH"
                titleStyle={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('4.5%'),
                }}
                containerStyle={{
                  backgroundColor: this.state.showForm
                    ? AppConstant.Colors.darkGreen
                    : AppConstant.Colors.lightGray,
                  width: hp('10%'),
                  height: hp('10%'),
                  borderRadius: hp('5%'),
                  paddingVertical: hp('0%'),
                  paddingHorizontal: wp('0%'),
                }}
              />
              <CustomButton
                onClick={() => this.nahHandler()}
                title="NAH"
                titleStyle={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('4.5%'),
                }}
                containerStyle={{
                  backgroundColor: AppConstant.Colors[this.state.nahBgColor],
                  width: hp('10%'),
                  height: hp('10%'),
                  borderRadius: hp('5%'),
                  paddingVertical: hp('0%'),
                  paddingHorizontal: wp('0%'),
                }}
              />
            </View>
            {this.state.showForm && (
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('3.75%'),
                  color: 'rgb(161,213,138)',
                  marginTop: 20,
                }}>
                Right?!Who doesn't!
              </Text>
            )}
          </View>
          {this.state.showForm && (
            <View style={{alignItems: 'center', marginTop: hp('5%')}}>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('3.5%'),
                  color: AppConstant.Colors.titlePlaceholder,
                }}>
                Enter places you would always take a
              </Text>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('3.5%'),
                  color: AppConstant.Colors.titlePlaceholder,
                }}>
                gift card to.
              </Text>
              {this.state.q1.map((name, index) => {
                return this.renderNamesRow(name, index);
              })}
              <InputField
                onChangeText={name =>
                  this.setState({
                    name: name,
                  })
                }
                value={this.state.name}
                style={{
                  borderWidth: 1,
                  height: 40,
                  width: wp('80%'),
                  fontSize: wp('3.5%'),
                  paddingLeft: 15,
                  paddingBottom: 0,
                  marginTop: 12,
                  fontFamily: AppConstant.Fonts.medium,
                  color: AppConstant.Colors.black,
                }}
              />
              <CustomButton
                onClick={() => this.addAnotherHandler()}
                title="Add another"
                titleStyle={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('3.5%'),
                  color: 'rgb(137,207,212)',
                }}
                containerStyle={{
                  backgroundColor: AppConstant.Colors.white,
                  borderWidth: 1,
                  borderColor: AppConstant.Colors.blue,
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  marginVertical: hp('3%'),
                  elevation: 0,
                  shadowColor: AppConstant.Colors.white,
                  shadowOffset: {height: 0, width: 0},
                  shadowOpacity: 0,
                  shadowRadius: 0,
                }}
              />
              <CustomButton
                onClick={
                  this.activeButton() ? () => this.submitHandler() : null
                }
                title="Next question"
                containerStyle={{
                  backgroundColor: this.activeButton()
                    ? AppConstant.Colors.darkGreen
                    : AppConstant.Colors.lightGray,
                  marginTop: 5,
                }}
                iconName
              />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default Q1;
