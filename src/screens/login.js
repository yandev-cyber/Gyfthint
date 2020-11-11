import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {Formik} from 'formik';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {CustomButton, InputField} from '../components';

import * as Actions from '../redux/actions';

import * as Common from '../common';

import * as AppConstant from '../constants';

import * as Services from '../services';

class Login extends Component {
  state = {
    countryCode: '+1',
  };

  checkErrors = props => {
    console.log(props);
    if (props.dirty) {
      if (props.errors.phone) {
        Services.AlertService.show('error', 'Failed', props.errors.phone);
        return;
      }
      Common.Helper.dismissKeyboard();
      props.submitForm().then(r => console.log(r));
    } else {
      Services.AlertService.show('error', 'Failed', AppConstant.Alert.PHONE_1);
    }
  };

  activeButton = props => {
    if (props && props.dirty) {
      return Boolean(props.values.phone);
    }
    return false;
  };

  toggleCountry = props => {
    props.setFieldValue(
      'countryCode',
      props.values.countryCode === '+1' ? '+91' : '+1',
    );
  };

  render() {
    return (
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: wp('5%'),
            }}>
            <Image resizeMode="contain" source={AppConstant.Images.logo}/>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: wp('5%'),
            }}>
            <Text style={[styles.textStyle]}>Welcome back</Text>
            <CustomButton
              titleStyle={styles.buttonText}
              facebook
              onClick={this.props.facebookAuthentication}
              title="Login with Facebook"
              containerStyle={[styles.facebookButton]}
            />
            <View style={styles.seperatorContainer}>
              <View style={styles.seperator}/>
              <Text
                style={{
                  marginHorizontal: wp('2%'),
                  marginBottom: hp('0.5%'),
                  fontFamily: AppConstant.Fonts.regular,
                  fontSize: wp('3.25%'),
                  color: AppConstant.Colors.orText,
                }}>
                or
              </Text>
              <View style={styles.seperator}/>
            </View>
            <Formik
              validationSchema={Common.Validations.LoginSchema}
              initialValues={{type: 'login', countryCode: '+1'}}
              onSubmit={(values) =>
                this.props.sendSecurityCode(values)
              }>
              {props => {
                return (
                  <React.Fragment>
                    <Text
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={styles.label}>
                      Login with Mobile Phone Number
                    </Text>
                    <View style={{flexDirection: 'row', marginTop: hp('2%')}}>
                      <TouchableWithoutFeedback
                        onLongPress={() => this.toggleCountry(props)}>
                        <View
                          style={{
                            width: wp('10%'),
                            borderBottomWidth: 1,
                            borderColor: AppConstant.Colors.separator,
                          }}>
                          <Text
                            style={{
                              alignSelf: 'center',
                              marginTop: Common.Helper.isAndroid() ? 6 : 0,
                              color: AppConstant.Colors.black,
                              fontSize: wp('4%'),
                              fontFamily: AppConstant.Fonts.light,
                            }}>
                            {props.values.countryCode}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                      <InputField
                        onChangeText={props.handleChange('phone')}
                        onBlur={props.handleBlur('phone')}
                        keyboardType={'number-pad'}
                        maxLength={10}
                        returnKeyType="done"
                        onSubmitEditing={() => Common.Helper.dismissKeyboard()}
                        value={props.values.phone}
                        placeholder="Mobile number"
                        style={{width: wp('70%')}}
                      />
                    </View>
                    <CustomButton
                      onClick={
                        this.activeButton(props)
                          ? () => this.checkErrors(props)
                          : null
                      }
                      title="Send me my code"
                      titleStyle={styles.buttonText}
                      containerStyle={[
                        styles.submitButton,
                        {
                          backgroundColor: this.activeButton(props)
                            ? AppConstant.Colors.lightGreen
                            : AppConstant.Colors.lightGray,
                        },
                      ]}
                      iconName="md-arrow-forward"
                    />
                  </React.Fragment>
                );
              }}
            </Formik>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp('10%'),
    backgroundColor: AppConstant.Colors.white,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  textStyle: {
    alignSelf: 'center',
    color: AppConstant.Colors.black,
    fontSize: wp('5%'), // 20,
    marginBottom: hp('2%'),
    fontFamily: AppConstant.Fonts.medium,
  },
  facebookButton: {
    backgroundColor: AppConstant.Colors.facebookColor,
    marginHorizontal: wp('3%'),
    marginTop: wp('5%'),
  },
  seperatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('5%'),
    marginHorizontal: wp('3%'),
  },
  seperator: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: AppConstant.Colors.separator,
  },
  label: {
    fontSize: wp('3.5%'), // 14,
    fontFamily: AppConstant.Fonts.normal,
    alignSelf: 'flex-start',
    color: AppConstant.Colors.titlePlaceholder,
  },
  submitButton: {
    marginBottom: wp('5%'),
    marginTop: wp('10%'),
  },
  buttonText: {
    fontFamily: AppConstant.Fonts.medium,
    // fontSize: 16
  },
});

const mapStateToProps = state => ({
  isAuthenticated: state.onboard.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  sendSecurityCode: data => dispatch(Actions.sendSecurityCode(data)),
  facebookAuthentication: () => dispatch(Actions.facebookAuthentication()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
