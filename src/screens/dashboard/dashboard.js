import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import _ from 'lodash';
import * as Firebase from 'react-native-firebase';
import FastImage from 'react-native-fast-image';

import CustomButton from '../../components/customButton';
import NotificationsModal from '../../components/notificationsModal';

import * as AppConstant from '../../constants';

import * as Common from '../../common';

// Services
import * as Services from '../../services';

// Redux Actions
import * as Actions from '../../redux/actions';

class Dashboard extends Component {
  state = {
    eventsCardHeight: hp('20%'),
    months: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    seeMore: false,
    activeIndex: 0,
  };

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

  async componentDidMount() {
    setTimeout(() => {
      this.props.toggleLoader(true);
    }, 500);

    this.mounted = true;

    this.unsubscribe = [];

    const userId = Firebase.auth().currentUser.uid;

    this.unsubscribe[0] = Firebase.firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(
        {includeMetadataChanges: true},
        user => {
          console.log(user.get('active'));
          if (user.exists) {
            if (this.mounted) {
              if (
                user.data().blocked_users &&
                user.data().blocked_users.length !==
                this.props.user.blocked_users
              ) {
                this.props.getAllUsers();
              }
              this.props.saveLoggedInUser(user.data());
            }
            if (!user.data().active) {
              this.props.signOut();
            }
          }
        },
        err => {
          console.log(err);
        },
      );

    console.log(userId);

    this.unsubscribe[1] = Firebase.firestore()
      .collection('notifications')
      .where('receiver.user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .onSnapshot(
        data => {
          console.log(data);

          let notifications = [];
          data.forEach(notification => {
            notifications.push(notification.data());
          });
          this.props.saveNotifications(notifications);
        },
        err => {
          console.log(err);
        },
      );

    this.unsubscribe[2] = Firebase.firestore()
      .collection('networks')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(30)
      .onSnapshot(
        async data => {
          let users = [];
          data.forEach(user => {
            users.push(user.data());
          });
          this.props.networkUsersList(users);
          setTimeout(() => {
            let index = _.indexOf(
              this.props.networkUsers,
              _.filter(this.props.networkUsers, function(user) {
                return (
                  new Date(
                    new Date().getFullYear(),
                    user.dob.month - 1,
                    user.dob.day,
                    new Date().getHours(),
                    new Date().getMinutes(),
                    new Date().getSeconds(),
                    new Date().getMilliseconds(),
                  ) >= new Date()
                );
              })[0],
            );
            this.setState({
              activeIndex:
                index > -1 ? index : this.props.networkUsers.length - 1,
            });
          }, 1000);
          this.props.toggleNetworkUsersHasMore(
            users.length >= 30,
          );
          this.props.saveEvents(await Services.EventService.getEvents());
        },
        err => {
          console.log(err);
        },
      );

    this.unsubscribe[3] = Firebase.firestore()
      .collection('events')
      .where(
        'occurrence_date',
        '>=',
        new Date(`${new Date().getFullYear()}/${new Date().getMonth() + 1}/1`),
      )
      .onSnapshot(data => {
        let events = [];
        data.forEach(event => {
          events.push(event.data());
        });

        this.props.saveEvents(events);
      });

    this.unsubscribe[4] = Firebase.firestore()
      .collection('states')
      .orderBy('name')
      .onSnapshot(data => {
        let states = [];
        data.forEach(state => {
          states.push({
            key: state.data().id,
            label: state.data().name,
            value: state.data().name,
          });
        });
        this.props.saveStates(states);
      });

    try {
      if (this.props.cards.length === 0) {
        let cards = await Services.CardService.getAll();
        if (cards) {
          console.log(cards);
          this.props.saveCards(cards);
        }
      }
    } catch (error) {
      console.log(error);
    }

    if (this.props.celebrations.length === 0) {
      this.props.getCelebrations();
    }

    this.props.getAllUsers();

    let fbiid = await Services.NotificationService.generateToken();
    await Services.UserService.update(this.props.user.id, {
      fbiid,
      badgeCount: 0,
    });

    if (!Common.Helper.isAndroid()) {
      Firebase.notifications().setBadge(0);
    }

    this.props.navigation.setParams({
      openModal: this.props.toggleNotification,
      newNotification: this.props.user.has_new_notification,
    });

    setTimeout(() => {
      this.props.toggleLoader(false);
    }, 1200);
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

  componentWillUnmount() {
    for (let i = 1; i < this.unsubscribe.length; i++) {
      this.unsubscribe[i]();
    }
    this.mounted = false;
  }

  renderEventName = (name, occurrenceDate) => {
    let formattedDate = `${
      this.state.months[occurrenceDate.getMonth()]
    } ${occurrenceDate
      .getDate()
      .toString()
      .padStart(2, '0')},`;

    if (name.startsWith('birthday')) {
      let formattedName = name.split('#'),
        userId = formattedName[1],
        birthYear = formattedName[2],
        age;

      if (birthYear !== 'null') {
        age = new Date().getFullYear() - +birthYear;
      }

      if (this.props.user.id === userId) {
        formattedName = `My Birthday`;
      } else {
        formattedName = `${formattedName[3].split(' ')[0]}`;
      }

      return (
        <Text
          style={{
            fontFamily: AppConstant.Fonts.normal,
            fontSize: wp('3.25%'),
            color: AppConstant.Colors.titlePlaceholder,
          }}>
          {formattedDate + ' ' + formattedName}
          {this.props.user.id !== userId && birthYear !== 'null' ? (
            <Text
              style={{
                fontFamily: AppConstant.Fonts.normal,
                fontSize: wp('3.25%'),
                color: AppConstant.Colors.titlePlaceholder,
              }}>
              {' '}
              {` turns ${age}!`}{' '}
            </Text>
          ) : null}
        </Text>
      );
    } else {
      return (
        <Text
          style={{
            fontFamily: AppConstant.Fonts.normal,
            fontSize: wp('3.25%'),
            color: AppConstant.Colors.titlePlaceholder,
          }}>
          {formattedDate + ' ' + name}
        </Text>
      );
    }
  };

  renderEventRow = event => (
    <View
      key={event.id}
      style={{
        marginLeft: wp('5%'),
        marginTop: hp('2%'),
        flexDirection: 'row',
      }}>
      <Image
        resizeMode="contain"
        style={{marginRight: wp('3%'), marginTop: wp('0.5%')}}
        source={AppConstant.Images.starIcon}
      />
      {this.renderEventName(event.name, event.occurrence_date)}
    </View>
  );

  renderUser = ({item, index}) => {
    return (
      <View
        style={{
          shadowColor: AppConstant.Colors.black,
          shadowOffset: {height: 0.1, width: 0.0},
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 5,
          borderRadius: 10,
          backgroundColor: 'white',
          width: hp('22%'),
          height: hp('26%'),
          // margin: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FastImage
          style={{
            width: wp('16%'),
            height: wp('16%'),
            borderRadius: wp('8%'),
          }}
          source={
            item.image
              ? {uri: item.image}
              : AppConstant.Images.placeholderAvatar
          }
        />

        {index === this.state.activeIndex && (
          <React.Fragment>
            <Text
              style={{
                fontFamily: AppConstant.Fonts.medium,
                fontSize: wp('4%'),
                color: AppConstant.Colors.black,
                marginTop: hp('1%'),
                textAlign: 'center',
              }}>
              {item.first_name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: hp('1%'),
                marginTop: hp('0.5%'),
              }}>
              <Image source={AppConstant.Images.cakeIcon}/>
              <Text
                style={{
                  marginLeft: wp('3%'),
                  marginTop: 2,
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('3.25%'),
                  color: AppConstant.Colors.dobText,
                }}>
                {`${this.state.months[item.dob.month - 1]} ${item.dob.day}${
                  item.is_birth_year ? ', ' + item.dob.year : ''
                }` || 'NA'}
              </Text>
            </View>
            <CustomButton
              onClick={() =>
                this.props.navigation.navigate('user-detail', {user: item})
              }
              title="Buy a Gift"
              titleStyle={{fontSize: wp('3.25%')}}
              containerStyle={{
                backgroundColor: AppConstant.Colors.lightGreen,
                paddingVertical: hp('1%'),
                paddingHorizontal: wp('5%'),
              }}
            />
          </React.Fragment>
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: hp('5%'),
            paddingHorizontal: wp('10%'),
            width: wp('100%'),
            backgroundColor: 'white',
            justifyContent: 'space-evenly',
          }}>
          <View
            removeClippedSubviews={false}
            style={{
              elevation: 5,
              shadowColor: AppConstant.Colors.black,
              shadowOffset: {height: 0.1, width: 0.0},
              shadowOpacity: 0.2,
              shadowRadius: 6,
              paddingTop: 10,
            }}>
            <View
              style={{
                overflow: 'hidden',
                height: hp('15%'),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                resizeMode="cover"
                style={{width: '100%', height: '100%', borderRadius: 10}}
                source={AppConstant.Images.dashboardBanner}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                top: hp('2.5%'),
                left: wp('5%'),
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.medium,
                  fontSize: wp('3.5%'),
                  color: AppConstant.Colors.white,
                }}>
                Invite family and friends
              </Text>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.medium,
                  fontSize: wp('3.5%'),
                  color: AppConstant.Colors.white,
                }}>
                to GyftHint!
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: hp('1.75%'),
                left: wp('22%'),
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <CustomButton
                onClick={() => Common.Helper.socialShare()}
                title="INVITE NOW"
                titleStyle={{
                  color: AppConstant.Colors.salmon,
                  fontSize: wp('2.75%'),
                  fontFamily: AppConstant.Fonts.normal,
                }}
                containerStyle={{
                  backgroundColor: AppConstant.Colors.white,
                  borderRadius: 2,
                  paddingVertical: hp('0.5%'),
                  width: wp('30%'),
                  paddingHorizontal: 0,
                  elevation: 0,
                  shadowColor: AppConstant.Colors.white,
                  shadowOffset: {height: 0, width: 0},
                  shadowOpacity: 0,
                  shadowRadius: 0,
                }}
              />
            </View>
          </View>
          <View
            style={{
              shadowColor: AppConstant.Colors.black,
              shadowOffset: {height: 0.1, width: 0.0},
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 5,
              borderRadius: 10,
              minHeight: hp('10%'),
              maxHeight: hp('50%'),
              paddingBottom: hp('2%'),
              marginTop: hp('2%'),
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <ScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '80%'}}>
                <Text
                  style={{
                    marginLeft: wp('5%'),
                    marginTop: hp('3%'),
                    fontFamily: AppConstant.Fonts.medium,
                    fontSize: wp('4%'),
                    color: AppConstant.Colors.black,
                  }}>
                  My Next 30 Days
                </Text>

                {this.props.events.length === 0 && (
                  <View
                    style={{
                      height: hp('10%'),
                      justifyContent: 'center',
                      marginLeft: wp('5%'),
                    }}>
                    <Text
                      style={{
                        fontSize: wp('4%'),
                        fontFamily: AppConstant.Fonts.normal,
                        color: AppConstant.Colors.black,
                      }}>
                      No upcoming events
                    </Text>
                  </View>
                )}

                {this.state.seeMore &&
                this.props.events.map(event => {
                  return this.renderEventRow(event);
                })}

                {!this.state.seeMore &&
                this.props.events.map((event, index) => {
                  if (index < 3) {
                    return this.renderEventRow(event);
                  }
                })}

                {!this.state.seeMore && this.props.events.length > 3 && (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.setState({seeMore: true});
                    }}>
                    <View style={{marginLeft: wp('10%'), marginTop: hp('2%')}}>
                      <Text
                        style={{
                          fontFamily: AppConstant.Fonts.normal,
                          fontSize: wp('3.25%'),
                          color: AppConstant.Colors.checkBoxGreen,
                        }}>
                        See all
                      </Text>
                      <View
                        style={{
                          width: '20%',
                          height: 1,
                          backgroundColor: AppConstant.Colors.checkBoxGreen,
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                )}

                {this.state.seeMore && (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.setState({seeMore: false});
                    }}>
                    <View style={{marginLeft: wp('10%'), marginTop: hp('2%')}}>
                      <Text
                        style={{
                          fontFamily: AppConstant.Fonts.normal,
                          fontSize: wp('3.25%'),
                          color: AppConstant.Colors.checkBoxGreen,
                        }}>
                        See less
                      </Text>
                      <View
                        style={{
                          width: '25%',
                          height: 1,
                          backgroundColor: AppConstant.Colors.lightGreen,
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </View>
            </ScrollView>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.toggleTabState('MY CALENDAR');
                this.props.navigation.navigate('MY CALENDAR');
              }}>
              <View
                style={{
                  width: wp('15%'),
                  marginTop: hp('2%'),
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <View
                  style={{
                    width: wp('10%'),
                    height: wp('10%'),
                    borderRadius: wp('5%'),
                    backgroundColor: AppConstant.Colors.lightGreen,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    source={AppConstant.Images.calendarIcon}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{
              minHeight: hp('20%'),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
            }}>
            {this.props.networkUsers && this.props.networkUsers.length > 0 && (
              <Carousel
                data={this.props.networkUsers}
                renderItem={this.renderUser}
                sliderWidth={wp('100%')}
                itemWidth={hp('24%')}
                firstItem={this.state.activeIndex}
                inactiveSlideOpacity={1}
                enableMomentum={!Common.Helper.isAndroid()}
                enableSnap={true}
                useScrollView={!Common.Helper.isAndroid()}
                inactiveSlideScale={0.5}
                onBeforeSnapToItem={slideIndex => {
                  this.setState({activeIndex: slideIndex});
                }}
                onSnapToItem={slideIndex => {
                  this.setState({activeIndex: slideIndex});
                }}
                slideStyle={{
                  height: hp('30%'),

                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                }}
              />
            )}
            {this.props.networkUsers.length > 0 && (
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('userNetwork')}>
                <View
                  style={{position: 'absolute', right: 0, bottom: hp('1%')}}>
                  <Text
                    style={{
                      fontFamily: AppConstant.Fonts.normal,
                      fontSize: wp('3.25%'),
                      color: AppConstant.Colors.salmon,
                    }}>
                    View All
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: AppConstant.Colors.salmon,
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
          <View>
            <CustomButton
              onClick={() => this.props.navigation.navigate('user-list')}
              title="Find Family and Friends"
              leftIcon={AppConstant.Images.giftIcon}
              leftIconStyle={{marginRight: wp('5%')}}
              // titleStyle={{ color: AppConstant.Colors.salmon, fontSize: wp('2.75%'), fontFamily: AppConstant.Fonts.normal }}
              containerStyle={{
                backgroundColor: AppConstant.Colors.blue,
                marginTop: hp('2%'),
                paddingVertical: hp('1%'),
                shadowColor: AppConstant.Colors.black,
                shadowOffset: {height: 3, width: 0},
                shadowOpacity: 0.2,
                shadowRadius: 6,
              }}
            />
          </View>
        </ScrollView>
        <NotificationsModal currentTab="MY DASHBOARD"/>
      </View>
    );
  }
}

// Mapping redux state to props
const mapSateToProps = state => ({
  user: state.onboard.user,
  celebrations: state.onboard.celebrations,
  cards: state.users.cards,
  networkUsers: _.sortBy(
    state.network.networkUsers,
    ['dob.month', 'dob.day', 'full_name'],
    ['asc', 'asc', 'asc'],
  ),
  events: [
    ...state.events.months[new Date().getMonth()].events,
    ...state.events.months[
      new Date().getMonth() === 11 ? 0 : new Date().getMonth() + 1
      ].events,
  ].filter(event => {
    let currentDate = new Date(),
      dateAterMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return (
      event.occurrence_date >=
      new Date(
        Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          12,
        ),
      ) &&
      event.occurrence_date <=
      new Date(
        Date.UTC(
          dateAterMonth.getFullYear(),
          dateAterMonth.getMonth(),
          dateAterMonth.getDate(),
          12,
        ),
      )
    );
  }),
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
  saveLoggedInUser: user => dispatch(Actions.saveLoggedInUser(user)),
  saveCards: cards => dispatch(Actions.saveCards(cards)),
  getCelebrations: () => dispatch(Actions.celebrationsList()),
  saveNotifications: notifications =>
    dispatch(Actions.saveNotifications(notifications)),
  networkUsersList: users => dispatch(Actions.networkUsersList(users)),
  saveEvents: events => dispatch(Actions.saveEvents(events)),
  signOut: () => dispatch(Actions.signOut()),
  toggleNetworkUsersHasMore: value =>
    dispatch(Actions.toggleNetworkUsersHasMore(value)),
  toggleTabState: value => dispatch(Actions.tabStateHandler(value)),
  getAllUsers: (cursor, keyword) =>
    dispatch(Actions.getAllUsers(cursor, keyword)),
  toggleNotification: () => dispatch(Actions.toggleNotification(true)),
  saveStates: data => dispatch(Actions.saveStates(data)),
});

export default connect(mapSateToProps, mapDispatchToProps)(Dashboard);
