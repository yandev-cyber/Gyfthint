import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import _ from 'lodash';

import {NotificationsModal} from '../../components';

import * as AppConstant from '../../constants';

import * as Common from '../../common';

import * as Actions from '../../redux/actions';

class Calendar extends Component {
  static navigationOptions = ({navigation}) => ({
    headerRight: (
      <TouchableWithoutFeedback onPress={navigation.getParam('openModal')}>
        <View style={{marginRight: wp('3%'), padding: 10}}>
          <Image
            source={
              navigation.getParam('newNotification')
                ? AppConstant.Images.bellIconActive
                : AppConstant.Images.bellIcon
            }
          />
        </View>
      </TouchableWithoutFeedback>
    ),
  });

  componentDidMount() {
    this.props.selectMonth(this.props.months[new Date().getMonth()]);
    this.props.navigation.setParams({
      openModal: this.props.toggleNotification,
      newNotification: this.props.user.has_new_notification,
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.user.has_new_notification !==
      this.props.user.has_new_notification
    ) {
      this.props.navigation.setParams({
        newNotification: this.props.user.has_new_notification,
      });
    }
  }

  renderEventName = event => {
    if (event.name.startsWith('birthday')) {
      let formattedName = event.name.split('#'),
        userId = formattedName[1],
        birthYear = formattedName[2],
        age;

      if (birthYear !== 'null') {
        // console.log(
        //   formattedName[3].split(" ")[0],
        //   new Date(event.occurrence_date),
        //   new Date(event.occurrence_date).getFullYear()
        // );
        age = new Date(event.occurrence_date).getFullYear() - +birthYear;
      }

      if (this.props.user.id === userId) {
        formattedName = `My Birthday`;
      } else {
        formattedName = `${formattedName[3].split(' ')[0]}'s Birthday`;
      }

      return (
        <Text
          style={{
            fontSize: wp('4%'),
            fontFamily: AppConstant.Fonts.normal,
            color: AppConstant.Colors.black,
          }}>
          {formattedName}
          {this.props.user.id !== userId && birthYear !== 'null' ? (
            <Text
              style={{
                fontSize: wp('4.25%'),
                fontFamily: AppConstant.Fonts.normal,
                color: AppConstant.Colors.titlePlaceholder,
              }}>
              {' '}
              {age > 0 ? `  -   Turning ${age}!` : ''}{' '}
            </Text>
          ) : null}
        </Text>
      );
    } else {
      return (
        <Text
          style={{
            fontSize: wp('4%'),
            fontFamily: AppConstant.Fonts.normal,
            color: AppConstant.Colors.black,
          }}>
          {event.name}
        </Text>
      );
    }
  };

  redirectUserDetail = item => {
    if (item.event_type === AppConstant.Event.SPECIAL_EVENT) {
      if (this.props.user.id === item.user_id) {
        this.props.navigation.navigate('MY HINTS');
        this.props.tabStateHandler('MY HINTS');
      } else {
        this.props.navigation.navigate('user-detail', {
          user: {friend_id: item.user_id},
        });
      }
    }
  };

  renderEventRow = ({item}) => (
    <TouchableWithoutFeedback onPress={() => this.redirectUserDetail(item)}>
      <View
        style={{
          minHeight: hp('5%'),
          maxHeight: hp('7%'),
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginVertical: hp('1%'),
        }}>
        <View
          style={{
            minHeight: hp('5%'),
            maxHeight: hp('7%'),
            width: hp('5%'),
            borderRadius: hp('2.5%'),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: AppConstant.Colors.lightGreen,
          }}>
          <Text
            style={{
              fontSize: wp('4%'),
              fontFamily: AppConstant.Fonts.bold,
              color: AppConstant.Colors.white,
            }}>
            {item.occurrence_date.getDate()}
          </Text>
        </View>
        <View style={{width: '80%'}}>{this.renderEventName(item)}</View>
      </View>
    </TouchableWithoutFeedback>
  );

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View
          style={{
            flex: 0.2,
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
          {this.props.months.map((month, index) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => this.props.selectMonth(month)}
                key={index + ''}>
                <View>
                  <View
                    style={{
                      width: wp('15%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: hp('2.5%'),
                    }}>
                    <Text
                      style={{
                        fontSize: wp('3.25%'),
                        fontFamily:
                          AppConstant.Fonts[
                            this.props.selectedMonth.label === month.label
                              ? 'bold'
                              : 'regular'
                            ],
                        color: AppConstant.Colors.black,
                      }}>
                      {month.label.substr(0, 3)}
                    </Text>
                    {this.props.selectedMonth.label === month.label && (
                      <View
                        style={{
                          width: '50%',
                          height: 2,
                          backgroundColor: AppConstant.Colors.salmon,
                        }}
                      />
                    )}
                  </View>
                  {month.events.length > 0 && (
                    <View
                      style={{
                        height: wp('4%'),
                        minWidth: wp('4%'),
                        maxWidth: wp('20%'),
                        borderRadius: wp('2%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: wp('1%'),
                        right: 0,
                        padding: Common.Helper.isAndroid() ? 3 : 0,
                        backgroundColor: AppConstant.Colors.salmon,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: wp('2.5%'),
                          fontFamily: AppConstant.Fonts.medium,
                          color: AppConstant.Colors.white,
                        }}>
                        {month.events.length}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>

        <View
          style={{
            flex: 0.8,
          }}>
          <View style={{paddingHorizontal: wp('9%')}}>
            <Text
              style={{
                fontSize: wp('4.25%'),
                fontFamily: AppConstant.Fonts.medium,
                color: AppConstant.Colors.black,
              }}>
              {`${this.props.selectedMonth.label} - ${
                _.findIndex(this.props.months, {
                  label: this.props.selectedMonth.label,
                }) < new Date().getMonth()
                  ? new Date().getFullYear() + 1
                  : new Date().getFullYear()
              }`}
            </Text>
          </View>
          {this.props.selectedMonth.events.length > 0 ? (
            <FlatList
              bounces={false}
              style={{marginTop: hp('3%')}}
              contentContainerStyle={{paddingHorizontal: wp('9%')}}
              data={this.props.selectedMonth.events}
              keyExtractor={item => item.id}
              renderItem={this.renderEventRow}
              extraData={this.props.selectedMonth}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: wp('4%'),
                  fontFamily: AppConstant.Fonts.normal,
                  color: AppConstant.Colors.black,
                }}>
                No event in this month
              </Text>
            </View>
          )}
        </View>
        <NotificationsModal currentTab="MY CALENDAR"/>
      </View>
    );
  }
}

// Mapping redux state to props
const mapSateToProps = state => ({
  user: state.onboard.user,
  networkUsers: state.network.networkUsers,
  selectedMonth: state.events.selectedMonth,
  months: state.events.months,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
  tabStateHandler: state => dispatch(Actions.tabStateHandler(state)),
  selectMonth: value => dispatch(Actions.selectMonth(value)),
  saveEvents: events => dispatch(Actions.saveEvents(events)),
  toggleNotification: () => dispatch(Actions.toggleNotification(true)),
});

export default connect(mapSateToProps, mapDispatchToProps)(Calendar);
