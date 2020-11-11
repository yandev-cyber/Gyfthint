import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';

import FastImage from 'react-native-fast-image';

import {InputField, BackButton, Loader} from '../../components';

import * as AppConstant from '../../constants';

import * as Actions from '../../redux/actions';

class UserList extends Component {
  state = {
    keyword: '',
    showLoader: false,
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
    headerLeft: <BackButton goBack={() => navigation.goBack()}/>,
    // headerLeft: (<BackButton goBack={() => navigation.navigate('MY DASHBOARD')} />)
  });

  loadMore = () => {
    if (this.props.hasMore) {
      let cursor = this.props.users[this.props.users.length - 1];
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
          marginBottom: hp('2%'),
          paddingHorizontal: wp('5%'),
          borderRadius: 6,
          elevation: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          shadowColor: AppConstant.Colors.black,
          shadowOffset: {height: 0.1, width: 0.0},
          shadowOpacity: 0.2,
          shadowRadius: 6,
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
      <View style={styles.conatiner}>
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
          }}>
          <Text
            style={{
              fontFamily: AppConstant.Fonts.bold,
              fontSize: wp('4.5%'),
              color: AppConstant.Colors.black,
              marginVertical: 10,
            }}>
            Find Family and Friends
          </Text>
          <View style={{flexDirection: 'row', paddingHorizontal: wp('7%')}}>
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
        <View style={{flex: 0.8, marginVertical: 10, justifyContent: 'center'}}>
          {this.props.users.length > 0 ? (
            <FlatList
              contentContainerStyle={{
                paddingHorizontal: wp('5%'),
                paddingVertical: hp('2%'),
              }}
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
              contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
});

// Mapping redux state to props
const mapStateToProps = state => ({
  users: state.users.users,
  hasMore: state.users.hasMore,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  getAllUsers: (cursor, keyword) =>
    dispatch(Actions.getAllUsers(cursor, keyword)),
  updateUsers: users => dispatch(Actions.updateUsers(users)),
  toggleHasMore: value => dispatch(Actions.toggleHasMore(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
