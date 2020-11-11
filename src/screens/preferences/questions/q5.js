import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Swipeout from 'react-native-swipeout';
import _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {CustomButton, InputField, StepIndicator} from '../../../components';

import * as AppConstant from '../../../constants';

import * as Common from '../../../common';

class Q5 extends Component {
  state = {
    q5: [],
    name: '',
    activeRow: null,
  };

  addAnotherHandler = () => {
    if (this.state.name.trim().length) {
      this.setState({
        q5: _.uniq([...this.state.q5, this.state.name.trim()]),
        name: '',
      });
    }
  };

  deleteNameHandler = name => {
    this.setState({
      q5: _.filter(this.state.q5, function(item) {
        return item !== name;
      }),
    });
  };

  submitHandler = () => {
    Common.Helper.dismissKeyboard();
    if (this.state.name.trim().length) {
      this.setState({
        q5: _.uniq([...this.state.q5, this.state.name.trim()]),
        name: '',
      });
    }
    setTimeout(() => {
      this.props.navigation.navigate('addPreference_q0', {
        preferences: {
          ...this.props.navigation.getParam('preferences'),
          q5: this.state.q5,
        },
      });
    }, 100);
  };

  activeButton = () => {
    return !!(this.state.q5.length || this.state.name.trim().length);
  };

  calculateMargin = () => {
    switch (this.state.q5.length) {
      case 0:
        return '25%';
      case 1:
        return '20%';
      case 2:
        return '15%';
      case 3:
        return '10%';
      case 4:
        return '5%';
      default:
        return '5%';
    }
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
          <View
            style={{
              width: '90%',
              marginVertical: hp('5%'),
            }}>
            <StepIndicator currentPosition={5}/>
          </View>
          <View style={{alignItems: 'center', marginTop: hp('2%')}}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('5%'),
                  color: AppConstant.Colors.titlePlaceholder,
                }}>
                Sometimes you don't need to be
              </Text>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('5%'),
                  color: AppConstant.Colors.titlePlaceholder,
                }}>
                specific. Are there kinds of gifts
              </Text>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('5%'),
                  color: AppConstant.Colors.titlePlaceholder,
                }}>
                you would always appreciate?
              </Text>
            </View>
          </View>
          <View style={{alignItems: 'center', marginTop: hp('5%')}}>
            <Text
              style={{
                fontFamily: AppConstant.Fonts.normal,
                fontSize: wp('3.5%'),
                color: AppConstant.Colors.titlePlaceholder,
              }}>
              Coffee mugs, cat toys, measuring cups...
            </Text>
            <Text
              style={{
                fontFamily: AppConstant.Fonts.normal,
                fontSize: wp('3.5%'),
                color: AppConstant.Colors.titlePlaceholder,
              }}>
              Anything and everything else
            </Text>
            {this.state.q5.map((name, index) => {
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
              onClick={() => this.submitHandler()}
              title="Add your sizes"
              containerStyle={{
                backgroundColor: AppConstant.Colors.darkGreen,
                marginTop: hp(this.calculateMargin()),
              }}
              iconName
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default Q5;
