import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {Formik} from 'formik';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {CustomButton, DatePicker, CheckBox} from '../components';

import * as Actions from '../redux/actions';

import * as Common from '../common';

import * as AppConstant from '../constants';

import * as Services from '../services';

class Registration extends Component {
  state = {
    isDateTimePickerVisible: false,
    countryCode: '+1',
  };

  componentDidMount() {
    console.log(this.props.isAuthenticated);
  }

  showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

  hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  handleDatePicked = (date, props) => {
    //long
    // const month = date.toLocaleString('en-us', { month: 'short' });
    props.setFieldValue('dob.day', +date.getDate());
    props.setFieldValue('dob.month', +date.getMonth());
    props.setFieldValue('dob.year', date.getFullYear() + '');
    this.hideDateTimePicker();
    setTimeout(() => {
      this.phoneInput.focus();
    }, 500);
  };

  checkErrors = props => {
    if (props.dirty) {
      if (props.errors.first_name) {
        // Common.Alert.show("", props.errors.first_name);
        Services.AlertService.show('error', 'Failed', props.errors.first_name);
        return;
      }
      if (props.errors.last_name) {
        // Common.Alert.show("", props.errors.last_name);
        Services.AlertService.show('error', 'Failed', props.errors.last_name);
        return;
      }
      if (props.errors.dob) {
        // Common.Alert.show("", props.errors.dob.day);
        Services.AlertService.show('error', 'Failed', props.errors.dob.day);
        return;
      }
      if (props.errors.phone) {
        // Common.Alert.show("", props.errors.phone);
        Services.AlertService.show('error', 'Failed', props.errors.phone);
        return;
      }
      props.submitForm().then(r => console.log(r));
    } else {
      // Common.Alert.show("", AppConstant.Alert.MANDATORY);
      Services.AlertService.show(
        'error',
        'Failed',
        AppConstant.Alert.MANDATORY,
      );
    }
  };

  activeButton = props => {
    if (props.dirty) {
      return (
        Boolean(props.values.first_name) &&
        Boolean(props.values.last_name) &&
        Boolean(props.values.phone) &&
        Boolean(props.values.dob.day)
      );
    }
    return false;
  };

  toggleCountry = props => {
    props.setFieldValue(
      'countryCode',
      props.values.countryCode === '+1' ? '+91' : '+1',
    );
  };

  toggleYear = props => {
    props.setFieldValue('is_birth_year', !props.values.is_birth_year);
  };

