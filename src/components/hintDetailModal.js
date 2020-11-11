import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';

import {CustomModal, CustomButton, DropdownAlert} from '../components';
import * as AppConstant from '../constants';
import * as Common from '../common';

export default props => {
  const [imageHeight, setimageHeight] = useState(100);

  useEffect(() => {
    Common.Helper.calculateImageHeight(
      props.hint.image
        ? props.hint.image
        : AppConstant.Images.productPlaceHolder,
      wp('40%'),
    ).then(height => {
      setimageHeight(height);
    });
  });

  return (
    <CustomModal
      onBackdropPress={() => props.closeModal()}
      isVisible={props.isVisible}>
      <View
        style={{
          marginHorizontal: wp('10%'),
          borderRadius: 20,
          backgroundColor: AppConstant.Colors.salmon,
          alignItems: 'center',
        }}>
        <View
          style={{
            minHeight: hp('7%'),
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <View
            style={{
              marginLeft: wp('6%'),
              width: '80%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {props.otherUser && (
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.regular,
                  color: AppConstant.Colors.white,
                  fontSize: wp('4%'),
                }}>{`A Hint From ${props.otherUser.first_name}`}</Text>
            )}
          </View>
          <TouchableWithoutFeedback onPress={props.closeModal}>
            <View
              style={{
                width: '10%',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}>
              <Image source={AppConstant.Images.closeWhiteIcon}/>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            minHeight: hp('40%'),
            maxHeight: hp('60%'),
            alignItems: 'center',
          }}>
          <ScrollView
            bounces={false}
            contentContainerStyle={{
              width: wp('75%'),
              alignItems: 'center',
            }}>
            {/* <View style={styles.topImage}> */}
            {/* <Image borderRadius={10} resizeMode='contain' style={{ width: wp('40%'), height: wp('40%') }} source={props.hint.image ? { uri: props.hint.image } : AppConstant.Images.productPlaceHolder} /> */}
            <View
              style={{
                width: wp('50%'),
                alignItems: 'center',
              }}>
              <FastImage
                style={{
                  width: wp('40%'),
                  height: imageHeight,
                  borderRadius: 10,
                  marginVertical: hp('1.5%'),
                }}
                source={
                  props.hint.image
                    ? {uri: props.hint.image}
                    : AppConstant.Images.productPlaceHolder
                }
              />
              {/* </View> */}
              <Text style={[styles.titleText, {textAlign: 'center'}]}>
                {props.hint.name}
              </Text>

              {props.hint.price > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Price</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>
                      {'$ ' +
                      (
                        props.hint.price +
                        props.hint.shipping_and_handling +
                        props.hint.sales_tax
                      ).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}

              {props.hint.brand.length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Brand</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>{props.hint.brand}</Text>
                  </View>
                </View>
              )}

              {props.hint.store.length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Store</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>{props.hint.store}</Text>
                  </View>
                </View>
              )}

              {props.hint.size_model.length > 0 && !props.otherUser && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Size/Model</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>
                      {props.hint.size_model}
                    </Text>
                  </View>
                </View>
              )}

              {props.hint.color_type.length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Color/Type</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>
                      {props.hint.color_type}
                    </Text>
                  </View>
                </View>
              )}

              {props.hint.sku.length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>SKU</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>{props.hint.sku}</Text>
                  </View>
                </View>
              )}

              {props.hint.url.length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Website</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>{props.hint.url}</Text>
                  </View>
                </View>
              )}

              {props.hint.detail.length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Detail</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>{props.hint.detail}</Text>
                  </View>
                </View>
              )}

              {props.hint.feedback.length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Why</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>{props.hint.feedback}</Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: hp('2%'),
            }}>
            {props.hint.status === AppConstant.Status.hint.UPDATED_INVENTORY && (
              <CustomButton
                onClick={() => props.submitHandler()}
                title="Buy Gift Now"
                containerStyle={{
                  backgroundColor: AppConstant.Colors.blue,
                  width: wp('55%'),
                }}
              />
            )}
          </View>
        </View>
        {props.otherUser && (
          <View
            style={{
              marginBottom: 15,
              width: wp('55%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableWithoutFeedback
              onPress={_.debounce(
                () => {
                  props.addHint();
                },
                1000,
                {
                  leading: true,
                  trailing: false,
                },
              )}>
              <View
                style={{
                  alignItems: 'flex-start',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(255,255,255,0.55)',
                }}>
                <Text
                  style={{
                    color: AppConstant.Colors.white,
                    fontFamily: AppConstant.Fonts.medium,
                    fontSize: wp('3%'),
                  }}>
                  Add to My Hints
                </Text>
              </View>
            </TouchableWithoutFeedback>
            {props.hint.status === AppConstant.Status.hint.UPDATED_INVENTORY && (
              <TouchableWithoutFeedback
                onPress={_.debounce(
                  () => {
                    props.submitHandler();
                  },
                  1000,
                  {
                    leading: true,
                    trailing: false,
                  },
                )}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255,255,255,0.55)',
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: AppConstant.Colors.white,
                      fontFamily: AppConstant.Fonts.medium,
                      fontSize: wp('3%'),
                    }}>
                    Buy for Myself
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        )}
      </View>
      <DropdownAlert modal/>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleText: {
    alignSelf: 'center',
    color: AppConstant.Colors.white,
    fontSize: wp('5%'), // 20,
    fontFamily: AppConstant.Fonts.medium,
    marginBottom: hp('1%'),
  },
  topImage: {
    width: wp('40%'),
    height: wp('40%'),
    backgroundColor: AppConstant.Colors.salmon,
    // marginVertical: hp('1%')
  },
  attributesContainer: {
    // flex: 0.8,
    width: wp('50%'),
  },
  attributeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
  },
  leftText: {
    textAlign: 'left',
    color: AppConstant.Colors.white,
    fontSize: wp('3.75%'),
    fontFamily: AppConstant.Fonts.normal,
  },
  rightText: {
    textAlign: 'right',
    color: AppConstant.Colors.white,
    fontSize: wp('4%'),
    fontFamily: AppConstant.Fonts.medium,
  },
});
