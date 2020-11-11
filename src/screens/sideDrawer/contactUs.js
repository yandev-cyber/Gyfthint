import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Linking} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NavigationEvents} from 'react-navigation';

import * as AppConstant from '../../constants';

import * as Common from '../../common';

import {BackButton, CustomButton} from '../../components';

class ContactUs extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <BackButton
        goBack={() => navigation.navigate(navigation.getParam('activeTab'))}
      />
    ),
    headerTitle: (
      <Text
        style={{
          color: AppConstant.Colors.black,
          fontSize: wp('5%'),
          fontFamily: AppConstant.Fonts.medium,
        }}>
        Customer Support
      </Text>
    ),
  });

  componentDidMount() {
    this.props.navigation.setParams({
      activeTab: this.props.activeTab,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeTab !== this.props.activeTab) {
      this.props.navigation.setParams({
        activeTab: this.props.activeTab,
      });
    }
  }

  checkError = (props, fieldName) =>
    props.dirty && props.errors[fieldName] && props.touched[fieldName];

  render() {
    return (
      <Formik
        ref={ref => (this.form = ref)}
        validateOnChange={true}
        validateOnBlur={true}
        validationSchema={Common.Validations.ContactUsForm}
        initialValues={{
          email: this.props.email || '',
          subject: '',
          emailBody: '',
        }}
        onSubmit={(values) => {
          console.log(values);
          Linking.openURL(
            `mailto:support@gyfthint.com?subject=${values.subject}&body=${values.emailBody}`,
          );
        }}>
        {props => (
          <KeyboardAwareScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
            }}>
            <NavigationEvents
              onDidFocus={() => {
                props.resetForm();
                props.setErrors({});
                props.setTouched({});
              }}
            />

            <View
              style={{
                width: wp('80%'),
                marginTop: hp('5%'),
              }}>
              <View style={styles.inputContainer}>
                <Text style={styles.fieldTitle}>
                  Email
                  <Text style={styles.mandatory}> *</Text>
                </Text>
                <TextInput
                  onChangeText={props.handleChange('email')}
                  onBlur={props.handleBlur('email')}
                  value={props.values.email}
                  style={[
                    styles.textInput,
                    this.checkError(props, 'email') ? {borderColor: 'red'} : '',
                  ]}
                  returnKeyType="next"
                  onSubmitEditing={() => this.subjectInput.focus()}
                  keyboardType={'ascii-capable'}
                  autoCapitalize="none"
                  placeholder=""
                />
                {this.checkError(props, 'email') && (
                  <Text style={styles.error}>{props.errors.email}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.fieldTitle}>
                  Subject
                  <Text style={styles.mandatory}> *</Text>
                </Text>
                <TextInput
                  ref={input => (this.subjectInput = input)}
                  onChangeText={props.handleChange('subject')}
                  onBlur={props.handleBlur('subject')}
                  value={props.values.subject}
                  style={[
                    styles.textInput,
                    this.checkError(props, 'subject')
                      ? {borderColor: 'red'}
                      : '',
                  ]}
                  returnKeyType="next"
                  onSubmitEditing={() => this.bodyInput.focus()}
                  keyboardType={'ascii-capable'}
                  placeholder=""
                />
                {this.checkError(props, 'subject') && (
                  <Text style={styles.error}>{props.errors.subject}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.fieldTitle}>
                  Text
                  <Text style={styles.mandatory}> *</Text>
                </Text>
                <TextInput
                  ref={input => (this.bodyInput = input)}
                  onChangeText={props.handleChange('emailBody')}
                  onBlur={props.handleBlur('emailBody')}
                  value={props.values.emailBody}
                  textAlignVertical="top"
                  multiline={true}
                  style={[
                    styles.textInput,
                    {
                      height: hp('34%'),
                      paddingTop: 16,
                      fontSize: wp('3.5%'),
                      fontFamily: AppConstant.Fonts.normal,
                    },
                    this.checkError(props, 'emailBody')
                      ? {borderColor: 'red'}
                      : '',
                  ]}
                  returnKeyType="next"
                  // onSubmitEditing={() => this.storeInput.focus()}
                  keyboardType={'ascii-capable'}
                  placeholder=""
                />
                {this.checkError(props, 'emailBody') && (
                  <Text style={styles.error}>{props.errors.emailBody}</Text>
                )}
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('5%'),
                }}>
                <CustomButton
                  onClick={props.isValid ? props.handleSubmit : null}
                  title="Send"
                  containerStyle={{
                    backgroundColor: props.isValid
                      ? AppConstant.Colors.darkGreen
                      : AppConstant.Colors.lightGray,
                    paddingVertical: hp('2%'),
                    paddingHorizontal: wp('13%'),
                  }}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
      </Formik>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: wp('35%'),
    height: wp('35%'),
    backgroundColor: AppConstant.Colors.white,
    marginVertical: hp('3%'),
  },
  titleText: {
    alignSelf: 'center',
    color: AppConstant.Colors.black,
    fontSize: wp('5%'), // 20,
    fontFamily: AppConstant.Fonts.medium,
    // marginTop: hp('5%')
  },
  fieldContainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
    marginTop: hp('5%'),
    width: wp('85%'),
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
    // height: 70,
    width: '100%',
    marginBottom: hp('3%'),
  },
  fieldTitle: {
    alignSelf: 'flex-start',
    color: AppConstant.Colors.titlePlaceholder,
    fontSize: wp('3.5%'),
    fontFamily: AppConstant.Fonts.normal,
    marginBottom: 7,
  },
  textInput: {
    height: 46,
    borderRadius: 4,
    borderColor: AppConstant.Colors.border,
    borderWidth: 1,
    width: '100%',
    paddingLeft: 20,
    marginHorizontal: 2,
    fontSize: wp('4%'),
    fontFamily: AppConstant.Fonts.medium,
    color: AppConstant.Colors.black,
  },
  buttonText: {
    fontFamily: AppConstant.Fonts.medium,
  },
  mandatory: {
    color: 'red',
  },
  error: {
    color: 'red',
    marginTop: 5,
    alignSelf: 'flex-start',
    fontSize: wp('3%'),
  },
});

// Mapping redux state to props
const mapStateToProps = state => ({
  activeTab: state.common.activeTab,
  email: state.onboard.user.email,
});

export default connect(mapStateToProps, null)(ContactUs);