  render() {
    return (
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContainer]}>
        <View style={[styles.container]}>
          <CustomButton
            titleStyle={styles.buttonText}
            facebook
            onClick={this.props.facebookAuthentication}
            title="Create with Facebook"
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
          <Text style={[styles.textStyle]}>Create Manually</Text>
          <Formik
            validationSchema={Common.Validations.SignupSchema}
            initialValues={{
              dob: {},
              type: 'signup',
              countryCode: '+1',
              is_birth_year: true,
            }}
            onSubmit={(values) =>
              this.props.sendSecurityCode(values)
            }>
            {props => {
              console.log(props);
              console.log(this.activeButton(props));
              return (
                <React.Fragment>
                  <Text adjustsFontSizeToFit style={styles.label}>
                    What's your name?
                  </Text>
                  <View style={{flexDirection: 'row', marginTop: hp('2%')}}>
                    <TextInput
                      onChangeText={props.handleChange('first_name')}
                      onBlur={props.handleBlur('first_name')}
                      value={props.values.first_name}
                      returnKeyType="next"
                      onSubmitEditing={() => this.lastNameInput.focus()}
                      placeholder="First name"
                      underlineColorAndroid={AppConstant.Colors.white}
                      autoCorrect={false}
                      placeholderTextColor={
                        AppConstant.Colors.inputTextPlaceholder
                      }
                      style={[styles.input, {width: wp('38%')}]}
                      maxLength={15}
                    />
                    <TextInput
                      ref={input => (this.lastNameInput = input)}
                      onChangeText={props.handleChange('last_name')}
                      onBlur={props.handleBlur('last_name')}
                      value={props.values.last_name}
                      returnKeyType="next"
                      onSubmitEditing={() => this.showDateTimePicker()}
                      placeholder="Last name"
                      underlineColorAndroid={AppConstant.Colors.white}
                      autoCorrect={false}
                      placeholderTextColor={
                        AppConstant.Colors.inputTextPlaceholder
                      }
                      style={[
                        styles.input,
                        {width: wp('38%'), marginLeft: wp('2%')},
                      ]}
                      maxLength={25}
                    />
                  </View>

                  <Text adjustsFontSizeToFit style={[styles.label]}>
                    When's your birthday?
                  </Text>
                  <DatePicker
                    // maximumDate={null}
                    style={styles.datePicker}
                    isDateTimePickerVisible={this.state.isDateTimePickerVisible}
                    handleDatePicked={this.handleDatePicked}
                    hideDateTimePicker={this.hideDateTimePicker}
                    showDateTimePicker={this.showDateTimePicker}
                    {...props}
                  />
                  {!Common.Helper.isAndroid() && (
                    <TouchableWithoutFeedback
                      onPress={() => this.toggleYear(props)}>
                      <View style={{flexDirection: 'row', marginTop: hp('2%')}}>
                        <CheckBox
                          onClick={() => this.toggleYear(props)}
                          isSelected={props.values.is_birth_year}
                        />
                        <Text
                          style={{
                            marginTop: 2,
                            marginLeft: wp('3%'),
                            fontSize: wp('3%'),
                            fontFamily: AppConstant.Fonts.normal,
                            color: AppConstant.Colors.titlePlaceholder,
                          }}>
                          Share my birth year{' '}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.label}>
                    Please enter your mobile phone number and
                  </Text>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={[styles.label, {marginTop: 0}]}>
                    we'll send you a code for a secure login
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
                    <TextInput
                      ref={input => (this.phoneInput = input)}
                      onChangeText={props.handleChange('phone')}
                      onBlur={props.handleBlur('phone')}
                      keyboardType={'number-pad'}
                      value={props.values.phone}
                      returnKeyType="done"
                      onSubmitEditing={() => Common.Helper.dismissKeyboard()}
                      placeholder="Mobile number"
                      underlineColorAndroid={AppConstant.Colors.white}
                      autoCorrect={false}
                      placeholderTextColor={
                        AppConstant.Colors.inputTextPlaceholder
                      }
                      style={[styles.input, {width: wp('70%')}]}
                      maxLength={10}
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
        <View style={styles.buttonContainer}/>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp('10%'),
    marginBottom: hp('5%'),
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
    fontFamily: AppConstant.Fonts.medium,
  },
  facebookButton: {
    backgroundColor: AppConstant.Colors.facebookColor,
    marginHorizontal: wp('3%'),
  },
  seperatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('4%'),
    marginHorizontal: wp('3%'),
  },

  seperator: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: AppConstant.Colors.separator,
  },
  formContainer: {
    // marginTop: '$margin * 4'
  },
  label: {
    fontSize: wp('3.5%'), // 14,
    fontFamily: AppConstant.Fonts.normal,
    color: AppConstant.Colors.titlePlaceholder,
    marginTop: hp('5%'),
  },
  submitButton: {
    marginTop: hp('7.5%'),
    marginHorizontal: wp('5%'),
  },
  datePicker: {
    marginTop: hp('2%'),
  },
  buttonText: {
    fontFamily: AppConstant.Fonts.medium,
    fontSize: wp('3.75%'),
  },
  input: {
    borderColor: AppConstant.Colors.separator,
    borderBottomWidth: 1,
    padding: 0,
    paddingBottom: hp('0.5%'),
    paddingLeft: wp('1%'),
    fontSize: wp('4%'), //16,
    fontFamily: AppConstant.Fonts.light,
  },
});

const mapStateToProps = state => ({
  isAuthenticated: state.onboard.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  sendSecurityCode: data => dispatch(Actions.sendSecurityCode(data)),
  facebookAuthentication: () => dispatch(Actions.facebookAuthentication()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
