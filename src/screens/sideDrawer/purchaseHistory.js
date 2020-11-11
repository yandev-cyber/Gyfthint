import React, {Component} from 'react';
import {View, Text, FlatList} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import Image from 'react-native-fast-image';

import {BackButton} from '../../components';

// Services
import * as Services from '../../services';

// Redux Actions
import * as Actions from '../../redux/actions';

// App Common functions
import * as Common from '../../common';

// App Constants
import * as AppConstant from '../../constants';

class PurchaseHistory extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: (
      <Text
        style={{
          color: AppConstant.Colors.black,
          fontSize: wp('5%'),
          fontFamily: AppConstant.Fonts.medium,
        }}>
        Purchase History
      </Text>
    ),
    headerLeft: (
      <BackButton
        goBack={() => navigation.navigate(navigation.getParam('activeTab'))}
      />
    ),
  });

  state = {
    orders: [],
  };

  componentDidMount() {
    this.mounted = true;
    this.getOrders(this.props.user.id).then(r => console.log(r));
    this.props.navigation.setParams({
      activeTab: this.props.activeTab,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeTab !== this.props.activeTab) {
      this.props.navigation.setParams({
        activeTab: this.props.activeTab,
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  getOrders = async (userId, cursor) => {
    this.props.toggleLoader(true);
    const orders = await Services.OrderService.getAll(userId, cursor);
    if (this.mounted) {
      this.setState({orders: orders});
    }
    this.props.toggleLoader(false);
  };

  getStatus = statusType => {
    let status;
    switch (statusType) {
      case AppConstant.Status.order.PURCHASED:
        status = 'Purchased';
        break;
      case AppConstant.Status.order.SHIPPED:
        status = 'Shipped';
        break;
      case AppConstant.Status.order.ON_HOLD:
        status = 'On hold';
        break;
      case AppConstant.Status.order.CANCELED:
        status = 'Cancelled';
        break;
      default:
        status = '';
        break;
    }
    return status;
  };

  renderOrderRow = ({item}) => (
    <View
      style={{
        height: hp('10%'),
        width: wp('90%'),
        marginVertical: hp('0.5%'),
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <View removeClippedSubviews={false} style={{width: wp('15%')}}>
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              resizeMode="cover"
              style={{height: hp('8%'), width: wp('15%')}}
              source={
                item.hint.image
                  ? {uri: item.hint.image}
                  : AppConstant.Images.productPlaceHolder
              }
            />
            {/* <AutoHeightImage
                            width={wp('15%')}
                            fallbackSource={AppConstant.Images.productPlaceHolder}
                            source={item.hint.image ? { uri: item.hint.image } : AppConstant.Images.productPlaceHolder}
                        /> */}
          </View>
        </View>
        <View
          style={{
            width: wp('40%'),
            justifyContent: 'space-evenly',
            paddingLeft: wp('5%'),
          }}>
          <Text
            style={{
              color: AppConstant.Colors.black,
              fontFamily: AppConstant.Fonts.medium,
              fontSize: wp('4%'),
            }}>
            {item.hint.name}
          </Text>
          <Text
            style={{
              color: AppConstant.Colors.black,
              fontFamily: AppConstant.Fonts.medium,
              fontSize: wp('3.5%'),
            }}>{`For ${item.purchased_for.first_name}`}</Text>
          <Text
            style={{
              color:
                AppConstant.Colors[
                  item.status ===
                  (AppConstant.Status.order.PURCHASED ||
                    AppConstant.Status.order.SHIPPED)
                    ? 'titlePlaceholder'
                    : 'salmon'
                  ],
              fontFamily: AppConstant.Fonts.regular,
              fontSize: wp('3.25%'),
            }}>
            {this.getStatus(item.status)}
          </Text>
        </View>
        <View
          style={{
            width: wp('35%'),
            alignItems: 'flex-end',
            justifyContent: 'space-evenly',
          }}>
          <Text
            style={{
              color: AppConstant.Colors.black,
              fontFamily: AppConstant.Fonts.medium,
              fontSize: wp('3%'),
            }}>
            Purchased
          </Text>
          <Text
            style={{
              color: AppConstant.Colors.black,
              fontFamily: AppConstant.Fonts.medium,
              fontSize: wp('3%'),
            }}>
            {Common.Helper.getFormattedDate(item.created_at)}
          </Text>
          <Text
            style={{
              color: AppConstant.Colors.black,
              fontFamily: AppConstant.Fonts.medium,
              fontSize: wp('5.5%'),
            }}>{`$${(
            item.hint.price +
            item.hint.shipping_and_handling +
            item.hint.sales_tax
          ).toFixed(2)}`}</Text>
        </View>
      </View>
    </View>
  );

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <NavigationEvents
          onWillFocus={() => this.getOrders(this.props.user.id)}
        />

        {this.state.orders.length > 0 ? (
          <FlatList
            contentContainerStyle={{
              alignItems: 'center',
              marginTop: hp('3%'),
              paddingBottom: 20,
              width: wp('100%'),
            }}
            bounces={false}
            data={this.state.orders}
            keyExtractor={(item, index) => index + ''}
            extraData={this.state}
            renderItem={this.renderOrderRow}
            onEndReached={this.loadMore}
            onEndReachedThreshold={0.1}
          />
        ) : (
          <Text
            style={{
              fontSize: wp('4%'),
              fontFamily: AppConstant.Fonts.normal,
              color: AppConstant.Colors.black,
            }}>
            No purchases yet!
          </Text>
        )}
      </View>
    );
  }
}

// Mapping redux state to props
const mapSateToProps = state => ({
  user: state.onboard.user,
  activeTab: state.common.activeTab,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
});

export default connect(mapSateToProps, mapDispatchToProps)(PurchaseHistory);
