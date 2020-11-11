import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import * as Firebase from 'react-native-firebase';
import _ from 'lodash';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FastImage from 'react-native-fast-image';

// Custom Components
import {
  CustomButton,
  CustomPicker,
  HintDetailModal,
  PurchaseModal,
  NotificationsModal,
  PreferencesList,
  HintCard,
} from '../../components';

// Services
import * as Services from '../../services';

// Redux Actions
import * as Actions from '../../redux/actions';

// App Constants
import * as AppConstant from '../../constants';

import * as Common from '../../common';

export class Profile extends PureComponent {
  state = {
    selectedHint: {
      name: 'Ink cartridges',
      image: '',
      price: 29,
      shipping_and_handling: 0,
      sales_tax: 0,
      size_model: '932',
      feedback: '',
      brand: 'Staples',
      store: 'Staples',
      color_type: '',
      detail:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
      sku: '103439117',
      url: '',
    },
    showHintDetailModal: false,
    showPurchaseModal: false,
    hasMore: true,
    buyForSelf: true,
    hints: [],
    originalHints: [],
    orderBy: [
      {
        label: 'Sort by price highest to lowest',
        key: 1,
        value: {key: 'final_price', direction: 'desc'},
      },
      {
        label: 'Sort by price lowest to highest',
        key: 1,
        value: {key: 'final_price', direction: 'asc'},
      },
      {
        label: 'Sort by most recent',
        key: 1,
        value: {key: 'created_at', direction: 'desc'},
      },
    ],
    orderByValue: {
      key: 'final_price',
      direction: 'desc',
    },
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
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
    this.props.navigation.setParams({
      openModal: this.props.toggleNotification,
      newNotification: this.props.user.has_new_notification,
    });

    this.props.toggleLoader(true);
    console.log(this.props.user);
    const userId = Firebase.auth().currentUser.uid;
    try {
      this.unsubscribe = Firebase.firestore()
        .collection('hints')
        .where('user_id', '==', userId)
        .orderBy(this.state.orderByValue.key, this.state.orderByValue.direction)
        .limit(30)
        .onSnapshot(data => {
          if (!data.empty) {
            let hints = [];
            data.forEach(doc => {
              let hint = doc.data();
              if (hint.status < AppConstant.Status.hint.DECLINED) {
                hints.push(hint);
              }
            });
            this.listHints(hints, true);
          }
        });
    } catch (error) {
      console.log(error);
    }

    this.props.toggleLoader(false);
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
    this.unsubscribe();
  }

  getHints = async (userId, cursor, order, isNew = false) => {
    try {
      const hints = await Services.HintService.get(userId, cursor, order);
      this.listHints(hints, isNew);
    } catch (error) {
      console.log(error);
    }
  };

  listHints = (hints, isNew) => {
    let updatedHints = [],
      newHints = isNew ? hints : this.state.originalHints.concat(hints);
    if (hints.length > 0) {
      let oddColumn = newHints.filter((hint, index) => index % 2 === 1),
        evenColumn = newHints.filter((hint, index) => index % 2 === 0);
      updatedHints = [evenColumn, oddColumn];
      this.setState({
        hints: updatedHints,
        originalHints: newHints,
        hasMore: hints.length >= 30,
      });
    }
  };

