import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinkPreview from 'react-native-link-preview';
import Carousel from 'react-native-snap-carousel';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

import {CustomButton} from '../../../components';

import * as AppConstant from '../../../constants';

import * as Common from '../../../common';

import * as Services from '../../../services';

import * as Actions from '../../../redux/actions';

class WebPreview extends Component {
  state = {
    productImages: [],
    activeIndex: 0,
  };

  componentDidMount() {
    this.props.toggleLoader(true);
    LinkPreview.getPreview(this.props.navigation.getParam('formValues').url)
      .then(data => {
        this.props.toggleLoader(false);
        console.log(data);
        this.setState({productImages: data.images});
      })
      .catch(error => {
        console.log(error);
        this.props.toggleLoader(false);
      });
  }

  submitHandler = async (productDetail, addAnother = false) => {
    try {
      this.setState({disabled: true});
      if (!this.state.disabled) {
        this.props.toggleLoader(true);
        let imageUrl = '';
        productDetail.image = this.state.productImages.length
          ? this.state.productImages[this.state.activeIndex]
          : '';
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

  renderImage = ({item}) => {
    return (
      <Image
        resizeMode="contain"
        style={{width: wp('50%'), height: wp('50%')}}
        source={{uri: item ? item : AppConstant.Images.productPlaceHolder}}
      />
    );
  };

  render() {
    const productDetail = this.props.navigation.getParam('formValues');
    return (
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: AppConstant.Colors.blue,
        }}>
        <Text style={styles.h1}>Great, we got it!</Text>
        <Text style={[styles.h2, {marginTop: 7}]}>
          Please select the image that
        </Text>
        <Text style={styles.h2}>represents the gift you like</Text>
        <View
          style={{
            flexDirection: 'row',
            height: hp('27%'),
            marginTop: hp('2%'),
          }}>
          <View
            style={{
              width: wp('20%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.productImages.length > 0 &&
              this.state.activeIndex !== 0 && (
                <TouchableWithoutFeedback
                  onPress={() => this._carousel.snapToPrev()}>
                  <View style={{padding: 20}}>
                    <Image
                      resizeMode="contain"
                      source={AppConstant.Images.leftArrow}
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
          </View>
          <View
            style={{
              width: wp('50%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.productImages.length ? (
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.productImages}
                renderItem={this.renderImage}
                sliderWidth={wp('50%')}
                itemWidth={wp('50%')}
                firstItem={this.state.activeIndex}
                inactiveSlideOpacity={1}
                activeSlideOffset={5}
                useScrollView={false}
                activeSlideAlignment={'center'}
                onBeforeSnapToItem={slideIndex => {
                  setTimeout(() => {
                    this.setState({activeIndex: slideIndex});
                  }, 0);
                }}
                onSnapToItem={slideIndex => {
                  setTimeout(() => {
                    this.setState({activeIndex: slideIndex});
                  }, 0);
                }}
                slideStyle={{
                  height: hp('27%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: AppConstant.Colors.blue,
                }}
              />
            ) : (
              <Image
                style={{height: hp('27'), width: hp('27%')}}
                source={AppConstant.Images.productPlaceHolder}
              />
            )}
          </View>
          <View
            style={{
              width: wp('20%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.productImages.length > 0 &&
              this.state.activeIndex < this.state.productImages.length - 1 && (
                <TouchableWithoutFeedback
                  onPress={() => this._carousel.snapToNext()}>
                  <View style={{padding: 20}}>
                    <Image
                      resizeMode="contain"
                      source={AppConstant.Images.rightArrow}
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
          </View>
        </View>
        <View
          style={{
            height: hp('25%'),
            justifyContent: 'space-evenly',
            paddingHorizontal: wp('10%'),
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '40%'}}>
              <Text
                style={{
                  textAlign: 'left',
                  color: AppConstant.Colors.white,
                  fontSize: wp('4.5%'),
                  fontFamily: AppConstant.Fonts.bold,
                }}>
                Name:
              </Text>
            </View>

            <View style={{width: '60%'}}>
              <Text
                style={{
                  textAlign: 'right',
                  color: AppConstant.Colors.orText,
                  fontSize: wp('4.5%'),
                  fontFamily: AppConstant.Fonts.bold,
                }}>
                {productDetail.name}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={{width: '40%'}}>
              <Text
                style={{
                  textAlign: 'left',
                  color: AppConstant.Colors.white,
                  fontSize: wp('4.5%'),
                  fontFamily: AppConstant.Fonts.bold,
                }}>
                Price:
              </Text>
            </View>

            <View style={{width: '60%'}}>
              <Text
                style={{
                  textAlign: 'right',
                  color: AppConstant.Colors.orText,
                  fontSize: wp('4.5%'),
                  fontFamily: AppConstant.Fonts.bold,
                }}>
                {`$${productDetail.price}`}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '40%'}}>
              <Text
                style={{
                  textAlign: 'left',
                  color: AppConstant.Colors.white,
                  fontSize: wp('4.5%'),
                  fontFamily: AppConstant.Fonts.bold,
                }}>
                Size/model:
              </Text>
            </View>

            <View style={{width: '60%'}}>
              <Text
                style={{
                  textAlign: 'right',
                  color: AppConstant.Colors.orText,
                  fontSize: wp('4.5%'),
                  fontFamily: AppConstant.Fonts.bold,
                }}>
                {productDetail.size_model || 'N/A'}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '40%'}}>
              <Text
                style={{
                  textAlign: 'left',
                  color: AppConstant.Colors.white,
                  fontSize: wp('4.5%'),
                  fontFamily: AppConstant.Fonts.bold,
                }}>
                Color/type:
              </Text>
            </View>

            <View style={{width: '60%'}}>
              <Text
                style={{
                  textAlign: 'right',
                  color: AppConstant.Colors.orText,
                  fontSize: wp('4.5%'),
                  fontFamily: AppConstant.Fonts.bold,
                }}>
                {productDetail.color_type || 'N/A'}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: hp('15%'),
            justifyContent: 'center',
          }}>
          <CustomButton
            onClick={() => this.submitHandler(productDetail, true)}
            title="Keep Shopping"
            containerStyle={[
              styles.submitButton,
              {
                backgroundColor: AppConstant.Colors.darkGreen,
                marginBottom: 18,
              },
            ]}
          />
          <CustomButton
            onClick={() => this.submitHandler(productDetail)}
            title="View My Hints"
            containerStyle={[styles.submitButton]}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: AppConstant.Fonts.medium,
    fontSize: wp('8%'),
    color: AppConstant.Colors.orText,
    marginTop: hp('3%'),
  },
  h2: {
    fontFamily: AppConstant.Fonts.normal,
    fontSize: wp('4%'),
    color: AppConstant.Colors.white,
  },
  paragraphContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: hp('5%'),
    marginBottom: hp('3%'),
  },
  paragraph: {
    fontFamily: AppConstant.Fonts.normal,
    fontSize: wp('3.75%'),
    color: AppConstant.Colors.black,
  },
  submitButton: {
    backgroundColor: AppConstant.Colors.salmon,
    width: wp('65%'),
    paddingHorizontal: 0,
    paddingVertical: hp('1.5%'),
  },
});

const mapStateToProps = state => ({
  user: state.onboard.user,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
  tabStateHandler: state => dispatch(Actions.tabStateHandler(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WebPreview);
