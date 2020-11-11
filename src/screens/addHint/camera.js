import React, {Component} from 'react';
import {
  View,
  Text,
  BackHandler,
  Platform,
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
import ImagePicker from 'react-native-image-picker';
import {CameraKitCamera} from 'react-native-camera-kit';
import {connect} from 'react-redux';

// App Constants
import * as AppConstant from '../../constants';

import * as Common from '../../common';

import * as Services from '../../services';

class Camera extends Component {
  state = {
    flashMode: 'off',
    showInfo: true,
    zoom: 0,
  };

  async componentDidMount() {
    try {
      if (await Common.Helper.getData('showInfo')) {
        this.setState({showInfo: false});
      }

      let flashMode = await Common.Helper.getData('flashMode');

      if (flashMode) {
        this.setState({flashMode: flashMode});
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

  takePicture = async function() {
    if (this.camera) {
      const options = {
        quality: 0.4,
        fixOrientation: true,
      };

      let image;

      if (Common.Helper.isAndroid()) {
        image = await this.camera.takePictureAsync(options);
      } else {
        image = await this.camera.capture(true);
      }
      if (image) {
        this.props.navigation.navigate('addHint_image_preview', {
          previewUrl: image.uri,
        });
      }
    }
  };

  openGallery = () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel) {
        this.props.navigation.navigate('addHint_product_info_1', {
          formValues: {
            img: Common.Helper.isAndroid()
              ? 'file://' + response.path
              : response.uri,
          },
        });
      }
    });
  };

  toggleFlash = async () => {
    let flashMode = this.state.flashMode === 'off' ? 'on' : 'off';

    this.setState({flashMode: flashMode});

    if (!Common.Helper.isAndroid()) {
      await this.camera.setFlashMode(flashMode);
    }

    await Common.Helper.saveData('flashMode', flashMode);
  };

  closeInfo = () => {
    this.setState({showInfo: false});
    Common.Helper.saveData('showInfo', 'seen').then(r => console.log(r));
  };

  iOSCamera = () => (
    <CameraKitCamera
      ref={cam => (this.camera = cam)}
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
      cameraOptions={{
        flashMode: this.state.flashMode,
        focusMode: 'on',
        zoomMode: 'on',
        ratioOverlayColor: 'transparent',
      }}
      onReadQRCode={event => console.log(event.nativeEvent.qrcodeStringValue)} // optional
    />
  );

  androidCamera = () => (
    // <ZoomView setZoom={(value) => this.setState({ zoom: value })} >
    <RNCamera
      ref={ref => {
        this.camera = ref;
      }}
      autoFocus={true}
      zoom={this.state.zoom}
      style={styles.preview}
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
      }}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {this.state.showInfo && (
          <View
            style={{
              borderRadius: 10,
              backgroundColor: 'rgba(175,223,226,0.76)',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: wp('7%'),
              paddingVertical: hp('1%'),
            }}>
            <TouchableWithoutFeedback onPress={() => this.closeInfo()}>
              <View style={styles.infoClose}>
                <Image source={AppConstant.Images.drawerCloseIcon}/>
              </View>
            </TouchableWithoutFeedback>

            <View style={{marginVertical: hp('3%')}}>
              <Text style={[styles.infoText, {fontSize: wp('4%')}]}>
                Capture the image for your hint in{' '}
              </Text>
              <Text style={[styles.infoText, {fontSize: wp('4%')}]}>
                person from a store, or take a{' '}
              </Text>
              <Text style={[styles.infoText, {fontSize: wp('4%')}]}>
                snapshot of the catalog or
              </Text>
              <Text style={[styles.infoText, {fontSize: wp('4%')}]}>
                webpage If you see a barcode, scan{' '}
              </Text>
              <Text style={[styles.infoText, {fontSize: wp('4%')}]}>
                it now.{' '}
              </Text>
            </View>
          </View>
        )}
      </View>
    </RNCamera>
    // </ZoomView>
  );

  render() {
    const {isFocused} = this.props;

    return (
      <View style={styles.container}>
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

        {isFocused &&
        Platform.select({
          ios: this.iOSCamera(),
          android: this.androidCamera(),
        })}

        <TouchableWithoutFeedback
          onPress={() => {
            Services.AnalyticsService.logEvent(
              AppConstant.AnalyticsEvents.ABANDONED,
            );
            this.props.navigation.navigate(
              this.props.navigation.getParam('activeTab'),
            );
          }}>
          <View style={styles.close}>
            <Image source={AppConstant.Images.closeIcon}/>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            Services.AnalyticsService.logEvent(
              AppConstant.AnalyticsEvents.SKIP,
            );
            this.props.navigation.navigate('addHint_product_info_1', {
              formValues: {type: AppConstant.Status.hintType.SNAP},
            });
          }}>
          <View style={styles.skipContainer}>
            <Text style={styles.skipText}>SKIP</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this.takePicture.bind(this)}>
          <View style={styles.captureButton}>
            <Image source={AppConstant.Images.cameraIcon}/>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => this.openGallery()}>
          <View style={styles.gallery}>
            <Image source={AppConstant.Images.galleryIcon}/>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => this.toggleFlash()}>
          <View style={styles.flash}>
            <Image
              source={
                this.state.flashMode === 'off'
                  ? AppConstant.Images.flashOffIcon
                  : AppConstant.Images.flashOnIcon
              }
            />
          </View>
        </TouchableWithoutFeedback>

        {this.state.showInfo && !Common.Helper.isAndroid() && (
          <View style={styles.infoContainer}>
            <TouchableWithoutFeedback onPress={() => this.closeInfo()}>
              <View style={styles.infoClose}>
                <Image source={AppConstant.Images.drawerCloseIcon}/>
              </View>
            </TouchableWithoutFeedback>

            <View style={{marginVertical: hp('3%')}}>
              <Text style={styles.infoText}>
                Capture the image for your hint in{' '}
              </Text>
              <Text style={styles.infoText}>
                person from a store, or take a{' '}
              </Text>
              <Text style={styles.infoText}>snapshot of the catalog or</Text>
              <Text style={styles.infoText}>
                webpage If you see a barcode, scan{' '}
              </Text>
              <Text style={styles.infoText}>it now. </Text>
            </View>
          </View>
        )}
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
    //   fontSize: wp("5%") > 11 ? 11 : wp("5%"),
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

// Mapping redux state to props
const mapStateToProps = state => ({
  activeTab: state.common.activeTab,
});

export default withNavigationFocus(connect(mapStateToProps, null)(Camera));
