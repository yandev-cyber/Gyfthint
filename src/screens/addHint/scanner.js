import React, {Component} from 'react';
import {
  View,
  Text,
  BackHandler,
  StatusBar,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {withNavigationFocus, NavigationEvents} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import BarcodeMask from 'react-native-barcode-mask';

import * as AppConstant from '../../constants';

import * as Common from '../../common';

class Scanner extends Component {
  state = {
    flashMode: RNCamera.Constants.FlashMode.auto,
    showScannerInfo: true,
  };

  async componentDidMount() {
    try {
      if (await Common.Helper.getData('showScannerInfo')) {
        this.setState({showScannerInfo: false});
      }

      this.props.navigation.setParams({
        activeTab: this.props.activeTab,
      });

      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeTab !== this.props.activeTab) {
      this.props.navigation.setParams({
        activeTab: this.props.activeTab,
      });
    }
  }

  componentWillUnmount() {
    StatusBar.setHidden(false);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    if (this.props.navigation.getParam('hasHistory')) {
      this.props.navigation.goBack();
    } else {
      this.props.navigation.navigate(
        this.props.navigation.getParam('activeTab'),
      );
    }
    return true;
  };

  closeInfo = () => {
    this.setState({showScannerInfo: false});
    Common.Helper.saveData('showScannerInfo', 'seen').then(r => console.log(r));
  };

  barcodeHandler = event => {
    try {
      const data = JSON.parse(event.data);
      if (data) {
        this.props.navigation.navigate('addHint_product_info_1', {
          formValues: {...data, type: AppConstant.Status.hintType.SCAN},
        });
      }
    } catch (error) {
      console.log(error);
      this.props.navigation.navigate('addHint_product_info_1', {
        formValues: {type: AppConstant.Status.hintType.SCAN},
      });
    }
  };
  renderCamera = () => (
    <RNCamera
      ref={ref => {
        this.camera = ref;
      }}
      onMountError={err => {
        console.log(err);
      }}
      style={{flex: 1, backgroundColor: AppConstant.Colors.black}}
      type={RNCamera.Constants.Type.back}
      flashMode={this.state.flashMode}
      androidCameraPermissionOptions={{
        title: 'Permission to use camera',
        message: 'We need your permission to use your camera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      }}
      androidRecordAudioPermissionOptions={{
        title: 'Permission to use audio recording',
        message: 'We need your permission to use your audio',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      }}
      onBarCodeRead={e => this.barcodeHandler(e)}
      // onGoogleVisionBarcodesDetected={({ barcodes }) => {
      //   console.log(barcodes);
      // }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <BarcodeMask
          width={hp('30%')}
          height={hp('30%')}
          edgeWidth={hp('7%')}
          edgeHeight={hp('7%')}
          edgeBorderWidth={2}
          animatedLineHeight={1}
          showAnimatedLine={true}
          transparency={0.48}
        />
        <View
          style={{
            width: wp('100%'),
            height: hp('100%'),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.state.showScannerInfo && (
            <View
              style={{
                borderRadius: 10,
                backgroundColor: 'rgba(175,223,226,0.76)',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: wp('7%'),
                paddingVertical: hp('1%'),
                zIndex: 999,
              }}>
              <TouchableWithoutFeedback onPress={() => this.closeInfo()}>
                <View style={styles.infoClose}>
                  <Image source={AppConstant.Images.drawerCloseIcon}/>
                </View>
              </TouchableWithoutFeedback>

              <View style={{marginVertical: hp('3%')}}>
                <Text style={[styles.infoText, {fontSize: wp('4%')}]}>
                  Scan a GyftHint QR code to add{' '}
                </Text>
                <Text style={[styles.infoText, {fontSize: wp('4%')}]}>
                  the item to our hints.{' '}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </RNCamera>
  );

  render() {
    const {isFocused} = this.props;
    console.log(isFocused);
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <NavigationEvents
          onWillBlur={() => {
            StatusBar.setHidden(false);
            BackHandler.removeEventListener(
              'hardwareBackPress',
              this.handleBackPress,
            );
          }}
          onDidFocus={() => {
            StatusBar.setHidden(true);
            BackHandler.addEventListener(
              'hardwareBackPress',
              this.handleBackPress,
            );
          }}
        />
        {isFocused && this.renderCamera()}
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate(
              this.props.navigation.getParam('activeTab'),
            );
          }}>
          <View style={styles.close}>
            <Image source={AppConstant.Images.closeIcon}/>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() =>
            this.props.navigation.navigate('addHint_product_info_1', {
              formValues: {type: AppConstant.Status.hintType.SCAN},
            })
          }>
          <View style={styles.skipContainer}>
            <Text style={styles.skipText}>SKIP</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConstant.Colors.black,
    opacity: 1,
  },
  preview: {
    flex: 1,
    backgroundColor: AppConstant.Colors.black,
    opacity: 1,
  },
  close: {
    position: 'absolute',
    top: wp('5%'),
    left: wp('5%'),
    padding: 10,
  },
  skipContainer: {
    position: 'absolute',
    top: wp('5%'),
    right: wp('5%'),
  },
  skipText: {
    color: AppConstant.Colors.white,
    fontSize: wp('4%'),
    padding: 10,
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: hp('5%'),
    width: hp('10%'),
    height: hp('10%'),
    borderRadius: hp('5%'),
    backgroundColor: AppConstant.Colors.blue,
  },
  gallery: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: wp('10%'),
    bottom: hp('5%'),
    width: hp('8%'),
    height: hp('8%'),
  },
  flash: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: wp('10%'),
    bottom: hp('5%'),
    width: hp('8%'),
    height: hp('8%'),
  },
  infoContainer: {
    height: hp('18%'),
    marginHorizontal: wp('10%'),
    borderRadius: 10,
    backgroundColor: 'rgba(175,223,226,0.76)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: hp('40%'),
    bottom: 0,
    left: 0,
    right: 0,
  },
  infoText: {
    color: AppConstant.Colors.black,
    fontSize: wp('4%'),
    fontFamily: AppConstant.Fonts.normal,
    textAlign: 'center',
  },
  infoClose: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

const mapStateToProps = state => ({
  activeTab: state.common.activeTab,
});

export default withNavigationFocus(connect(mapStateToProps, null)(Scanner));
