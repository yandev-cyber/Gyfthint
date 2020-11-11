import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import FastImage from 'react-native-fast-image';

import {InputField, Loader, BackButton, CustomButton, NotificationsModal} from '../../components';

import * as AppConstant from '../../constants';

import * as Common from '../../common';

import * as Actions from '../../redux/actions';

class UserNetwork extends Component {
  state = {
    showLoader: false,
    keyword: '',
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
  };

  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <BackButton
        goBack={() => navigation.navigate(navigation.getParam('activeTab'))}
      />
    ),
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
    this.props.navigation.setParams({
      openModal: this.props.toggleNotification,
      newNotification: this.props.user.has_new_notification,
      activeTab: this.props.activeTab,
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

    if (prevProps.activeTab !== this.props.activeTab) {
      this.props.navigation.setParams({
        activeTab: this.props.activeTab,
      });
    }
  }

  loadMore = () => {
    if (this.props.hasMore) {
      let cursor = this.props.users[this.props.users.length - 1];
      console.log(cursor);
      this.props.getAllUsers(
        cursor,
        this.state.keyword.trim().length > 0 ? this.state.keyword : null,
      );
    }
  };

  searchHandler = value => {
    this.setState({keyword: value});
    if (value.trim().length > 0) {
      this.props.getAllUsers(null, value.trim().toLowerCase());
    } else {
      setTimeout(() => {
        this.props.getAllUsers();
      }, 500);
    }
  };

  renderUser = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() =>
        this.props.navigation.navigate('user-detail', {user: item})
      }
      key={item.id}>
      <View
        style={{
          height: hp('10%'),
          paddingHorizontal: wp('5%'),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FastImage
          style={{
            width: wp('12%'),
            height: wp('12%'),
            borderRadius: wp('6%'),
          }}
          source={
            item.image
              ? {uri: item.image}
              : AppConstant.Images.placeholderAvatar
          }
        />
        <View style={{flex: 4, marginLeft: wp('5%')}}>
          <Text
            style={{
              fontSize: wp('4.25%'),
              fontFamily: AppConstant.Fonts.medium,
              color: AppConstant.Colors.black,
            }}>{`${item.first_name} ${item.last_name}`}</Text>
        </View>
        <View
          style={{
            flex: 1,
            marginLeft: wp('5%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: wp('3%'),
              fontFamily: AppConstant.Fonts.regular,
              color: AppConstant.Colors.monthText,
            }}>
            {this.state.months[item.dob.month - 1].toUpperCase()}
          </Text>
          <Text
            style={{
              fontSize: wp('6%'),
              fontFamily: AppConstant.Fonts.medium,
              color: AppConstant.Colors.black,
            }}>
            {item.dob.day < 10 ? `0${item.dob.day}` : item.dob.day}
          </Text>
        </View>
        <View
          style={{
            flex: 0.5,
            marginTop: hp('2%'),
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <Image source={AppConstant.Images.cakeIconGrey}/>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <NavigationEvents
          onWillBlur={() => {
            this.setState({
              keyword: '',
            });
            this.props.getAllUsers();
          }}
        />

        <View
          style={{
            flex: 0.2,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            paddingHorizontal: wp('10%'),
          }}>
          <Text
            style={{
              fontFamily: AppConstant.Fonts.bold,
              fontSize: wp('4.5%'),
              color: AppConstant.Colors.black,
              marginVertical: 15,
            }}>
            My Family and Friends
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                justifyContent: 'center',
                borderBottomWidth: 1,
                borderColor: AppConstant.Colors.separator,
              }}>
              <Image source={AppConstant.Images.searchIconGrey}/>
            </View>
            <InputField
              onChangeText={value => this.searchHandler(value)}
              value={this.state.keyword}
              placeholder="search"
              keyboardType="ascii-capable"
              style={{
                width: '100%',
                paddingLeft: wp('2%'),
                color: AppConstant.Colors.orText,
                fontFamily: AppConstant.Fonts.light,
                fontSize: wp('3.5%'),
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 0.9,
            marginTop: hp('2%'),
            justifyContent: 'center',
          }}>
          {this.props.users.length > 0 ? (
            <FlatList
              bounces={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{paddingHorizontal: wp('5%')}}
              data={this.props.users}
              keyExtractor={item => item.id}
              extraData={this.state}
              renderItem={this.renderUser}
              onEndReached={this.loadMore}
              onEndReachedThreshold={0.1}
              // onRefresh={() => { this.props.getAllUsers(); this.props.toggleHasMore(true) }}
              // refreshing={false}
            />
          ) : (
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
              }}>
              {this.state.showLoader ? (
                <Loader style={{flex: 1, justifyContent: 'center'}}/>
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: wp('4%'),
                    fontFamily: AppConstant.Fonts.normal,
                    color: AppConstant.Colors.black,
                  }}>
                  No User found
                </Text>
              )}
            </ScrollView>
          )}
        </View>
        <View
          style={{
            flex: 0.3,
            justifyContent: 'center',
            marginHorizontal: wp('20%'),
            paddingBottom: hp('3%'),
          }}>
          <CustomButton
            onClick={() => Common.Helper.socialShare()}
            title="Invite to GyftHint"
            titleStyle={{textAlign: 'center'}}
            containerStyle={{
              backgroundColor: AppConstant.Colors.salmon,
              paddingHorizontal: 0,
            }}
          />
        </View>
        <NotificationsModal currentTab="MY NETWORK"/>
      </View>
    );
  }
}

// Mapping redux state to props
const mapStateToProps = state => ({
  user: state.onboard.user,
  users: state.network.networkUsers,
  hasMore: state.network.hasMore,
  activeTab: state.common.activeTab,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  getAllUsers: (cursor, keyword) =>
    dispatch(Actions.getAllNetworkUsers(cursor, keyword)),
  toggleHasMore: value => dispatch(Actions.toggleNetworkUsersHasMore(value)),
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
  toggleNotification: () => dispatch(Actions.toggleNotification(true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserNetwork);
