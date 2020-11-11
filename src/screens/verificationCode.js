// Third party libraries
import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Formik} from 'formik';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// Custom components
import {CustomButton, InputField} from '../components';
// Redux actions
import * as Actions from '../redux/actions';
// App common functions
import * as Common from '../common';
// App constants
import * as AppConstant from '../constants';

import * as Services from '../services';

// StateFull Component
class VerificationCode extends Component {
  // Component's state
  state = {
    verificationCode: '',
    resend: false,
  };

  // Component life cycle hooks
  componentDidMount() {
    // save timer id to be cleared at unmount
    this.timeout = this.enableResend();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  //Method to enable resend link after 1 minutes
  enableResend = () => {
    return setTimeout(() => {
      this.setState({resend: true});
    }, 60 * 1000);
  };

  //Method to disable resend link
  disableResend = () => {
    this.setState({resend: false});
  };

  // Method to check form validations and submit the form
  checkErrors = props => {
    console.log(props);
    if (props.dirty) {
      if (props.errors.verificationCode) {
        // Common.Alert.show("", props.errors.verificationCode);
        Services.AlertService.show(
          'error',
          'Failed',
          props.errors.verificationCode,
        );
        return;
      }
      Common.Helper.dismissKeyboard();
      props.submitForm().then(r => console.log(r));
    } else {
      // Common.Alert.show("", AppConstant.Alert.SECURITY_CODE_1);
      Services.AlertService.show(
        'error',
        'Failed',
        AppConstant.Alert.SECURITY_CODE_1,
      );
    }
  };

  activeButton = props => {
    if (props.dirty) {
      return Boolean(props.values.verificationCode);
    }
    return false;
  };

  // Method to re-send verification code
  resendCode = userDetails => {
    if (this.state.resend) {
      this.disableResend(); // disable the resend link
      this.props.sendSecurityCode(userDetails); // sends the verification code
      this.timeout = this.enableResend(); // enable the resend link
    }
  };

  render() {
    const userDetails = this.props.navigation.getParam('userDetails');
    return (
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.container]}>
        {/* React navigation lifecycle hook */}
        <NavigationEvents
          onWillBlur={() => {
            console.log('onblur');
            clearTimeout(this.timeout);
          }}
        />

        {/* Image container starts */}
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image resizeMode="contain" source={AppConstant.Images.logo}/>
        </View>
        {/* Image container ends */}

        {/* Verification code input form container starts */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Please enter the 6-digit security code
          </Text>

          <Formik
            initialValues={{verificationCode: ''}}
            validationSchema={Common.Validations.VerificationCodeSchema}
            onSubmit={(values) => {
              this.props.verifySecurityCode(
                values.verificationCode,
                userDetails,
              );
            }}>
            {props => {
              return (
                <React.Fragment>
                  <InputField
                    onChangeText={props.handleChange('verificationCode')}
                    onBlur={props.handleBlur('verificationCode')}
                    value={props.values.verificationCode}
                    keyboardType={'number-pad'}
                    placeholder="Security Code"
                    returnKeyType="done"
                    onSubmitEditing={() => Common.Helper.dismissKeyboard()}
                    autoFocus={true}
                    style={styles.inputField}
                    maxLength={6}
                  />
                  <Text style={[styles.resendText, {textAlign: 'center'}]}>
                    Didn't get it?
                    <Text
                      style={{
                        color: this.state.resend
                          ? AppConstant.Colors.salmon
                          : AppConstant.Colors.titlePlaceholder,
                      }}
                      onPress={() => this.resendCode(userDetails)}>
                      {' '}
                      Resend
                    </Text>
                  </Text>
                  <View style={styles.buttonContainer}>
                    <CustomButton
                      onClick={
                        this.activeButton(props)
                          ? () => this.checkErrors(props)
                          : null
                      }
                      title="Next"
                      titleStyle={styles.buttonText}
                      containerStyle={[
                        styles.submitButton,
                        {
                          backgroundColor: this.activeButton(props)
                            ? AppConstant.Colors.lightGreen
                            : AppConstant.Colors.lightGray,
                        },
                      ]}
                    />
                  </View>
                </React.Fragment>
              );
            }}
          </Formik>
        </View>
        {/* Verification code input form container ends */}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  inputContainer: {
    flex: 3,
    justifyContent: 'center',
    marginHorizontal: wp('10%'),
    marginBottom: hp('5%'),
  },
  inputField: {
    width: wp('80%'),
    marginTop: hp('2%'),
    paddingLeft: 0,
  },
  label: {
    fontFamily: AppConstant.Fonts.normal,
    fontSize: wp('3.75%'), // 15,
    color: AppConstant.Colors.titlePlaceholder,
  },
  resendText: {
    fontFamily: AppConstant.Fonts.medium,
    fontSize: wp('3.25%'), // 13,
    color: AppConstant.Colors.black,
    marginTop: hp('5%'),
  },
  buttonContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  submitButton: {
    paddingHorizontal: wp('15'),
  },
  buttonText: {
    fontFamily: AppConstant.Fonts.medium,
    // fontSize: 16
  },
});

// Maps redux state to props
const mapStateToProps = state => ({
  isAuthenticated: state.onboard.isAuthenticated,
});

// Maps redux actions to props
const mapDispatchToProps = dispatch => ({
  verifySecurityCode: (code, userDetails) =>
    dispatch(Actions.verifySecurityCode(code, userDetails)),
  sendSecurityCode: data => dispatch(Actions.sendSecurityCode(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerificationCode);
