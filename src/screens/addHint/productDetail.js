import React, {Component} from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import AutoHeightImage from 'react-native-auto-height-image';

import {CustomButton} from '../../components';

import * as AppConstant from '../../constants';

// Redux Actions
import * as Actions from '../../redux/actions';

// App Common
import * as Common from '../../common';

// Services
import * as Services from '../../services';

class ProductDetail extends Component {
  state = {
    disabled: false,
  };

  submitHandler = async (productDetail, addAnother = false) => {
    try {
      this.setState({disabled: true});
      if (!this.state.disabled) {
        this.props.toggleLoader(true);
        let imageUrl = '';
        if (productDetail.image && !productDetail.image.startsWith('http')) {
          const uploadUri = !Common.Helper.isAndroid()
            ? productDetail.image.replace('file://', '')
            : productDetail.image;
          imageUrl = await Common.Helper.uploadFile(
            uploadUri,
            this.props.user.id,
          );
        }
        productDetail.user_id = this.props.user.id;
        productDetail.image =
          imageUrl && imageUrl.length > 0 ? imageUrl : productDetail.image;
        await Services.HintService.add(productDetail);
        Services.AnalyticsService.logEvent(
          AppConstant.AnalyticsEvents.HINT_ADDED,
        );
        this.props.toggleLoader(false);
        if (addAnother) {
          this.props.navigation.navigate('addHint_web', {
            url: productDetail.url,
            addAnother: true,
          });
        } else {
          this.props.tabStateHandler('MY HINTS');
          this.props.navigation.navigate('MY HINTS');
        }

        Services.AlertService.show(
          'success',
          'Success',
          'Hint added successfully',
        );
      }
    } catch (error) {
      console.log(error);
      this.props.toggleLoader(false);
      Services.AlertService.show('error', 'Failed', 'Something went wrong');
    }
  };

  render() {
    const productDetail = this.props.navigation.getParam('formValues');
    console.log(productDetail);
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>{productDetail.name}</Text>
        <View
          style={{
            width: '100%',
            maxHeight: hp('60%'),
          }}>
          <ScrollView
            bounces={false}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
            }}>
            <View style={styles.attributesContainer}>
              {productDetail.image &&
              productDetail.image.startsWith('data:') ? (
                <Image
                  style={{
                    borderRadius: 10,
                    marginVertical: hp('3%'),
                    height: wp('60%'),
                    width: wp('60%'),
                  }}
                  source={{uri: productDetail.image}}
                />
              ) : (
                <AutoHeightImage
                  style={{
                    borderRadius: 10,
                    marginVertical: hp('3%'),
                  }}
                  width={wp('60%')}
                  onError={err => {
                    console.log(err);
                  }}
                  fallbackSource={AppConstant.Images.productPlaceHolder}
                  source={
                    productDetail.image
                      ? {uri: productDetail.image}
                      : AppConstant.Images.productPlaceHolder
                  }
                />
              )}

              {productDetail.price.trim().length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Price</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>
                      {'$ ' + `${(+productDetail.price).toFixed(2)}`}
                    </Text>
                  </View>
                </View>
              )}

              {productDetail.brand.trim().length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Brand</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>{productDetail.brand}</Text>
                  </View>
                </View>
              )}

              {productDetail.store.trim().length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Store</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>{productDetail.store}</Text>
                  </View>
                </View>
              )}

              {productDetail.size_model.trim().length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Size/Model</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>
                      {productDetail.size_model}
                    </Text>
                  </View>
                </View>
              )}

              {productDetail.color_type.trim().length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Color/Type</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>
                      {productDetail.color_type}
                    </Text>
                  </View>
                </View>
              )}

              {productDetail.sku.trim().length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>SKU</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>{productDetail.sku}</Text>
                  </View>
                </View>
              )}

              {productDetail.url.trim().length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Website</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>{productDetail.url}</Text>
                  </View>
                </View>
              )}

              {productDetail.detail.trim().length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Detail</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>{productDetail.detail}</Text>
                  </View>
                </View>
              )}

              {productDetail.feedback.trim().length > 0 && (
                <View style={styles.attributeContainer}>
                  <View style={{width: '30%'}}>
                    <Text style={styles.leftText}>Why</Text>
                  </View>

                  <View style={{width: '70%', alignItems: 'flex-end'}}>
                    <Text style={styles.rightText}>
                      {productDetail.feedback}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            minHeight: hp('20%'),
            maxHeight: hp('25%'),
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginVertical: hp('3%'),
          }}>
          {productDetail.type === AppConstant.Status.hintType.WEB && (
            <CustomButton
              onClick={() => this.submitHandler(productDetail, true)}
              title="Continue Shopping"
              containerStyle={{
                backgroundColor: AppConstant.Colors.blue,
                paddingHorizontal: 0,
                width: wp('50%'),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          )}
          <CustomButton
            onClick={() => this.submitHandler(productDetail)}
            title="Add to Hints"
            containerStyle={{
              backgroundColor: AppConstant.Colors.lightGreen,
              paddingHorizontal: 0,
              width: wp('50%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleText: {
    alignSelf: 'center',
    color: AppConstant.Colors.black,
    fontSize: wp('5%'), // 20,
    fontFamily: AppConstant.Fonts.medium,
    marginTop: hp('1%'),
  },
  topImage: {
    width: wp('60%'),
    height: wp('60%'),
    backgroundColor: AppConstant.Colors.white,
    marginVertical: hp('3%'),
  },
  attributesContainer: {
    width: wp('60%'),
  },
  attributeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
  leftText: {
    textAlign: 'left',
    color: AppConstant.Colors.titlePlaceholder,
    fontSize: wp('3.75%'),
    fontFamily: AppConstant.Fonts.normal,
  },
  rightText: {
    textAlign: 'right',
    color: AppConstant.Colors.black,
    fontSize: wp('4%'),
    fontFamily: AppConstant.Fonts.medium,
  },
});

// Mapping redux state to props
const mapStateToProps = state => ({
  user: state.onboard.user,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
  tabStateHandler: state => dispatch(Actions.tabStateHandler(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
