import React, {PureComponent} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Image,
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
  CustomPicker,
  HintDetailModal,
  HintCard,
  PurchaseModal,
  UserSettingModal,
  PreferencesList,
} from '../../components';

// Services
import * as Services from '../../services';

// Redux Actions
import * as Actions from '../../redux/actions';

// App Common functions
import * as Common from '../../common';

// App Constants
import * as AppConstant from '../../constants';

export class UserDetail extends PureComponent {
  constructor(props) {
    super(props);

    Services.AnalyticsService.logEvent(
      AppConstant.AnalyticsEvents.USER_DETAILS,
    );
  }

  state = {
    profileAction: 1,
    disabled: false,
    selectedAddress: 1,
    selectedHint: {
      name: 'Ink cartridges',
      image: '',
      price: 29,
      feedback: '',
      shipping_and_handling: 0,
      sales_tax: 0,
      size_model: '932',
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
    showSettingModal: false,
    hasMore: true,
    buyForSelf: false,
    user: {dob: {}},
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

  async componentDidMount() {
    this.unsubscribe = [];
    this.mounted = true;
    this.props.toggleLoader(true);
    let user = this.props.navigation.getParam('user');

    if (user.hasOwnProperty('friend_id')) {
      user = await Services.UserService.get(user.friend_id);
    }

    this.unsubscribe[0] = Firebase.firestore()
      .collection('notifications')
      .where('sender.user_id', '==', this.props.user.id)
      .where('receiver.user_id', '==', user.id)
      .where('type', '==', AppConstant.Status.notification.REQUEST)
      .onSnapshot(data => {
        if (data.docChanges.length > 0 && this.mounted) {
          data.docChanges.forEach(item => {
            if (item.type === 'removed') {
              this.setState({
                profileAction: 1,
                disabled: false,
              });
            } else {
              this.setState({profileAction: 2});
            }
          });
        }
      });

    this.unsubscribe[1] = Firebase.firestore()
      .collection('notifications')
      .where('sender.user_id', '==', user.id)
      .where('receiver.user_id', '==', this.props.user.id)
      .where('type', '==', AppConstant.Status.notification.REQUEST)
      .onSnapshot(data => {
        if (data.docChanges.length > 0 && this.mounted) {
          data.docChanges.forEach(item => {
            if (item.type === 'removed') {
              this.setState({
                profileAction: 1,
                disabled: false,
              });
            } else {
              this.setState({profileAction: 2});
            }
          });
        }
      });

    this.unsubscribe[2] = Firebase.firestore()
      .collection('hints')
      .where('user_id', '==', user.id)
      .orderBy(this.state.orderByValue.key, this.state.orderByValue.direction)
      .limit(30)
      .onSnapshot(data => {
        let hints = [];
        data.forEach(doc => {
          let hint = doc.data();
          if (hint.status < AppConstant.Status.hint.DECLINED) {
            hints.push(hint);
          }
        });
        this.listHints(hints, true);
      });

    this.unsubscribe[3] = Firebase.firestore()
      .collection('users')
      .doc(user.id)
      .onSnapshot(
        {includeMetadataChanges: true},
        response => {
          this.setState({user: response.data()});
          if (
            _.find(response.data().blocked_users || [], {
              block_by: this.state.user.id,
              block_to: this.props.user.id,
            })
          ) {
            this.setState({
              showHintDetailModal: false,
              showPurchaseModal: false,
              showSettingModal: false,
            });
            setTimeout(() => {
              this.props.navigation.goBack();
            }, 2000);
          }
        },
        err => {
          console.log(err);
        },
      );

    setTimeout(() => {
      this.props.toggleLoader(false);
    }, 1000);
  }

  componentWillUnmount() {
    this.mounted = false;
    for (let i = 0; i < this.unsubscribe.length; i++) {
      this.unsubscribe[i]();
    }
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
      if (this.mounted) {
        this.setState({
          hints: updatedHints,
          originalHints: newHints,
          hasMore: hints.length >= 30,
        });
      }
    }
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
        this.state.user.id,
        this.state.originalHints[this.state.originalHints.length - 1],
        this.state.orderByValue,
      ).then(r => console.log(r));
    }
  };

  removeNetworkUser = async () => {
    try {
      this.props.toggleLoader(true);
      await Services.NetworkService.remove(
        this.props.user.id,
        this.state.user.id,
      );
      this.props.toggleLoader(false);
      this.closeModal('showSettingModal');
    } catch (error) {
      console.log(error);
      this.props.toggleLoader(false);
    }
  };

  blockNetworkUser = async () => {
    try {
      this.props.toggleLoader(true);
      await Services.NetworkService.remove(
        this.props.user.id,
        this.state.user.id,
      );
      await Services.UserService.update(this.props.user.id, {
        blocked_users: [
          ...(this.props.user.blocked_users || []),
          {
            block_by: this.props.user.id,
            block_to: this.state.user.id,
          },
        ],
      });
      await Services.UserService.update(this.state.user.id, {
        blocked_users: [
          ...(this.state.user.blocked_users || []),
          {
            block_by: this.props.user.id,
            block_to: this.state.user.id,
          },
        ],
      });
      this.props.toggleLoader(false);
      this.closeModal('showSettingModal');
    } catch (error) {
      console.log(error);
      this.props.toggleLoader(false);
    }
  };

  unblockNetworkUser = async () => {
    try {
      this.props.toggleLoader(true);
      await Services.NetworkService.add({
        sender: {
          ...this.props.user,
          user_id: this.props.user.id,
        },
        receiver: {
          ...this.state.user,
          user_id: this.state.user.id,
        },
      });
      await Services.UserService.update(this.props.user.id, {
        blocked_users: _.filter(this.props.user.blocked_users || [], {
          block_by: !this.props.user.id,
          block_to: !this.state.user.id,
        }),
      });
      await Services.UserService.update(this.state.user.id, {
        blocked_users: _.filter(this.state.user.blocked_users || [], {
          block_by: !this.props.user.id,
          block_to: !this.state.user.id,
        }),
      });
      this.props.toggleLoader(false);
    } catch (error) {
      console.log(error);
      this.props.toggleLoader(false);
    }
  };

  showPurchaseModel(buyForSelf) {
    this.setState({
      buyForSelf,
    });
    this.closeModal('showHintDetailModal');
    setTimeout(
      () => {
        this.openModal('showPurchaseModal');
      },
      Common.Helper.isAndroid() ? 0 : 1000,
    );
  }

  sendRequest = () => {
    this.setState({disabled: true});
    if (!this.state.disabled) {
      Services.AnalyticsService.logEvent(
        AppConstant.AnalyticsEvents.NETWORK_REQUEST,
      );
      this.props.sendNotification(
        this.props.user,
        this.state.user,
        AppConstant.Status.notification.REQUEST,
      );
    }
  };

  addHintHandler = async () => {
    try {
      this.props.toggleLoader(true);
      await Services.HintService.add({
        ...this.state.selectedHint,
        user_id: this.props.user.id,
      });
      this.props.toggleLoader(false);
      Services.AlertService.showHintDetailModalAlert(
        'success',
        'Success',
        'Hint added successfully',
      );
    } catch (error) {
      console.log(error);
      this.props.toggleLoader(false);
      Services.AlertService.showHintDetailModalAlert(
        'error',
        'Failed',
        'Something went wrong',
      );
    }
  };

  renderHintColumn = ({item, index}) => {
    return (
      <View key={index + ''} style={{marginHorizontal: wp('2%')}}>
        {item.map(hint => (
          <HintCard
            key={hint.id}
            user={this.props.user}
            hint={hint}
            openModal={() => this.openModal('showHintDetailModal')}
            selectHint={selectedHint => this.setState({selectedHint})}
          />
        ))}
      </View>
    );
  };

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
                  this.getHints(this.state.user.id, null, value, true).then(r =>
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
              onEndReached={this.loadMore}
              onEndReachedThreshold={0.1}
            />
          </React.Fragment>
        ) : (
          <View style={{alignSelf: 'center', alignItems: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: wp('4%'),
                fontFamily: AppConstant.Fonts.normal,
                color: AppConstant.Colors.black,
              }}>
              Nothing yet. Come back soon
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
        {_.size(this.state.user.preferences) ? (
          <PreferencesList
            preferences={this.state.user.preferences}
            userName={this.state.user.first_name}
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
                color: AppConstant.Colors.black,
                fontFamily: AppConstant.Fonts.normal,
                fontSize: wp('4%'),
              }}>
              No preferences listed yet!
            </Text>
          </View>
        )}
      </View>
    );
  };

  render() {
    const isBlocked = _.find(this.props.user.blocked_users || [], [
        'block_to',
        this.state.user.id,
      ]),
      isPrivate = Boolean(this.state.user.is_private),
      showHintsAndPreferences =
        !isPrivate ||
        (isPrivate &&
          _.findIndex(this.props.networkUsers, {
            friend_id: this.state.user.id,
            user_id: this.props.user.id,
          }) > -1);

    return this.state.user.id ? (
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
            {this.state.user.id && (
              <FastImage
                style={{
                  width: wp('20%'),
                  height: wp('20%'),
                  borderRadius: wp('10%'),
                }}
                source={
                  this.state.user.image
                    ? {uri: this.state.user.image}
                    : AppConstant.Images.placeholderAvatar
                }
              />
            )}
          </View>
          <View
            style={{
              width: wp('45%'),
              marginTop: hp('1'),
              paddingRight: wp('5%'),
            }}>
            <Text
              adjustsFontSizeToFit={true}
              style={{
                fontFamily: AppConstant.Fonts.bold,
                fontSize: wp('5.5%'),
                color: AppConstant.Colors.black,
              }}>
              {`${this.state.user.first_name} ${this.state.user.last_name}` ||
              'NA'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: hp('1'),
              }}>
              <Image source={AppConstant.Images.cakeIcon}/>
              <Text
                style={{
                  marginLeft: wp('3'),
                  marginTop: 2,
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('3.75%'),
                  color: AppConstant.Colors.dobText,
                }}>
                {`${this.state.months[this.state.user.dob.month - 1]} ${
                  this.state.user.dob.day
                }${
                  this.state.user.is_birth_year
                    ? ', ' + this.state.user.dob.year
                    : ''
                }` || 'NA'}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: wp('15%'),
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            {_.find(this.props.user.blocked_users || [], [
              'block_to',
              this.state.user.id,
            ]) ? (
              <TouchableWithoutFeedback onPress={this.unblockNetworkUser}>
                <View
                  style={{
                    width: wp('25%'),
                    height: wp('7%'),
                    borderRadius: wp('3.5%'),
                    marginTop: hp('1%'),
                    backgroundColor: AppConstant.Colors.salmon,
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 5,
                    shadowColor: AppConstant.Colors.black,
                    shadowOffset: {height: 0.1, width: 0.0},
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                  }}>
                  <Text
                    style={{
                      fontFamily: AppConstant.Fonts.bold,
                      fontSize: wp('3%'),
                      color: AppConstant.Colors.white,
                    }}>
                    Unblock
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <React.Fragment>
                {this.state.profileAction === 1 &&
                _.findIndex(this.props.networkUsers, {
                  friend_id: this.state.user.id,
                  user_id: this.props.user.id,
                }) === -1 && (
                  <TouchableWithoutFeedback
                    onPress={() => this.sendRequest()}>
                    <View
                      style={{
                        width: wp('15%'),
                        height: wp('7%'),
                        borderRadius: wp('3.5%'),
                        marginTop: hp('1%'),
                        backgroundColor: AppConstant.Colors.blue,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 5,
                        shadowColor: AppConstant.Colors.black,
                        shadowOffset: {
                          height: 0.1,
                          width: 0.0,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 6,
                      }}>
                      <Text
                        style={{
                          fontFamily: AppConstant.Fonts.bold,
                          fontSize: wp('3%'),
                          color: AppConstant.Colors.white,
                        }}>
                        Add
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                {this.state.profileAction === 2 &&
                _.findIndex(this.props.networkUsers, {
                  friend_id: this.state.user.id,
                  user_id: this.props.user.id,
                }) === -1 && (
                  <View
                    style={{
                      width: wp('25%'),
                      height: wp('7%'),
                      borderRadius: wp('3.5%'),
                      marginTop: hp('1%'),
                      backgroundColor: AppConstant.Colors.salmon,
                      justifyContent: 'center',
                      alignItems: 'center',
                      elevation: 5,
                      shadowColor: AppConstant.Colors.black,
                      shadowOffset: {height: 0.1, width: 0.0},
                      shadowOpacity: 0.1,
                      shadowRadius: 6,
                    }}>
                    <Text
                      style={{
                        fontFamily: AppConstant.Fonts.bold,
                        fontSize: wp('3%'),
                        color: AppConstant.Colors.white,
                      }}>
                      Requested
                    </Text>
                  </View>
                )}
                {_.findIndex(this.props.networkUsers, {
                  friend_id: this.state.user.id,
                  user_id: this.props.user.id,
                }) > -1 && (
                  <TouchableWithoutFeedback
                    onPress={() => this.openModal('showSettingModal')}>
                    <View
                      style={{
                        width: wp('25%'),
                        height: wp('7%'),
                        borderRadius: wp('3.5%'),
                        marginTop: hp('1%'),
                        backgroundColor: AppConstant.Colors.lightGreen,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 5,
                        shadowColor: AppConstant.Colors.black,
                        shadowOffset: {height: 0.1, width: 0.0},
                        shadowOpacity: 0.1,
                        shadowRadius: 6,
                      }}>
                      <Text
                        style={{
                          fontFamily: AppConstant.Fonts.bold,
                          fontSize: wp('3%'),
                          color: AppConstant.Colors.white,
                        }}>
                        Connected
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </React.Fragment>
            )}
          </View>
        </View>
        {!isBlocked && showHintsAndPreferences ? (
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
            <this.RenderHints
              tabLabel={`${this.state.user.first_name}'s Hints`}
            />
            <this.RenderAbout
              tabLabel={`About ${this.state.user.first_name}`}
            />
          </ScrollableTabView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: wp('5%'),
            }}>
            {!isBlocked && (
              <Text
                style={{
                  color: AppConstant.Colors.black,
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('4%'),
                  textAlign: 'center',
                }}>
                {`Add ${this.state.user.first_name} ${this.state.user.last_name} to your network to see their Hints & Preferences.`}
              </Text>
            )}
          </View>
        )}

        <HintDetailModal
          otherUser={this.state.user}
          addHint={() => this.addHintHandler()}
          hint={this.state.selectedHint}
          submitHandler={buyForSelf => {
            this.showPurchaseModel(buyForSelf);
          }}
          closeModal={() => this.closeModal('showHintDetailModal')}
          isVisible={this.state.showHintDetailModal}
        />
        <PurchaseModal
          navigation={this.props.navigation}
          otherUser={this.state.user}
          refreshHints={() => this.getHints(this.state.user.id)}
          user={this.props.user}
          hint={this.state.selectedHint}
          closeModal={() => this.closeModal('showPurchaseModal')}
          isVisible={this.state.showPurchaseModal}
          buyForSelf={this.state.buyForSelf}
        />
        <UserSettingModal
          isVisible={this.state.showSettingModal}
          closeModal={() => this.closeModal('showSettingModal')}
          user={this.state.user}
          remove={this.removeNetworkUser}
          block={this.blockNetworkUser}
        />
      </View>
    ) : null;
  }
}

// Mapping redux state to props
const mapSateToProps = state => ({
  user: state.onboard.user,
  notifications: state.notification.notifications,
  networkUsers: state.network.networkUsers,
  activeTab: state.common.activeTab,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  sendNotification: (sender, receiver, type) =>
    dispatch(Actions.sendNotification(sender, receiver, type)),
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
});

export default connect(mapSateToProps, mapDispatchToProps)(UserDetail);
