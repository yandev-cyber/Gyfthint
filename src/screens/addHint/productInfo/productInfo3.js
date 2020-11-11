import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  TextInput,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Formik} from 'formik';
import {connect} from 'react-redux';
import AutoHeightImage from 'react-native-auto-height-image';

import * as Common from '../../../common';

import {CustomButton} from '../../../components';

import * as AppConstant from '../../../constants';

class ProductInfo3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCamera: false,
    };
  }
  checkError = (props, fieldName) => {
    return (
      props.errors[fieldName] &&
      (props.touched[fieldName] || props.submitCount > 0)
    );
  };

  render() {
    const previousFormValues = this.props.navigation.getParam('formValues');
    return (
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.titleText}>Make sure it's right</Text>
          <Formik
            validateOnChange={false}
            validateOnBlur={true}
            initialValues={{...previousFormValues}}
            validationSchema={Common.Validations.ProductInfo3}
            onSubmit={(values, {setSubmitting}) => {
              setSubmitting(false);
              this.props.navigation.navigate(
                this.props.address && this.props.address.line_1.length > 0
                  ? 'addHint_product_detail'
                  : 'addHint_address',
                {formValues: values},
              );
            }}>
            {props => {
              return (
                <React.Fragment>
                  {/* <View style={styles.topImage}>
                                        <Image resizeMode='contain' style={{ width: wp('35%'), height: wp('35%'), borderRadius: 10 }} source={previousFormValues.image ? { uri: previousFormValues.image } : AppConstant.Images.productPlaceHolder} />
                                    </View> */}
                  {previousFormValues.image &&
                  previousFormValues.image.startsWith('data:') ? (
                    <Image
                      style={{
                        borderRadius: 10,
                        marginTop: hp('2%'),
                        height: wp('35%'),
                        width: wp('35%'),
                      }}
                      source={{uri: previousFormValues.image}}
                    />
                  ) : (
                    <AutoHeightImage
                      style={{
                        borderRadius: 10,
                        marginTop: hp('2%'),
                      }}
                      width={wp('35%')}
                      onError={err => {
                        console.log(err);
                      }}
                      fallbackSource={AppConstant.Images.productPlaceHolder}
                      source={
                        previousFormValues.image
                          ? {uri: previousFormValues.image}
                          : AppConstant.Images.productPlaceHolder
                      }
                    />
                  )}

                  <View style={styles.fieldContainer}>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <View
                          style={[
                            styles.inputContainer,
                            this.state.showCamera ? {width: '80%'} : '',
                            this.checkError(props, 'sku')
                              ? {marginBottom: 0}
                              : '',
                          ]}>
                          <Text style={styles.fieldTitle}>
                            Please enter the product number of SKU to make sure
                            you get the right gift
                          </Text>

                          <TextInput
                            style={styles.textInput}
                            onChangeText={props.handleChange('sku')}
                            onBlur={props.handleBlur('sku')}
                            value={props.values.sku}
                            maxLength={30}
                            autoCorrect={false}
                            autoCapitalize="none"
                            returnKeyType="next"
                            onSubmitEditing={() => this.urlInput.focus()}
                            keyboardType={'ascii-capable'}
                            placeholder=""
                          />
                        </View>

                        {this.state.showCamera && (
                          <TouchableWithoutFeedback
                            onPress={() =>
                              this.props.navigation.push('addHint_camera', {
                                hasHistory: true,
                              })
                            }>
                            <View
                              style={[
                                styles.camera,
                                this.checkError(props, 'sku')
                                  ? {marginTop: hp('2.5%')}
                                  : '',
                              ]}>
                              <Image
                                style={{
                                  height: hp('3%'),
                                  width: hp('3%'),
                                }}
                                source={AppConstant.Images.cameraIcon}
                              />
                            </View>
                          </TouchableWithoutFeedback>
                        )}
                      </View>

                      {this.checkError(props, 'sku') && (
                        <Text style={[styles.error, {marginBottom: hp('3%')}]}>
                          {props.errors.sku}
                        </Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        Please include a web address/URL?
                      </Text>
                      <TextInput
                        ref={input => (this.urlInput = input)}
                        style={styles.textInput}
                        onChangeText={props.handleChange('url')}
                        onBlur={props.handleBlur('url')}
                        value={props.values.url}
                        autoCapitalize="none"
                        returnKeyType="next"
                        onSubmitEditing={() => Common.Helper.dismissKeyboard()}
                        keyboardType={'ascii-capable'}
                        placeholder=""
                      />
                      {this.checkError(props, 'url') && (
                        <Text style={styles.error}>{props.errors.url}</Text>
                      )}
                    </View>

                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: hp('3%'),
                      }}>
                      <CustomButton
                        onClick={() =>
                          !props.isSubmitting ? props.handleSubmit() : ''
                        }
                        title="Next"
                        containerStyle={{
                          backgroundColor: AppConstant.Colors.lightGreen,
                        }}
                        iconName="md-arrow-forward"
                      />
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

const mapStateToProps = state => ({
  address: state.onboard.user.shipping_address,
});

export default connect(mapStateToProps, null)(ProductInfo3);
