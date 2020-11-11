import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Formik} from 'formik';
import AutoHeightImage from 'react-native-auto-height-image';

import * as Common from '../../../common';

import {CustomButton} from '../../../components';

import * as AppConstant from '../../../constants';

class ProductInfo2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
          <Text style={styles.titleText}>Let's make it perfect</Text>
          <Formik
            validateOnChange={false}
            validateOnBlur={true}
            validationSchema={Common.Validations.ProductInfo2}
            initialValues={{
              ...previousFormValues,
            }}
            onSubmit={(values) =>
              this.props.navigation.navigate('addHint_product_info_3', {
                formValues: values,
              })
            }>
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
                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        Is this item a specific color or type?
                      </Text>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={props.handleChange('color_type')}
                        onBlur={props.handleBlur('color_type')}
                        value={props.values.color_type}
                        maxLength={30}
                        returnKeyType="next"
                        onSubmitEditing={() => this.sizeModelInput.focus()}
                        keyboardType={'ascii-capable'}
                        placeholder=""
                      />
                      {this.checkError(props, 'color_type') && (
                        <Text style={styles.error}>
                          {props.errors.color_type}
                        </Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        Should the product be a certain size or model?
                      </Text>
                      <TextInput
                        ref={input => (this.sizeModelInput = input)}
                        style={styles.textInput}
                        onChangeText={props.handleChange('size_model')}
                        onBlur={props.handleBlur('size_model')}
                        value={props.values.size_model}
                        maxLength={30}
                        returnKeyType="next"
                        onSubmitEditing={() => this.detailInput.focus()}
                        keyboardType={'ascii-capable'}
                        placeholder=""
                      />
                      {this.checkError(props, 'size_model') && (
                        <Text style={styles.error}>
                          {props.errors.size_model}
                        </Text>
                      )}
                      <Text
                        style={[
                          styles.fieldTitle,
                          {
                            marginTop: 5,
                            fontSize: wp('3%'),
                            fontFamily: AppConstant.Fonts.light,
                          },
                        ]}>
                        Size isn't visible to other users
                      </Text>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        Please provide a brief product description:
                      </Text>
                      <TextInput
                        ref={input => (this.detailInput = input)}
                        style={[styles.textInput, {height: hp('15%')}]}
                        keyboardType={'ascii-capable'}
                        onChangeText={props.handleChange('detail')}
                        onBlur={props.handleBlur('detail')}
                        value={props.values.detail}
                        multiline={true}
                        maxLength={160}
                        placeholder=""
                        textAlignVertical="top"
                      />
                      {this.checkError(props, 'detail') && (
                        <Text style={styles.error}>{props.errors.detail}</Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        Tell everyone why you would love this gift!
                      </Text>
                      <TextInput
                        style={[styles.textInput, {height: hp('15%')}]}
                        keyboardType={'ascii-capable'}
                        onChangeText={props.handleChange('feedback')}
                        onBlur={props.handleBlur('feedback')}
                        value={props.values.feedback}
                        multiline={true}
                        maxLength={160}
                        placeholder=""
                        textAlignVertical="top"
                      />
                      {this.checkError(props, 'feedback') && (
                        <Text style={styles.error}>
                          {props.errors.feedback}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: hp('2%'),
                        marginBottom: hp('6%'),
                      }}>
                      <CustomButton
                        onClick={props.handleSubmit}
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

export default ProductInfo2;

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
  error: {
    color: 'red',
    marginTop: 5,
    alignSelf: 'flex-start',
    fontSize: wp('3%'),
  },
});
