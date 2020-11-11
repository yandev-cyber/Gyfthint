import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';

import {CustomModal} from '../components';

import * as AppConstant from '../constants';

import * as Services from '../services';

import * as Actions from '../redux/actions';

export class NotificationsModal extends Component {
  state = {
    disabled: false,
  };

  rejectRequest = async notificationId => {
    this.setState({disabled: true});
    if (!this.state.disabled) {
      await Services.NotificationService.remove(notificationId);
      this.setState({disabled: false});
    }
  };

  acceptRequest = async notification => {
    this.setState({disabled: true});
    if (!this.state.disabled) {
      try {
        this.props.toggleLoader(true);
        await Services.NetworkService.add(notification);
        await Services.NotificationService.add(
          {...notification.receiver, id: notification.receiver.user_id},
          {...notification.sender, id: notification.sender.user_id},
          AppConstant.Status.notification.ACKNOWLEDGE,
        );
        await Services.NotificationService.remove(notification.id);
        this.setState({disabled: false});
        Services.AnalyticsService.logEvent(
          AppConstant.AnalyticsEvents.REQUESTS_ACCEPTS,
        );
        this.props.toggleLoader(false);
      } catch (error) {
        console.log(error);
        this.props.toggleLoader(false);
      }
    }
  };

  renderRow = ({item}) => (
    <View
      style={{
        flex: 1,
        maxHeight: hp('10%'),
        marginVertical: hp('1%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <FastImage
        style={{width: wp('10%'), height: wp('10%'), borderRadius: wp('5%')}}
        source={
          item.sender.image
            ? {uri: item.sender.image}
            : AppConstant.Images.placeholderAvatar
        }
      />

      {item.type === AppConstant.Status.notification.REQUEST && (
        <View
          style={{
            width: '50%',
            justifyContent: 'center',
            paddingLeft: wp('3%'),
          }}>
          <Text
            style={{
              fontSize: wp('3.5%'),
              fontFamily: AppConstant.Fonts.medium,
              color: AppConstant.Colors.black,
            }}>{`${item.sender.first_name} ${item.sender.last_name}`}</Text>
          <Text
            style={{
              fontSize: wp('3%'),
              marginTop: 5,
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            Wants to connect
          </Text>
        </View>
      )}
      {item.type === AppConstant.Status.notification.ACKNOWLEDGE && (
        <View
          style={{
            width: '90%',
            justifyContent: 'center',
            paddingLeft: wp('3%'),
          }}>
          <Text
            style={{
              fontSize: wp('3.5%'),
              fontFamily: AppConstant.Fonts.medium,
              color: AppConstant.Colors.black,
            }}>{`${item.sender.first_name} ${item.sender.last_name} has accepted your request`}</Text>
        </View>
      )}

      {item.type === AppConstant.Status.notification.REQUEST && (
        <React.Fragment>
          <TouchableWithoutFeedback onPress={() => this.acceptRequest(item)}>
            <Image source={AppConstant.Images.acceptBtn}/>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.rejectRequest(item.id)}>
            <Image source={AppConstant.Images.rejectBtn}/>
          </TouchableWithoutFeedback>
        </React.Fragment>
      )}
    </View>
  );

  render() {
    return (
      <CustomModal
        onBackdropPress={() => {
          this.props.toggleNotification();
        }}
        isVisible={
          this.props.isVisible && this.props.activeTab === this.props.currentTab
        }>
        <View
          style={{
            minHeight: hp('30%'),
            elevation: this.props.isVisible ? 5 : 0,
            marginHorizontal: wp('10%'),
            borderRadius: 20,
            backgroundColor: AppConstant.Colors.white,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: AppConstant.Colors.black,
            shadowOffset: {height: 0.1, width: 0.0},
            shadowOpacity: 0.5,
            shadowRadius: 5,
          }}>
          <View
            style={{
              flex: 0.2,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.toggleNotification()}>
              <View
                style={{
                  paddingLeft: wp('1%'),
                  width: '10%',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                <Image source={AppConstant.Images.drawerCloseIcon}/>
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                width: '80%',
                alignItems: 'flex-start',
                paddingLeft: wp('5%'),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.bold,
                  color: AppConstant.Colors.black,
                  fontSize: wp('4%'),
                }}>
                Add Family and Friends
              </Text>
            </View>
          </View>
          <View style={{flex: 0.8, justifyContent: 'center'}}>
            {this.props.notifications.length > 0 ? (
              <FlatList
                contentContainerStyle={{paddingHorizontal: wp('5%')}}
                data={this.props.notifications}
                keyExtractor={item => item.id}
                extraData={this.props.notifications}
                renderItem={this.renderRow}
              />
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: wp('4%'),
                  fontFamily: AppConstant.Fonts.normal,
                  color: AppConstant.Colors.black,
                }}>
                No new friend request!!! You're now connected with your friends
              </Text>
            )}
          </View>
        </View>
      </CustomModal>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.notification.notifications,
  isVisible: state.notification.showNotificationModal,
  activeTab: state.common.activeTab,
});

const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
  toggleNotification: () => dispatch(Actions.toggleNotification(false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsModal);