  deleteHint = hint => {
    Alert.alert(
      'Confirmation',
      AppConstant.Alert.HINT_DELETE_CONFIRMATION_DIALOG,
      [
        {
          text: 'Nevermind',
          onPress: () => {
            console.log('canceled');
          },
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              this.props.toggleLoader(true);
              let isDeleted = await Services.HintService.update(
                {status: AppConstant.Status.hint.DELETED},
                hint.id,
              );
              this.props.toggleLoader(false);
              if (isDeleted) {
                Services.AnalyticsService.logEvent(
                  AppConstant.AnalyticsEvents.HINT_DELETED,
                );
                Services.AlertService.show(
                  'success',
                  'Success',
                  'Hint deleted successfully',
                );
              } else {
                Services.AlertService.show(
                  'error',
                  'Failed',
                  'Something went wrong',
                );
              }
            } catch (error) {
              console.log(error);
              this.props.toggleLoader(false);
              Services.AlertService.show(
                'error',
                'Failed',
                'Something went wrong',
              );
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  openModal = key => {
    let state = {};
    state[key] = true;
    this.setState(state);
  };

  closeModal = key => {
    let state = {};
    state[key] = false;
    this.setState(state);
  };

  loadMore = () => {
    if (this.state.hasMore) {
      this.getHints(
        this.props.user.id,
        this.state.originalHints[this.state.originalHints.length - 1],
        this.state.orderByValue,
      ).then(r => console.log(r));
    }
  };

  showPurchaseModel() {
    this.closeModal('showHintDetailModal');
    setTimeout(
      () => {
        this.openModal('showPurchaseModal');
      },
      Common.Helper.isAndroid() ? 0 : 1000,
    );
  }

  renderHintColumn = ({item, index}) => (
    <View key={index + ''} style={{marginHorizontal: wp('2%')}}>
      {item.map(hint => {
        return (
          <HintCard
            key={hint.id}
            user={this.props.user}
            hint={hint}
            openModal={() => this.openModal('showHintDetailModal')}
            selectHint={selectedHint => this.setState({selectedHint})}
            deleteHint={deleteHint => this.deleteHint(deleteHint)}
          />
        );
      })}
    </View>
  );

  RenderHints = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
        {this.state.hints.length > 0 ? (
          <React.Fragment>
            <View
              style={{
                marginVertical: hp('2%'),
                alignSelf: 'center',
                width: wp('85%'),
              }}>
              <CustomPicker
                value={this.state.orderByValue}
                style={{
                  headlessAndroidPicker: {
                    fontSize: wp('3.25%'),
                    fontFamily: AppConstant.Fonts.regular,
                    color: AppConstant.Colors.black,
                  },
                  headlessAndroidContainer: {
                    borderRadius: wp('15%'),
                    paddingLeft: wp('3%'),
                    borderWidth: 1,
                    borderColor: AppConstant.Colors.inputTextPlaceholder,
                    height: 40,
                    justifyContent: 'center',
                  },
                  viewContainer: {
                    borderRadius: wp('15%'),
                    paddingLeft: wp('3%'),
                    borderWidth: 1,
                    borderColor: AppConstant.Colors.inputTextPlaceholder,
                    height: 40,
                    justifyContent: 'center',
                  },
                }}
                onValueChange={value => {
                  this.getHints(this.props.user.id, null, value, true).then(r =>
                    console.log(r),
                  );
                  this.setState({orderByValue: value});
                }}
                data={this.state.orderBy}
                placeholder={{}}
              />
            </View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{
                paddingTop: hp('2%'),
                paddingHorizontal: wp('5%'),
              }}
              data={this.state.hints}
              keyExtractor={(item, index) => index + ''}
              extraData={this.state}
              numColumns={2}
              renderItem={this.renderHintColumn}
              // onEndReached={this.loadMore}
              // onEndReachedThreshold={0.1}
            />
          </React.Fragment>
        ) : (
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              height: '60%',
            }}>
            <Text
              style={{
                color: AppConstant.Colors.black,
                fontFamily: AppConstant.Fonts.bold,
                fontSize: wp('5.5%'),
              }}>
              Remember,
            </Text>
            <Text
              style={{
                color: AppConstant.Colors.black,
                fontFamily: AppConstant.Fonts.bold,
                fontSize: wp('5.5%'),
              }}>
              Record, Relax!
            </Text>
            <Text
              style={{
                color: AppConstant.Colors.black,
                fontFamily: AppConstant.Fonts.normal,
                fontSize: wp('3.75%'),
                marginTop: 20,
              }}>
              Add gifts you'd love to your hints!
            </Text>
            <Text
              style={{
                color: AppConstant.Colors.black,
                fontFamily: AppConstant.Fonts.normal,
                fontSize: wp('3.75%'),
                marginTop: 5,
              }}>
              Tap the lightbulb below to get started
            </Text>
          </View>
        )}
      </View>
    );
  };

  RenderAbout = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        {_.size(this.props.user.preferences) ? (
          <PreferencesList preferences={this.props.user.preferences}/>
        ) : (
          <View
            style={{
              height: '70%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{marginTop: hp('3%'), alignItems: 'center'}}>
              <Text
                style={{
                  color: AppConstant.Colors.black,
                  fontFamily: AppConstant.Fonts.bold,
                  fontSize: wp('5.5%'),
                }}>
                Customize your
              </Text>
              <Text
                style={{
                  color: AppConstant.Colors.black,
                  fontFamily: AppConstant.Fonts.bold,
                  fontSize: wp('5.5%'),
                }}>
                profile!
              </Text>
            </View>
            <View style={{marginTop: hp('3%'), alignItems: 'center'}}>
              <Text
                style={{
                  color: AppConstant.Colors.black,
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('3.75%'),
                }}>
                Help your friends and family looking
              </Text>
              <Text
                style={{
                  color: AppConstant.Colors.black,
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('3.75%'),
                }}>
                to get you a gift you'll love
              </Text>
            </View>

            <CustomButton
              onClick={() => this.props.navigation.navigate('addPreferences')}
              title="Lets do it"
              titleStyle={styles.buttonText}
              containerStyle={[styles.submitButton]}
            />
          </View>
        )}
      </View>
    );
  };

  render() {
    return this.props.user.id ? (
      <View style={{flex: 1}}>
        <View
          style={{
            width: wp('100%'),
            maxHeight: hp('20%'),
            flexDirection: 'row',
            marginTop: hp('1'),
          }}>
          <View
            style={{
              width: wp('20%'),
              marginHorizontal: wp('5%'),
            }}>
            <FastImage
              style={{
                width: wp('20%'),
                height: wp('20%'),
                borderRadius: wp('10%'),
              }}
              source={
                this.props.user.image
                  ? {uri: this.props.user.image}
                  : AppConstant.Images.placeholderAvatar
              }
            />
          </View>

          <View style={{width: wp('55%'), marginTop: hp('1')}}>
            <Text
              adjustsFontSizeToFit={true}
              style={{
                fontFamily: AppConstant.Fonts.bold,
                fontSize: wp('5.5%'),
                color: AppConstant.Colors.black,
              }}>
              {`${this.props.user.first_name} ${this.props.user.last_name}` ||
              'NA'}
            </Text>
            <View style={{flexDirection: 'row', marginTop: hp('1')}}>
              <Image source={AppConstant.Images.cakeIcon}/>
              <Text
                style={{
                  marginLeft: wp('3'),
                  marginTop: 2,
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('3.75%'),
                  color: AppConstant.Colors.dobText,
                }}>
                {`${this.state.months[this.props.user.dob.month - 1]} ${
                  this.props.user.dob.day
                }${
                  this.props.user.is_birth_year
                    ? ', ' + this.props.user.dob.year
                    : ''
                }` || 'NA'}
              </Text>
            </View>
          </View>

          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.navigate('editProfile')}>
            <View
              style={{
                width: wp('15%'),
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <View
                style={{
                  width: wp('8%'),
                  height: wp('8%'),
                  borderRadius: wp('7%'),
                  marginTop: hp('1%'),
                  backgroundColor: AppConstant.Colors.blue,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  source={AppConstant.Images.settingIcon}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {/* {this.renderHints()} */}
        <ScrollableTabView
          renderTabBar={props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {props.tabs.map((value, index) => {
                  return (
                    <TouchableWithoutFeedback
                      key={index + ''}
                      onPress={() => props.goToPage(index)}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderBottomColor:
                            index === props.activeTab
                              ? AppConstant.Colors.salmon
                              : AppConstant.Colors.bottomTabText,
                          borderBottomWidth: 2,
                          height: 50,
                        }}>
                        <Text
                          style={{
                            fontSize: wp('3.75%'),
                            fontFamily:
                              index === props.activeTab
                                ? AppConstant.Fonts.medium
                                : AppConstant.Fonts.regular,
                          }}>
                          {' '}
                          {value}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            );
          }}>
          <this.RenderHints tabLabel="My Hints"/>
          <this.RenderAbout tabLabel="About Me"/>
        </ScrollableTabView>

        <HintDetailModal
          hint={this.state.selectedHint}
          submitHandler={() => {
            this.showPurchaseModel();
          }}
          closeModal={() => this.closeModal('showHintDetailModal')}
          isVisible={this.state.showHintDetailModal}
        />
        <PurchaseModal
          buyForSelf={this.state.buyForSelf}
          refreshHints={() => this.getHints(this.props.user.id)}
          user={this.props.user}
          hint={this.state.selectedHint}
          closeModal={() => this.closeModal('showPurchaseModal')}
          isVisible={this.state.showPurchaseModal}
        />
        <NotificationsModal currentTab="MY HINTS"/>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: AppConstant.Colors.blue,
    marginTop: hp('4%'),
  },
  buttonText: {
    fontFamily: AppConstant.Fonts.medium,
    // fontSize: 16
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: AppConstant.Colors.hintOverlay,
    opacity: 0.92,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Mapping redux state to props
const mapSateToProps = state => ({
  user: state.onboard.user,
  celebrations: state.onboard.celebrations,
  cards: state.users.cards,
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
  toggleNotification: () => dispatch(Actions.toggleNotification(true)),
});

export default connect(mapSateToProps, mapDispatchToProps)(Profile);
