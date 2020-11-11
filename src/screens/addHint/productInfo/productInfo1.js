import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Formik} from 'formik';
import AutoHeightImage from 'react-native-auto-height-image';

import {CustomButton, CustomPicker} from '../../../components';

import * as AppConstant from '../../../constants';

import * as Common from '../../../common';

import * as Services from '../../../services';

class ProductInfo1 extends Component {
  state = {
    categories: [],
  };

  async componentDidMount() {
    const categories = await Services.CategoryService.getAll();
    this.setState({
      categories: categories.map(category => {
        return {
          label: category.name,
          key: category.name,
          value: category.name,
        };
      }),
    });
  }

  checkError = (props, fieldName) => {
    return (
      props.errors[fieldName] &&
      (props.touched[fieldName] || props.submitCount > 0)
    );
  };

  activeButton = props => {
    return (
      Boolean(props.values.name.trim()) &&
      Boolean(props.values.brand.trim()) &&
      Boolean(props.values.store.trim()) &&
      Boolean(props.values.price >= 1)
    );
  };

  render() {
    let formValues = this.props.navigation.getParam('formValues') || {};

    return (
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.titleText}>Tell us about it</Text>
          <Formik
            ref={ref => (this.form = ref)}
            validateOnChange={true}
            validateOnBlur={true}
            validationSchema={Common.Validations.ProductInfo1}
            initialValues={{
              image: formValues.img || '',
              name: formValues.name || '',
              brand: formValues.brand || '',
              store: formValues.store || '',
              price: formValues.price || '',
              category: formValues.cat || '',
              color_type: formValues.color || '',
              size_model: formValues.size || '',
              detail: formValues.desc || '',
              feedback: formValues.why || '',
              url: formValues.url || '',
              sku: '',
              type: formValues.type,
            }}
            onSubmit={(values) => {
              this.props.navigation.navigate('addHint_product_info_2', {
                formValues: values,
              });
            }}>
            {props => {
              return (
                <React.Fragment>
                  {/* <View style={styles.topImage}>
                                        <Image  style={{width:wp('35%'),height:wp('35%'),borderRadius:10}} source={props.values.image ? { uri: props.values.image } : AppConstant.Images.productPlaceHolder} />
                                    </View> */}
                  {props.values.image &&
                  props.values.image.startsWith('data:') ? (
                    <Image
                      style={{
                        borderRadius: 10,
                        marginTop: hp('2%'),
                        height: wp('35%'),
                        width: wp('35%'),
                      }}
                      source={{uri: props.values.image}}
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
                        props.values.image
                          ? {uri: props.values.image}
                          : AppConstant.Images.productPlaceHolder
                      }
                    />
                  )}

                  <View style={styles.fieldContainer}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        What's the name of the gift?
                        <Text style={styles.mandatory}> *</Text>
                      </Text>
                      <TextInput
                        onChangeText={props.handleChange('name')}
                        onBlur={props.handleBlur('name')}
                        maxLength={30}
                        value={props.values.name}
                        returnKeyType="next"
                        onSubmitEditing={() => this.brandInput.focus()}
                        style={[
                          styles.textInput,
                          this.checkError(props, 'name')
                            ? {borderColor: 'red'}
                            : '',
                        ]}
                        keyboardType={'ascii-capable'}
                        placeholder=""
                      />
                      {this.checkError(props, 'name') && (
                        <Text style={styles.error}>{props.errors.name}</Text>
                      )}
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        What is the brand?
                        <Text style={styles.mandatory}> *</Text>
                      </Text>
                      <TextInput
                        ref={input => (this.brandInput = input)}
                        onChangeText={props.handleChange('brand')}
                        onBlur={props.handleBlur('brand')}
                        value={props.values.brand}
                        maxLength={30}
                        style={[
                          styles.textInput,
                          this.checkError(props, 'brand')
                            ? {borderColor: 'red'}
                            : '',
                        ]}
                        returnKeyType="next"
                        onSubmitEditing={() => this.storeInput.focus()}
                        keyboardType={'ascii-capable'}
                        placeholder=""
                      />
                      {this.checkError(props, 'brand') && (
                        <Text style={styles.error}>{props.errors.brand}</Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        Which store?
                        <Text style={styles.mandatory}> *</Text>
                      </Text>
                      <TextInput
                        ref={input => (this.storeInput = input)}
                        onChangeText={props.handleChange('store')}
                        onBlur={props.handleBlur('store')}
                        value={props.values.store}
                        maxLength={30}
                        style={[
                          styles.textInput,
                          this.checkError(props, 'store')
                            ? {borderColor: 'red'}
                            : '',
                        ]}
                        returnKeyType="next"
                        onSubmitEditing={() => this.priceInput.focus()}
                        keyboardType={'ascii-capable'}
                        placeholder=""
                      />
                      {this.checkError(props, 'store') && (
                        <Text style={styles.error}>{props.errors.store}</Text>
                      )}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        What is the price listed at?
                        <Text style={styles.mandatory}> *</Text>
                      </Text>
                      <View
                        style={[
                          {
                            flexDirection: 'row',
                            height: 40,
                            borderRadius: 4,
                            borderColor:
                            AppConstant.Colors.inputTextPlaceholder,
                            borderWidth: 1,
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                          this.checkError(props, 'price')
                            ? {borderColor: 'red'}
                            : '',
                        ]}>
                        <View
                          style={{
                            width: '5%',
                            marginLeft: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: AppConstant.Colors.black,
                              fontSize: wp('4%'),
                              fontFamily: AppConstant.Fonts.medium,
                            }}>
                            $
                          </Text>
                        </View>
                        <TextInput
                          ref={input => (this.priceInput = input)}
                          onChangeText={props.handleChange('price')}
                          onBlur={props.handleBlur('price')}
                          value={props.values.price}
                          style={{
                            height: 40,
                            width: '95%',
                            fontSize: wp('4%'),
                            fontFamily: AppConstant.Fonts.medium,
                            color: AppConstant.Colors.black,
                          }}
                          returnKeyType="done"
                          onSubmitEditing={() =>
                            Common.Helper.dismissKeyboard()
                          }
                          keyboardType={'numeric'}
                          maxLength={6}
                          placeholder=""
                        />
                      </View>
                      {this.checkError(props, 'price') && (
                        <Text style={styles.error}>{props.errors.price}</Text>
                      )}
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.fieldTitle}>
                        Which category does this gift fall under?
                      </Text>
                      <CustomPicker
                        value={props.values.category}
                        onValueChange={(value) => {
                          props.setFieldValue('category', value);
                        }}
                        data={this.state.categories}
                        placeholder={{label: 'Category'}}
                      />
                    </View>

                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: hp('2%'),
                        marginBottom: hp('6%'),
                      }}>
                      <CustomButton
                        onClick={
                          this.activeButton(props) ? props.handleSubmit : null
                        }
                        title="Next"
                        containerStyle={{
                          backgroundColor: this.activeButton(props)
                            ? AppConstant.Colors.lightGreen
                            : AppConstant.Colors.lightGray,
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
  error: {
    color: 'red',
    marginTop: 5,
    alignSelf: 'flex-start',
    fontSize: wp('3%'),
  },
});

export default ProductInfo1;
