// Third party libraries
import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Custom components
import {CustomButton} from '../components';

// App constants
import * as AppConstant from '../constants';

// StateFull component
class Welcome extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp('8%'),
            }}>
            {/* <Text onAnimationEnd={() => Services.NavigationService.navigate(this.state.nextRoute)} style={{ fontSize: 30 }} animation="bounceIn" duration={2500} delay={3000}>LOGO</Text> */}
            <Image source={AppConstant.Images.bulbIcon} />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                fontSize: wp('10%'),
                color: AppConstant.Colors.salmon,
                fontFamily: AppConstant.Fonts.sylfaen,
                height: 'auto',
              }}>
              Gyft
            </Text>
            <Text
              style={{
                fontSize: wp('10%'),
                color: AppConstant.Colors.lightBlue,
                fontFamily: AppConstant.Fonts.sylfaen,
                height: 'auto',
              }}>
              Hint
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            onClick={() => this.props.navigation.navigate('login')}
            title="Login"
            containerStyle={[styles.button, styles.loginButtonColor]}
            titleStyle={styles.titleStyle}
          />
          <CustomButton
            onClick={() => this.props.navigation.navigate('registration')}
            title="Sign Up"
            containerStyle={[styles.button, styles.sigupButtonColor]}
            titleStyle={styles.titleStyle}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingBottom: hp('5%'),
  },
  button: {
    marginHorizontal: wp('1%'),
  },
  titleStyle: {
    fontFamily: AppConstant.Fonts.medium,
    fontSize: wp('4.25%'), //17
  },
  loginButtonColor: {
    backgroundColor: AppConstant.Colors.blue,
  },
  sigupButtonColor: {
    backgroundColor: AppConstant.Colors.salmon,
  },
});

export default Welcome;
