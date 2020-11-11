import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Formik} from 'formik';
import {connect} from 'react-redux';

import {CustomButton, StateDropdown, CheckBox} from '../../components';

import * as AppConstant from '../../constants';

import * as Common from '../../common';

import * as Actions from '../../redux/actions';

class Address extends Component {
  checkButton = props => {
    props.setFieldValue('is_mailing', !props.values.is_mailing);
  };

  formattedZip = value => {
    if (value.length === 6 && !value.includes('-')) {
      return value.slice(0, 5) + '-' + value.slice(5, 9);
    }
    return value;
  };

  checkError = (props, fieldName) => {
    if (
      fieldName.includes('.') &&
      props.errors.hasOwnProperty(fieldName.split('.')[0]) &&
      props.touched.hasOwnProperty(fieldName.split('.')[0])
    ) {
      return (
        props.errors[fieldName.split('.')[0]][fieldName.split('.')[1]] &&
        (props.touched[fieldName.split('.')[0]][fieldName.split('.')[1]] ||
          props.submitCount > 0)
      );
    }
    return (
      props.errors[fieldName] &&
      (props.touched[fieldName] || props.submitCount > 0)
    );
  };

  activeButton = props => {
    if (props.dirty) {
      let shippingAddress =
        Boolean(props.values.shipping_address.line_1) &&
        Boolean(props.values.shipping_address.city) &&
        Boolean(props.values.shipping_address.state) &&
        Boolean(props.values.shipping_address.zip),
        mailingAddress = true;
      if (props.values.is_mailing) {
        mailingAddress =
          Boolean(props.values.mailing_address.line_1) &&
          Boolean(props.values.mailing_address.city) &&
          Boolean(props.values.mailing_address.state) &&
          Boolean(props.values.mailing_address.zip);
      }
      return shippingAddress && mailingAddress && props.isValid;
    }
    return false;
  };

  renderStateDropDown = (props, type) => (
    <StateDropdown
      placeholder={{}}
      value={props.values[type].state}
      onValueChange={value => props.setFieldValue(type + '.state', value)}
      style={{
        viewContainer: {
          width: '100%',
          marginHorizontal: 2,
        },
        inputIOS: {
          paddingLeft: 10,
          fontFamily: AppConstant.Fonts.medium,
        },
        inputAndroid: {
          fontFamily: AppConstant.Fonts.medium,
        },
      }}
    />
  );

