import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Formik} from 'formik';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';

import {CustomButton, DatePicker, InputField, CheckBox} from '../components';

import * as Actions from '../redux/actions';

import * as Common from '../common';

import * as AppConstant from '../constants';

import * as Services from '../services';

class PostFacebook extends Component {
  state = {
    isDateTimePickerVisible: false,
    countryCode: '+1',
  };

  showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

  hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  handleDatePicked = (date, props) => {
    //long
    // const month = date.toLocaleString('en-us', { month: 'short' });
    props.setFieldValue('dob.day', +date.getDate());
    props.setFieldValue('dob.month', +date.getMonth());
    props.setFieldValue('dob.year', date.getFullYear() + '');
    this.hideDateTimePicker();
  };

  checkErrors = props => {
    props.setSubmitting(true);
    if (props.dirty) {
      if (props.errors.dob) {
        // Common.Alert.show("", props.errors.dob.day);
        Services.AlertService.show('error', 'Failed', props.errors.dob.day);
        props.setSubmitting(false);
        return;
      }
      if (props.errors.phone) {
        // Common.Alert.show("", props.errors.phone);
        Services.AlertService.show('error', 'Failed', props.errors.phone);
        props.setSubmitting(false);
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
    props.setSubmitting(false);
  };

  activeButton = props => {
    if (props.dirty) {
      return Boolean(props.values.phone) && Boolean(props.values.dob.day);
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
    const userDetails = this.props.navigation.getParam('userDetails');
    return (
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContainer]}>
        <View style={styles.container}>
          <Formik
            validationSchema={Common.Validations.PostFacebookSchema}
            initialValues={{
              dob: {},
              id: userDetails.id,
              first_name: userDetails.first_name,
              last_name: userDetails.last_name,
              image: `https://graph.facebook.com/${userDetails.id}/picture?type=normal`,
              email: userDetails.email,
              countryCode: '+1',
              is_birth_year: true,
              type: 'signup',
            }}
            onSubmit={values => {
              this.props.sendSecurityCode(values);
            }}>
            {props => {
              return (
                <React.Fragment>
                  <Text
                    style={[
                      styles.textStyle,
                    ]}>{`${props.values.first_name} ${props.values.last_name}`}</Text>
                  <FastImage
                    style={{
                      alignSelf: 'center',
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                      marginTop: hp('5'),
                    }}
                    source={{uri: props.values.image}}
                  />
                  <Text adjustsFontSizeToFit style={styles.label}>
                    When's your birthday?
                  </Text>
                  <DatePicker
                    // maximumDate={new Date()}
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
                    <InputField
                      onChangeText={props.handleChange('phone')}
                      onBlur={props.handleBlur('phone')}
                      keyboardType={'number-pad'}
                      maxLength={10}
                      value={props.values.phone}
                      placeholder="Mobile number"
                      style={{width: wp('70%')}}
                    />
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    <CustomButton
                      onClick={
                        this.activeButton(props)
                          ? () => this.checkErrors(props)
                          : null
                      }
                      title="Send me my code"
                      titleStyle={styles.buttonText}
                      containerStyle={{
                        backgroundColor: this.activeButton(props)
                          ? AppConstant.Colors.lightGreen
                          : AppConstant.Colors.lightGray,
                      }}
                      iconName="md-arrow-forward"
                    />
                  </View>
                </React.Fragment>
              );
            }}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 3,
    justifyContent: 'center',
    marginHorizontal: wp('10%'),
    marginTop: hp('5%'),
    backgroundColor: 'white',
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
    fontSize: wp('3.5'), // 14,
    fontFamily: AppConstant.Fonts.normal,
    color: AppConstant.Colors.titlePlaceholder,
    marginTop: hp('5%'),
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: wp('5%'),
  },
  datePicker: {
    marginTop: hp('2%'),
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PostFacebook);
