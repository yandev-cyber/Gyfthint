import React, {Component} from 'react';
import {
  View,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {NavigationEvents} from 'react-navigation';

// Custom Components
import {CustomButton} from '../../components';

// App Constants
import * as AppConstant from '../../constants';

class ImagePreview extends Component {
  componentWillUnmount() {
    StatusBar.setHidden(false);
  }

  render() {
    return (
      <ImageBackground
        source={{uri: this.props.navigation.getParam('previewUrl')}}
        style={styles.container}>
        <NavigationEvents
          onWillBlur={() => {
            StatusBar.setHidden(false);
          }}
          onWillFocus={() => {
            StatusBar.setHidden(true);
          }}
        />

        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <View style={styles.close}>
            <Image source={AppConstant.Images.closeIcon}/>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.continue}>
          <CustomButton
            onClick={() =>
              this.props.navigation.navigate('addHint_product_info_1', {
                formValues: {
                  img: this.props.navigation.getParam('previewUrl'),
                  type: AppConstant.Status.hintType.SNAP,
                },
              })
            }
            title="Continue"
            containerStyle={{
              backgroundColor: AppConstant.Colors.lightGreen,
              paddingVertical: hp('2%'),
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: AppConstant.Colors.white,
  },
  close: {
    flex: 0,
    marginTop: wp('5%'),
    marginLeft: wp('5%'),
  },
  continue: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('8%'),
    alignSelf: 'flex-end',
  },
});

export default ImagePreview;
