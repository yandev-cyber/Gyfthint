import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

import * as Actions from '../redux/actions';

import * as AppConstant from '../constants';

class SideDrawer extends Component {
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View
          style={{flex: 3, flexDirection: 'column', backgroundColor: 'white'}}>
          <ScrollView bounces={false} contentContainerStyle={{flexGrow: 1}}>
            <SafeAreaView
              style={{flex: 1, marginLeft: wp('10%')}}
              forceInset={{top: 'always', horizontal: 'never'}}>
              <View
                style={{
                  flex: 1.5,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: wp('4.5%'),
                    fontFamily: AppConstant.Fonts.bold,
                    color: AppConstant.Colors.black,
                  }}>
                  MENU
                </Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Image source={AppConstant.Images.myAccount} />
                <View
                  style={{
                    flex: 1,
                    marginLeft: wp('5%'),
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: '100%', height: '25%'}}>
                    <Text
                      style={{
                        fontSize: wp('3.5%'),
                        fontFamily: AppConstant.Fonts.medium,
                        color: AppConstant.Colors.black,
                      }}>
                      MY ACCOUNT
                    </Text>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate('editProfile')
                    }>
                    <View
                      style={{
                        width: '100%',
                        height: '30%',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: wp('3.75%'),
                          fontFamily: AppConstant.Fonts.regular,
                          color: AppConstant.Colors.titlePlaceholder,
                        }}>
                        Edit Profile
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate('paymentInformation')
                    }>
                    <View
                      style={{
                        width: '100%',
                        height: '30%',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: wp('3.75%'),
                          fontFamily: AppConstant.Fonts.regular,
                          color: AppConstant.Colors.titlePlaceholder,
                        }}>
                        Payment Information
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate('purchaseHistory')
                    }>
                    <View
                      style={{
                        width: '100%',
                        height: '30%',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: wp('3.75%'),
                          fontFamily: AppConstant.Fonts.regular,
                          color: AppConstant.Colors.titlePlaceholder,
                        }}>
                        Purchase History
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate('editProfile')
                    }>
                    <View
                      style={{
                        width: '100%',
                        height: '30%',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: wp('3.75%'),
                          fontFamily: AppConstant.Fonts.regular,
                          color: AppConstant.Colors.titlePlaceholder,
                        }}>
                        Privacy Setting
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  marginTop: hp('10%'),
                }}>
                <Image source={AppConstant.Images.myNetwork} />
                <View
                  style={{
                    flex: 1,
                    marginLeft: wp('5%'),
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: '100%', height: '25%'}}>
                    <Text
                      style={{
                        fontSize: wp('3.5%'),
                        fontFamily: AppConstant.Fonts.medium,
                        color: AppConstant.Colors.black,
                      }}>
                      MY NETWORK
                    </Text>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate('userNetwork')
                    }>
                    <View
                      style={{
                        width: '100%',
                        height: '40%',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: wp('3.75%'),
                          fontFamily: AppConstant.Fonts.regular,
                          color: AppConstant.Colors.titlePlaceholder,
                        }}>
                        My Family and Friends
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View
                style={{flex: 0.5, flexDirection: 'row', marginTop: hp('5%')}}>
                <Image source={AppConstant.Images.myCalendar} />
                <View
                  style={{
                    flex: 1,
                    marginLeft: wp('5%'),
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: '100%', height: '25%'}}>
                    <Text
                      style={{
                        fontSize: wp('3.5%'),
                        fontFamily: AppConstant.Fonts.medium,
                        color: AppConstant.Colors.black,
                      }}>
                      MY CALENDAR
                    </Text>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate('manageCelebrations')
                    }>
                    <View
                      style={{
                        width: '100%',
                        height: '40%',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: wp('3.75%'),
                          fontFamily: AppConstant.Fonts.regular,
                          color: AppConstant.Colors.titlePlaceholder,
                        }}>
                        Manage Holidays
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  {/* <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate("anniversary")
                    }
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        justifyContent: "center"
                      }}
                    >
                      <Text
                        style={{
                          fontSize: wp("3.75%"),
                          fontFamily: AppConstant.Fonts.regular,
                          color: AppConstant.Colors.titlePlaceholder
                        }}
                      >
                        My Anniversary
                      </Text>
                    </View>
                  </TouchableWithoutFeedback> */}
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginTop: hp('5%'),
                }}>
                <Image source={AppConstant.Images.customerSupport} />
                <TouchableWithoutFeedback
                  onPress={() => this.props.navigation.navigate('contactUs')}>
                  <View style={{marginLeft: wp('5%')}}>
                    <Text
                      style={{
                        fontSize: wp('3.5%'),
                        fontFamily: AppConstant.Fonts.medium,
                        color: AppConstant.Colors.black,
                      }}>
                      CUSTOMER SUPPORT
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',

                  justifyContent: 'flex-start',
                }}>
                <Image source={AppConstant.Images.termsAndCondition} />
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.props.navigation.navigate('termsAndConditions')
                  }>
                  <View style={{flex: 1, marginLeft: wp('5%')}}>
                    <Text
                      style={{
                        fontSize: wp('3.5%'),
                        fontFamily: AppConstant.Fonts.medium,
                        color: AppConstant.Colors.black,
                      }}>
                      {'TERMS & CONDITIONS'}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                <Image source={AppConstant.Images.privacyPolicy} />
                <View style={{marginLeft: wp('5%')}}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.props.navigation.navigate('privacyPolicy')
                    }>
                    <Text
                      style={{
                        fontSize: wp('3.5%'),
                        fontFamily: AppConstant.Fonts.medium,
                        color: AppConstant.Colors.black,
                      }}>
                      PRIVACY POLICY
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                <Image source={AppConstant.Images.signOut} />
                <TouchableWithoutFeedback onPress={() => this.props.signOut()}>
                  <View style={{marginLeft: wp('5%')}}>
                    <Text
                      style={{
                        fontSize: wp('3.5%'),
                        fontFamily: AppConstant.Fonts.medium,
                        color: AppConstant.Colors.black,
                      }}>
                      SIGN OUT
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </SafeAreaView>
          </ScrollView>
        </View>
        <View style={{flex: 1}}>
          <SafeAreaView
            style={{flex: 1, alignItems: 'center'}}
            forceInset={{top: 'always', horizontal: 'never'}}>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.toggleDrawer()}>
              <View style={{marginTop: hp('5%'), padding: 5}}>
                <Image source={AppConstant.Images.drawerCloseIcon} />
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(Actions.signOut()),
});

export default connect(null, mapDispatchToProps)(SideDrawer);