  render() {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <View style={styles.container}>
          {/* <Text style={styles.titleText}>If someone was going to</Text>
                    <Text style={[styles.titleText, { marginTop: 0 }]}>get this for you,</Text> */}
          <Text style={[styles.subTitleText]}>
            What's your shipping address?
          </Text>
          <Text style={styles.subText}>(You only have to do this once)</Text>
          <Formik
            validateOnChange={false}
            validateOnBlur={true}
            validationSchema={Common.Validations.Address}
            initialValues={{
              shipping_address: {zip: '', state: 'AK'},
              mailing_address: {zip: '', state: 'AK'},
              is_mailing: false,
            }}
            onSubmit={(values) => {
              Common.Helper.dismissKeyboard();
              this.props.updateAddress(
                values,
                this.props.navigation.getParam('formValues'),
                this.props.navigation.state.routeName === 'address'
                  ? this.props.navigation.getParam('user')
                  : null,
              );
            }}>
            {props => {
              return (
                <React.Fragment>
                  <View style={styles.fieldContainer}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        Street Address
                        <Text style={styles.mandatory}> *</Text>
                      </Text>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={props.handleChange(
                          'shipping_address.line_1',
                        )}
                        onBlur={props.handleBlur('shipping_address.line_1')}
                        value={props.values.shipping_address.line_1}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this.shippingAddressLine2Input.focus()
                        }
                        maxLength={50}
                        keyboardType={'ascii-capable'}
                        placeholder=""
                      />
                      {this.checkError(props, 'shipping_address.line_1') && (
                        <Text style={styles.error}>
                          {props.errors.shipping_address.line_1}
                        </Text>
                      )}

                      <TextInput
                        ref={input => (this.shippingAddressLine2Input = input)}
                        style={[styles.textInput, {marginTop: 10}]}
                        onChangeText={props.handleChange(
                          'shipping_address.line_2',
                        )}
                        onBlur={props.handleBlur('shipping_address.line_2')}
                        value={props.values.shipping_address.line_2}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          this.shippingAddressCityInput.focus()
                        }
                        maxLength={50}
                        keyboardType={'ascii-capable'}
                        placeholder=""
                      />
                      {this.checkError(props, 'shipping_address.line_2') && (
                        <Text style={styles.error}>
                          {props.errors.shipping_address.line_2}
                        </Text>
                      )}
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        City/Town
                        <Text style={styles.mandatory}> *</Text>
                      </Text>
                      <TextInput
                        ref={input => (this.shippingAddressCityInput = input)}
                        style={styles.textInput}
                        onChangeText={props.handleChange(
                          'shipping_address.city',
                        )}
                        onBlur={props.handleBlur('shipping_address.city')}
                        value={props.values.shipping_address.city}
                        returnKeyType="done"
                        maxLength={30}
                        keyboardType={'ascii-capable'}
                        placeholder=""
                      />
                      {this.checkError(props, 'shipping_address.city') && (
                        <Text style={styles.error}>
                          {props.errors.shipping_address.city}
                        </Text>
                      )}
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={[styles.inputContainer, {width: '48%'}]}>
                        <Text style={styles.fieldTitle}>
                          State
                          <Text style={styles.mandatory}> *</Text>
                        </Text>
                        {this.renderStateDropDown(props, 'shipping_address')}
                        {this.checkError(props, 'shipping_address.state') && (
                          <Text style={styles.error}>
                            {props.errors.shipping_address.state}
                          </Text>
                        )}
                      </View>
                      <View style={[styles.inputContainer, {width: '48%'}]}>
                        <Text style={styles.fieldTitle}>
                          Zip
                          <Text style={styles.mandatory}> *</Text>
                        </Text>
                        <TextInput
                          style={styles.textInput}
                          onChangeText={props.handleChange(
                            'shipping_address.zip',
                          )}
                          onBlur={props.handleBlur('shipping_address.zip')}
                          value={this.formattedZip(
                            props.values.shipping_address.zip,
                          )}
                          returnKeyType="done"
                          keyboardType={'number-pad'}
                          maxLength={10}
                          placeholder=""
                        />
                        {this.checkError(props, 'shipping_address.zip') && (
                          <Text style={styles.error}>
                            {props.errors.shipping_address.zip}
                          </Text>
                        )}
                      </View>
                    </View>

                    <TouchableWithoutFeedback
                      onPress={() => this.checkButton(props)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: hp('2%'),
                          marginBottom: hp('5%'),
                        }}>
                        <CheckBox
                          onClick={() => this.checkButton(props)}
                          isSelected={!props.values.is_mailing}
                        />
                        <Text
                          style={{
                            marginLeft: 5,
                            color: AppConstant.Colors.black,
                            fontSize: wp('4%'),
                            fontFamily: AppConstant.Fonts.normal,
                          }}>
                          This is my mailing address
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>

                    {props.values.is_mailing && (
                      <View
                        style={[styles.fieldContainer, {marginTop: hp('0%')}]}>
                        <View style={styles.inputContainer}>
                          <Text style={styles.fieldTitle}>
                            Street Address
                            <Text style={styles.mandatory}> *</Text>
                          </Text>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={props.handleChange(
                              'mailing_address.line_1',
                            )}
                            onBlur={props.handleBlur('mailing_address.line_1')}
                            value={props.values.mailing_address.line_1}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                              this.mailingAddressLine2Input.focus()
                            }
                            maxLength={50}
                            keyboardType={'ascii-capable'}
                            placeholder=""
                          />
                          {this.checkError(props, 'mailing_address.line_1') && (
                            <Text style={styles.error}>
                              {props.errors.mailing_address.line_1}
                            </Text>
                          )}

                          <TextInput
                            ref={input =>
                              (this.mailingAddressLine2Input = input)
                            }
                            style={[styles.textInput, {marginTop: 10}]}
                            onChangeText={props.handleChange(
                              'mailing_address.line_2',
                            )}
                            onBlur={props.handleBlur('mailing_address.line_2')}
                            value={props.values.mailing_address.line_2}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                              this.mailingAddressCityInput.focus()
                            }
                            maxLength={50}
                            keyboardType={'ascii-capable'}
                            placeholder=""
                          />
                          {this.checkError(props, 'mailing_address.line_2') && (
                            <Text style={styles.error}>
                              {props.errors.mailing_address.line_2}
                            </Text>
                          )}
                        </View>
                        <View style={styles.inputContainer}>
                          <Text style={styles.fieldTitle}>
                            City/Town
                            <Text style={styles.mandatory}> *</Text>
                          </Text>
                          <TextInput
                            ref={input =>
                              (this.mailingAddressCityInput = input)
                            }
                            style={styles.textInput}
                            onChangeText={props.handleChange(
                              'mailing_address.city',
                            )}
                            onBlur={props.handleBlur('mailing_address.city')}
                            value={props.values.mailing_address.city}
                            returnKeyType="done"
                            maxLength={30}
                            keyboardType={'ascii-capable'}
                            placeholder=""
                          />
                          {this.checkError(props, 'mailing_address.city') && (
                            <Text style={styles.error}>
                              {props.errors.mailing_address.city}
                            </Text>
                          )}
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={[styles.inputContainer, {width: '48%'}]}>
                            <Text style={styles.fieldTitle}>
                              State
                              <Text style={styles.mandatory}> *</Text>
                            </Text>
                            {this.renderStateDropDown(props, 'mailing_address')}

                            {this.checkError(
                              props,
                              'mailing_address.state',
                            ) && (
                              <Text style={styles.error}>
                                {props.errors.mailing_address.state}
                              </Text>
                            )}
                          </View>
                          <View style={[styles.inputContainer, {width: '48%'}]}>
                            <Text style={styles.fieldTitle}>
                              Zip
                              <Text style={styles.mandatory}> *</Text>
                            </Text>
                            <TextInput
                              style={styles.textInput}
                              onChangeText={props.handleChange(
                                'mailing_address.zip',
                              )}
                              onBlur={props.handleBlur('mailing_address.zip')}
                              value={this.formattedZip(
                                props.values.mailing_address.zip,
                              )}
                              returnKeyType="done"
                              keyboardType={'number-pad'}
                              maxLength={10}
                              placeholder=""
                            />
                            {this.checkError(props, 'mailing_address.zip') && (
                              <Text style={styles.error}>
                                {props.errors.mailing_address.zip}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    )}

                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: hp('3%'),
                      }}>
                      {this.props.navigation.state.routeName === 'address' ? (
                        <CustomButton
                          onClick={
                            this.activeButton(props)
                              ? () => props.handleSubmit()
                              : null
                          }
                          title="Save"
                          containerStyle={{
                            backgroundColor: this.activeButton(props)
                              ? AppConstant.Colors.lightGreen
                              : AppConstant.Colors.lightGray,
                          }}
                        />
                      ) : (
                        <CustomButton
                          onClick={
                            this.activeButton(props)
                              ? () => props.handleSubmit()
                              : null
                          }
                          title="Next"
                          containerStyle={{
                            backgroundColor: this.activeButton(props)
                              ? AppConstant.Colors.lightGreen
                              : AppConstant.Colors.lightGray,
                          }}
                          iconName="md-arrow-forward"
                        />
                      )}
                    </View>
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
    backgroundColor: 'black',
    marginVertical: hp('3%'),
    borderRadius: 10,
  },
  titleText: {
    alignSelf: 'center',
    color: AppConstant.Colors.black,
    fontSize: wp('5%'), // 20,
    fontFamily: AppConstant.Fonts.medium,
    // marginTop: hp('5%')
  },
  subTitleText: {
    alignSelf: 'center',
    color: AppConstant.Colors.black,
    fontSize: wp('5.5%'), // 18,
    fontFamily: AppConstant.Fonts.medium,
    marginBottom: 4,
  },
  subText: {
    alignSelf: 'center',
    color: AppConstant.Colors.orText,
    fontSize: wp('3.5%'), // 18,
    fontFamily: AppConstant.Fonts.medium,
    // marginTop: hp('3%')
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
    color: AppConstant.Colors.black,
    fontSize: wp('4%'), // 20,
    fontFamily: AppConstant.Fonts.normal,
    marginBottom: 4,
  },
  textInput: {
    height: 40,
    borderRadius: 4,
    borderColor: AppConstant.Colors.inputTextPlaceholder,
    borderWidth: 1,
    width: '100%',
    paddingLeft: 10,
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
  camera: {
    width: hp('6%'),
    height: hp('6%'),
    borderRadius: hp('5%'),
    backgroundColor: AppConstant.Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('3%'),
  },
  error: {
    color: 'red',
    marginTop: 5,
    alignSelf: 'flex-start',
    fontSize: wp('3%'),
  },
});

const mapDispatchToProps = dispatch => ({
  updateAddress: (address, productDetail, user) =>
    dispatch(Actions.updateAddress(address, productDetail, user)),
});

export default connect(null, mapDispatchToProps)(Address);
