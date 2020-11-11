import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Tooltip from 'react-native-walkthrough-tooltip';
import {connect} from 'react-redux';

import * as AppConstant from '../constants';

import * as Actions from '../redux/actions';

class BottomTabBar extends Component {
  state = {
    activeTab: 'MY HINTS',
    showMenu: false,
    tabs: [
      {
        label: 'MY DASHBOARD',
        activeIcon: AppConstant.Images['active_dashboard'],
        inactiveIcon: AppConstant.Images['inactive_dashboard'],
      },
      {
        label: 'MY NETWORK',
        activeIcon: AppConstant.Images['active_network'],
        inactiveIcon: AppConstant.Images['inactive_network'],
      },
      {
        label: 'ADD HINT',
        activeIcon: AppConstant.Images['addHint'],
        inactiveIcon: AppConstant.Images['addHint'],
      },
      {
        label: 'MY CALENDAR',
        activeIcon: AppConstant.Images['active_calendar'],
        inactiveIcon: AppConstant.Images['inactive_calendar'],
      },
      {
        label: 'MY HINTS',
        activeIcon: AppConstant.Images['active_hints'],
        inactiveIcon: AppConstant.Images['inactive_hints'],
      },
    ],
  };

  tabClickHandler = label => {
    if (label !== 'ADD HINT') {
      this.setState({activeTab: label});
      this.props.tabStateHandler(label);
      this.props.navigation.navigate(label);
    } else {
      // alert('done');
      this.setState({showMenu: true});
    }
  };

  onPressHandler = route => {
    this.setState({showMenu: false});
    this.props.navigation.navigate(route);
  };

  render() {
    return (
      <React.Fragment>
        <Tooltip
          animated
          backgroundColor="rgba(255,255,255,0.8)"
          isVisible={this.state.showMenu}
          arrowSize={{
            width: wp('5%'),
            height: hp('1.25%'),
          }}
          tooltipStyle={{
            shadowColor: AppConstant.Colors.black,
            shadowOffset: {height: 0.1, width: 0.0},
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 5,
          }}
          contentStyle={{
            left: wp('1%'),
            right: wp('1%'),
            width: wp('90%'),
            borderRadius: 10,
            height: hp('20%'),
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: AppConstant.Colors.blue,
            opacity: 1,
          }}
          content={
            <React.Fragment>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.onPressHandler('addHint_camera');
                }}>
                <View
                  style={{
                    width: '28%',
                    marginVertical: hp('1%'),
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    backgroundColor: AppConstant.Colors.white,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: wp('4%'),
                      fontFamily: AppConstant.Fonts.medium,
                      color: AppConstant.Colors.salmon,
                    }}>
                    Snap
                  </Text>
                  <Image source={AppConstant.Images.snapCameraIcon}/>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: wp('2.5%'),
                        fontFamily: AppConstant.Fonts.regular,
                        color: AppConstant.Colors.black,
                      }}>
                      A photo
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.onPressHandler('addHint_web_input');
                }}>
                <View
                  style={{
                    width: '28%',
                    marginVertical: hp('1%'),
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    backgroundColor: AppConstant.Colors.white,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: wp('4%'),
                      fontFamily: AppConstant.Fonts.medium,
                      color: AppConstant.Colors.salmon,
                    }}>
                    Search
                  </Text>
                  <Image source={AppConstant.Images.largeSearchIcon}/>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: wp('2.5%'),
                        fontFamily: AppConstant.Fonts.regular,
                        color: AppConstant.Colors.black,
                      }}>
                      Online or paste
                    </Text>
                    <Text
                      style={{
                        fontSize: wp('2.5%'),
                        fontFamily: AppConstant.Fonts.regular,
                        color: AppConstant.Colors.black,
                      }}>
                      web address
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.onPressHandler('addHint_scanner');
                }}>
                <View
                  style={{
                    width: '28%',
                    marginVertical: hp('1%'),
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    backgroundColor: AppConstant.Colors.white,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: wp('4%'),
                      fontFamily: AppConstant.Fonts.medium,
                      color: AppConstant.Colors.salmon,
                    }}>
                    Scan
                  </Text>
                  <Image source={AppConstant.Images.qrCode}/>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: wp('2.5%'),
                        fontFamily: AppConstant.Fonts.regular,
                        color: AppConstant.Colors.black,
                      }}>
                      GyftHint QR
                    </Text>
                    <Text
                      style={{
                        fontSize: wp('2.5%'),
                        fontFamily: AppConstant.Fonts.regular,
                        color: AppConstant.Colors.black,
                      }}>
                      code
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </React.Fragment>
          }
          placement="top"
          onChildPress={() => this.setState({showMenu: false})}
          onClose={() => this.setState({showMenu: false})}>
          <View style={[styles.container, {elevation: 30}]}>
            {this.state.tabs.map((tab, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => this.tabClickHandler(tab.label)}>
                  <View style={styles.tabContainer}>
                    <View style={{zIndex: 10, position: 'relative'}}>
                      <Image
                        style={
                          tab.label === 'ADD HINT'
                            ? {
                              width: hp('11%'),
                              height: hp('11%'),
                              zIndex: 99999,
                            }
                            : {}
                        }
                        source={
                          this.props.activeTab === tab.label
                            ? tab.activeIcon
                            : tab.inactiveIcon
                        }
                      />
                    </View>
                    <Text
                      style={{
                        color:
                          tab.label === 'ADD HINT'
                            ? AppConstant.Colors.salmon
                            : tab.label === this.props.activeTab
                            ? AppConstant.Colors.checkBox
                            : AppConstant.Colors.titlePlaceholder,
                        fontSize: wp('2%'), // 8,
                        fontFamily: AppConstant.Fonts.medium,
                        marginTop: tab.label === 'ADD HINT' ? 0 : hp('1.5%'),
                        marginBottom:
                          tab.label === 'ADD HINT' ? hp('7.5%') : hp('1%'),
                        zIndex: tab.label === 'ADD HINT' ? 99999 : 1,
                      }}>
                      {tab.label}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </Tooltip>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 0.1,
    height: hp('10%'),
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    shadowColor: AppConstant.Colors.black,
    shadowOffset: {height: 0.1, width: 0.0},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  tabContainer: {
    flex: 0.5,
    alignItems: 'center',
  },
});

// Mapping redux state to props
const mapStateToProps = state => ({
  activeTab: state.common.activeTab,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  tabStateHandler: state => dispatch(Actions.tabStateHandler(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomTabBar);
