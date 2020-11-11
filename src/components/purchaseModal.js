import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import stripe from 'tipsi-stripe';
import {connect} from 'react-redux';
import _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SvgUri from 'react-native-svg-uri';

import {
  CustomModal,
  CustomButton,
  CheckBox,
  DropdownAlert,
} from '../components';

import * as AppConstant from '../constants';

import * as Services from '../services';

import * as Common from '../common';

import * as Actions from '../redux/actions';

const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

class PurchaseModal extends PureComponent {
  state = {
    applePayTapped: false,
    final_price: '',
    email: {
      value: '',
      touched: false,
      valid: false,
    },
    loading: false,
    allowed: false,
    complete: true,
    status: null,
    token: null,
    selectedCard: {},
    expiry: {
      year: {
        value: '',
        touched: false,
        valid: false,
      },
      month: {
        value: '',
        touched: false,
        valid: false,
      },
    },
    selectedAddress: '',
    buyForSelf: this.props.buyForSelf,
    order: {
      status: AppConstant.Status.order.PURCHASED,
      shipping_address: {
        line_1: '',
        line_2: '',
        city: '',
        state: '',
        zip: '',
      },
      is_gift_wrapped: false,
      hint: {
        image: '',
        name: '',
        id: '',
      },
      tracking_email: '',
      transaction_id: null,
      charge_id: null,
      payment_status: '',
      purchased_by: {
        first_name: '',
        id: '',
        email: '',
      },
      purchased_for: {
        first_name: '',
        id: '',
        email: '',
      },
    },
  };

  componentDidMount() {
    this.shouldUpdate = true;
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible) {
      let email = {
        value: '',
        touched: false,
        valid: false,
      };
      if (this.props.user.email && this.props.user.email.length > 0) {
        email.value = this.props.user.email;
        email.touched = true;
        email.valid = true;
      }
      if (this.shouldUpdate) {
        this.setState({
          final_price: (
            this.props.hint.price +
            this.props.hint.shipping_and_handling +
            this.props.hint.sales_tax
          ).toFixed(2),
          email: email,
          loading: false,
          allowed: false,
          complete: true,
          status: null,
          token: null,
          selectedCard: {},
          selectedAddress: '',
          buyForSelf: this.props.buyForSelf,
          order: {
            ...this.state.order,
            transaction_id: null,
            charge_id: null,
            tracking_email: email.value,
            shipping_address: {},
            hint: {
              id: this.props.hint.id,
              image: this.props.hint.image,
              url: this.props.hint.url,
              name: this.props.hint.name,
              price: this.props.hint.price,
              shipping_and_handling: this.props.hint.shipping_and_handling,
              sales_tax: this.props.hint.sales_tax,
            },
            purchased_by: {
              id: this.props.user.id,
              first_name: this.props.user.first_name,
              last_name: this.props.user.last_name,
              email: this.props.user.email,
            },
            purchased_for: this.state.buyForSelf
              ? {
                  id: this.props.user.id,
                  first_name: 'Myself',
                  last_name: '',
                  email: this.props.user.email,
                }
              : {
                  id: this.props.otherUser.id,
                  first_name: this.props.otherUser.first_name,
                  last_name: this.props.otherUser.last_name,
                  email: this.props.otherUser.email,
                },
          },
        });
      }
    }
  }

  addCard = async () => {
    let card = await Services.CardService.addCard();
    if (card) {
      this.props.saveCards(card);
    } else {
      Common.Alert.show("", 'Please add card details in payment information');
    }
  };

  selectAddress = addressType => {
    if (addressType === 2 && !this.props.user.shipping_address) {
      this.props.closeModal();
      this.props.navigation.navigate('address', {user: this.props.otherUser});
      return;
    }
    this.setState({
      selectedAddress: addressType,
      order: {
        ...this.state.order,
        shipping_address:
          addressType === 1
            ? this.props.otherUser.shipping_address
            : this.props.user.shipping_address,
        purchased_for: this.state.buyForSelf
          ? {
              id: this.props.user.id,
              first_name: 'Myself',
              email: this.props.user.email,
            }
          : {
              id: this.props.otherUser.id,
              first_name: this.props.otherUser.first_name,
              email: this.props.otherUser.email,
            },
      },
    });
  };

  submitHandler = async () => {
    try {
      this.shouldUpdate = false;
      if (this.state.token && this.state.selectedAddress) {
        if (this.state.email.touched && this.state.email.valid) {
          this.props.closeModal();
          this.props.toggleLoader(true);
          const payment = await Services.PaymentService.createCharge(
            this.state.final_price,
            this.state.token,
          );
          if (payment) {
            this.setState({
              selectedCard: {},
              order: {
                ...this.state.order,
                tracking_email: this.state.email.value,
                charge_id: payment.id,
                transaction_id: payment.balance_transaction,
                payment_status: payment.status,
              },
            });
            await Services.OrderService.add(this.state.order);
            if (!this.state.buyForSelf) {
              await Services.HintService.update(
                {status: AppConstant.Status.hint.PURCHASED},
                this.props.hint.id,
              );
            }
            if (!this.props.otherUser && this.state.buyForSelf) {
              await Services.HintService.remove(this.props.hint.id);
            }
          }
          this.props.toggleLoader(false);
          this.shouldUpdate = true;
          Services.AnalyticsService.logEvent(
            AppConstant.AnalyticsEvents.PURCHASED,
          );
          Services.AlertService.show(
            'success',
            'Success',
            `Payment processed!! ${
              this.props.otherUser && !this.state.buyForSelf
                ? this.props.otherUser.first_name + "'s"
                : 'your'
            } gift is on the way`,
          );
        } else {
          this.setState({
            email: {...this.state.email, touched: true},
          });
          this.shouldUpdate = true;
        }
      } else {
        Services.AlertService.showPurchaseModalAlert(
          'error',
          'Failed',
          this.state.token
            ? 'Please select shipping address'
            : 'Payment not done yet!',
        );
        this.shouldUpdate = true;
      }
    } catch (error) {
      console.log(error);
      this.props.toggleLoader(false);
      this.shouldUpdate = true;
      Services.AlertService.showPurchaseModalAlert(
        'error',
        'Failed',
        'Something went wrong',
      );
    }
  };

  checkBoxHandler = card => {
    this.setState(prevState => ({
      token: prevState.token === card.id ? null : card.id,
    }));
  };

  makePaymentRequest = () => {
    if (this.state.applePayTapped) {
      return;
    }
    this.setState({applePayTapped: true});
    if (this.state.order.charge_id && this.state.order.transaction_id) {
      console.log(this.state.token);
      this.setState({applePayTapped: false});
      Common.Alert.show('', 'Payment already processed');
    } else {
      if (Common.Helper.isAndroid()) {
        this.nativePaymentHandler().then(r => console.log(r));
      } else {
        this.handleApplePayPress().then(r => console.log(r));
      }
    }
  };

  handleApplePayPress = async () => {
    const allowed = await stripe.deviceSupportsNativePay();
    if (!allowed) {
      stripe.openNativePaySetup();
    } else {
      try {
        this.setState({
          loading: true,
          status: null,
          token: null,
        });

        const token = await stripe.paymentRequestWithNativePay(
          {
            // requiredBillingAddressFields: ['all'],
            // requiredShippingAddressFields: ['all'],
            shippingMethods: [
              {
                id: this.props.hint.id,
                label: 'gyfthint',
                detail: this.props.hint.name,
                amount: '0.00',
              },
            ],
          },
          [
            {
              label: this.props.hint.name,
              amount: this.state.final_price,
            },
          ],
        );

        this.setState({loading: false, token: token.tokenId});

        // const payment = await Services.PaymentService.createCharge(this.state.final_price, token.tokenId);
        // console.log(payment);
        // this.props.toggleLoader(false);
        // this.setState({
        //     selectedCard: {},
        //     order: {
        //         ...this.state.order,
        //         charge_id: payment.id,
        //         transaction_id: payment.balance_transaction
        //     }
        // });

        if (this.state.complete) {
          await stripe.completeNativePayRequest();
          Common.Alert.show("", 'Apple Pay payment completed');
          this.setState({applePayTapped: false});
        } else {
          await stripe.cancelNativePayRequest();
          Common.Alert.show("", 'Apple Pay payment cancelled');
          this.setState({applePayTapped: false});
        }
      } catch (error) {
        Common.Alert.show("", error.message);
        this.setState({loading: false, status: `Error: ${error.message}`});
        this.setState({applePayTapped: false});
      }
    }
  };

  nativePaymentHandler = async () => {
    const options = {
      total_price: this.state.final_price,
      //total_price: "01.00",
      currency_code: 'USD',
      shipping_address_required: false,
      billing_address_required: false,
      shipping_countries: ['US'],
      line_items: [
        {
          currency_code: 'USD',
          description: this.props.hint.name,
          total_price: '00.00',
          // total_price: this.state.final_price,
          unit_price: '00.00',
          // unit_price: this.state.final_price,
          quantity: '1',
        },
      ],
    };
    try {
      const token = await stripe.paymentRequestWithAndroidPay(options);
      console.log(token);
      // this.props.toggleLoader(true);
      // const payment = await Services.PaymentService.createCharge(this.state.final_price, token.tokenId);
      // console.log(payment);
      // this.props.toggleLoader(false);
      this.setState({
        token: token.tokenId,
        // selectedCard: {},
        // order: {
        //     ...this.state.order,
        //     charge_id: payment.id,
        //     transaction_id: payment.balance_transaction
        // }
      });
      this.setState({applePayTapped: false});
    } catch (error) {
      console.log(error);
      this.setState({applePayTapped: false});
      this.props.toggleLoader(false);
    }
  };

  render() {
    return (
      <CustomModal
        onBackdropPress={() => this.props.closeModal()}
        isVisible={this.props.isVisible}>
        <View style={{flex: 1, zIndex: 0, justifyContent: 'center'}}>
          <View
            style={{
              flex: 0.9,
              borderRadius: 20,
              marginHorizontal: wp('10%'),
              backgroundColor: AppConstant.Colors.white,
              elevation: this.props.isVisible ? 10 : 0,
              shadowColor: AppConstant.Colors.black,
              shadowOffset: {height: 0.1, width: 0.0},
              shadowOpacity: 0.5,
              shadowRadius: 6,
            }}>
            <View
              style={{
                maxHeight: 400,
                backgroundColor: AppConstant.Colors.salmon,
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingHorizontal: wp('4%'),
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}>
              <View
                style={{
                  justifyContent: 'space-evenly',
                  marginTop: hp('3%'),
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    marginLeft: wp('6%'),
                    width: '80%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: AppConstant.Fonts.medium,
                      color: AppConstant.Colors.white,
                      fontSize: wp('5%'),
                    }}>
                    {this.props.hint.name}
                  </Text>
                </View>
                <TouchableWithoutFeedback
                  onPress={() => this.props.closeModal()}>
                  <View
                    style={{
                      width: '10%',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}>
                    <Image source={AppConstant.Images.closeWhiteIcon} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp('2%'),
                }}>
                <View style={{width: '50%'}}>
                  <Text
                    style={{
                      textAlign: 'left',
                      color: AppConstant.Colors.white,
                      fontSize: wp('3.75%'),
                      fontFamily: AppConstant.Fonts.normal,
                    }}>
                    Price:
                  </Text>
                </View>

                <View style={{width: '50%', alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      textAlign: 'right',
                      color: AppConstant.Colors.white,
                      fontSize: wp('4%'),
                      fontFamily: AppConstant.Fonts.medium,
                    }}>{`$${this.props.hint.price.toFixed(2)}`}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp('1%'),
                }}>
                <View style={{width: '60%'}}>
                  <Text
                    style={{
                      textAlign: 'left',
                      color: AppConstant.Colors.white,
                      fontSize: wp('3.75%'),
                      fontFamily: AppConstant.Fonts.normal,
                    }}>
                    Shipping and Handling:
                  </Text>
                </View>

                <View style={{width: '40%', alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      textAlign: 'right',
                      color: AppConstant.Colors.white,
                      fontSize: wp('4%'),
                      fontFamily: AppConstant.Fonts.medium,
                    }}>{`$${this.props.hint.shipping_and_handling.toFixed(
                    2,
                  )}`}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp('1%'),
                }}>
                <View style={{width: '50%'}}>
                  <Text
                    style={{
                      textAlign: 'left',
                      color: AppConstant.Colors.white,
                      fontSize: wp('3.75%'),
                      fontFamily: AppConstant.Fonts.normal,
                    }}>
                    Sales Tax:
                  </Text>
                </View>

                <View style={{width: '50%', alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      textAlign: 'right',
                      color: AppConstant.Colors.white,
                      fontSize: wp('4%'),
                      fontFamily: AppConstant.Fonts.medium,
                    }}>{`$${this.props.hint.sales_tax.toFixed(2)}`}</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp('2%'),
                }}>
                <View
                  style={{
                    width: '50%',
                    justifyContent: 'flex-end',
                    marginBottom: 20,
                  }}>
                  <Text
                    style={{
                      textAlign: 'left',
                      color: AppConstant.Colors.white,
                      fontSize: wp('3.75%'),
                      fontFamily: AppConstant.Fonts.normal,
                    }}>
                    Final Price:
                  </Text>
                </View>

                <View
                  style={{
                    width: '50%',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    marginBottom: 20,
                  }}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={{
                      textAlign: 'right',
                      color: AppConstant.Colors.white,
                      fontSize: wp('6%'),
                      fontFamily: AppConstant.Fonts.medium,
                    }}>{`$${this.state.final_price}`}</Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
              }}>
              <KeyboardAwareScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled">
                <Text
                  style={{
                    color: AppConstant.Colors.black,
                    fontSize: wp('4.5%'),
                    fontFamily: AppConstant.Fonts.medium,
                    marginTop: hp('5%'),
                    marginLeft: wp('5%'),
                  }}>
                  Payment Method
                </Text>

                {this.props.cards.map(card => (
                  <View
                    key={card.id}
                    style={{
                      flexDirection: 'row',
                      paddingLeft: wp('5%'),
                      marginTop: hp('3%'),
                    }}>
                    <CheckBox
                      onClick={() => this.checkBoxHandler(card)}
                      isSelected={this.state.token === card.id}
                    />
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        marginLeft: wp('5%'),
                      }}>
                      <TouchableWithoutFeedback
                        onPress={() => this.checkBoxHandler(card)}>
                        <Text
                          style={{
                            color: AppConstant.Colors.titlePlaceholder,
                            fontSize: wp('3.5%'),
                            fontFamily: AppConstant.Fonts.regular,
                          }}>{`${card.brand} ending in ${card.last4.padStart(
                          6,
                          'X',
                        )}`}</Text>
                      </TouchableWithoutFeedback>

                      {/* {this.state.token == card.id && (

                                                <View style={{ flexDirection: 'row', marginTop: hp('2%') }} >
                                                    <TextInput
                                                        style={{
                                                            height: 40,
                                                            borderRadius: 4,
                                                            borderColor: AppConstant.Colors.inputTextPlaceholder,
                                                            borderWidth: 1,
                                                            width: '42%',
                                                            textAlign: 'center',
                                                            paddingLeft: 10,
                                                            marginRight: wp('2%')
                                                        }}
                                                        onChangeText={(value) => { console.log(value) }}
                                                        // onBlur={this.props.handleBlur('state')}
                                                        value={''}
                                                        editable={false}
                                                        maxLength={20}
                                                        keyboardType={'ascii-capable'}
                                                        placeholder='MM/YY'
                                                    />
                                                    <TextInput
                                                        style={{
                                                            height: 40,
                                                            borderRadius: 4,
                                                            borderColor: AppConstant.Colors.inputTextPlaceholder,
                                                            borderWidth: 1,
                                                            textAlign: 'center',
                                                            width: '42%',
                                                            paddingLeft: 10,
                                                            marginLeft: wp('2%'),
                                                        }}
                                                        onChangeText={(value) => { console.log(value) }}
                                                        // onBlur={()}
                                                        value={''}
                                                        maxLength={20}
                                                        editable={false}
                                                        keyboardType={'ascii-capable'}
                                                        placeholder='CVV'
                                                    />
                                                </View>
                                            )} */}
                    </View>
                  </View>
                ))}

                <TouchableWithoutFeedback
                  onPress={_.debounce(this.makePaymentRequest, 500, {
                    leading: true,
                    trailing: false,
                  })}>
                  <View
                    style={{
                      alignItems: 'flex-start',
                      width: '50%',
                      marginTop: hp('3%'),
                      marginLeft: wp('5%'),
                    }}>
                    {Common.Helper.isAndroid() ? (
                      <Image source={AppConstant.Images.googlePayIcon} />
                    ) : (
                      <Image source={AppConstant.Images.applePayIcon} />
                      // <SvgUri
                      //   source={AppConstant.Images.applePayIcon}
                      // />
                    )}
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.addCard()}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: wp('5%'),
                      marginTop: hp('3%'),
                    }}>
                    <View style={{flexDirection: 'row', width: '80%'}}>
                      <View
                        style={{
                          width: wp('5%'),
                          height: wp('5%'),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: AppConstant.Colors.salmon,
                          backgroundColor: AppConstant.Colors.salmon,
                          borderWidth: 1,
                          borderRadius: wp('1%'),
                        }}>
                        <Image source={AppConstant.Images.plusIcon} />
                      </View>
                      <Text
                        style={{
                          color: AppConstant.Colors.black,
                          fontSize: wp('3.5%'),
                          fontFamily: AppConstant.Fonts.medium,
                          marginLeft: wp('3%'),
                        }}>
                        {' '}
                        Add payment method{' '}
                      </Text>
                    </View>
                    <View style={{alignItems: 'flex-start', width: '20%'}}>
                      <Image source={AppConstant.Images.cardIcon} />
                    </View>
                  </View>
                </TouchableWithoutFeedback>

                <View style={styles.underline} />

                <Text
                  style={{
                    color: AppConstant.Colors.black,
                    fontSize: wp('4.5%'),
                    fontFamily: AppConstant.Fonts.medium,
                    marginLeft: wp('5%'),
                  }}>
                  Shipping Address
                </Text>
                {this.props.otherUser && !this.state.buyForSelf && (
                  <TouchableWithoutFeedback
                    onPress={() => this.selectAddress(1)}>
                    <View
                      style={{
                        marginHorizontal: wp('5%'),
                        borderRadius: 50,
                        borderWidth: 1,
                        marginTop: hp('3%'),
                        backgroundColor:
                          this.state.selectedAddress === 1
                            ? AppConstant.Colors.salmon
                            : AppConstant.Colors.white,
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: hp('5%'),
                        maxHeight: hp('15%'),
                        padding: 10,
                        borderColor: AppConstant.Colors.salmon,
                      }}>
                      <Text
                        style={{
                          color:
                            this.state.selectedAddress === 1
                              ? AppConstant.Colors.white
                              : AppConstant.Colors.salmon,
                          fontSize: wp('3.25%'),
                          fontFamily: AppConstant.Fonts.medium,
                        }}>{`Ship to ${this.props.otherUser.first_name}'s provided address`}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}

                <TouchableWithoutFeedback onPress={() => this.selectAddress(2)}>
                  <View
                    style={{
                      marginHorizontal: wp('5%'),
                      borderRadius: 50,
                      borderWidth: 1,
                      marginTop: hp('3%'),
                      backgroundColor:
                        this.state.selectedAddress === 2
                          ? AppConstant.Colors.salmon
                          : AppConstant.Colors.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: hp('5%'),
                      maxHeight: hp('15%'),
                      padding: 10,
                      borderColor: AppConstant.Colors.salmon,
                    }}>
                    <Text
                      style={{
                        color:
                          this.state.selectedAddress === 2
                            ? AppConstant.Colors.white
                            : AppConstant.Colors.salmon,
                        fontSize: wp('3.25%'),
                        fontFamily: AppConstant.Fonts.medium,
                      }}>
                      Ship to my address
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp('3%'),
                    marginLeft: wp('5%'),
                  }}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.setState({
                        order: {
                          ...this.state.order,
                          is_gift_wrapped: !this.state.order.is_gift_wrapped,
                        },
                      })
                    }>
                    <View
                      style={{
                        width: wp('5%'),
                        height: wp('5%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: AppConstant.Colors.checkBoxGreen,
                        backgroundColor: this.state.order.is_gift_wrapped
                          ? AppConstant.Colors.checkBoxGreen
                          : AppConstant.Colors.white,
                        borderWidth: 1,
                        borderRadius: wp('1%'),
                      }}>
                      <Image source={AppConstant.Images.checkBoxTick} />
                    </View>
                  </TouchableWithoutFeedback>

                  <View
                    style={{
                      flexDirection: 'column',
                      marginLeft: wp('3%'),
                      paddingRight: 5,
                    }}>
                    <Text
                      style={{
                        color: AppConstant.Colors.checkBoxGreen,
                        fontSize: wp('3.25%'),
                        fontFamily: AppConstant.Fonts.regular,
                      }}>
                      If retailer offers gift wrapping services,
                    </Text>
                    <Text
                      style={{
                        color: AppConstant.Colors.checkBoxGreen,
                        fontSize: wp('3.25%'),
                        fontFamily: AppConstant.Fonts.regular,
                      }}>
                      I would like this item gift wrapped.
                    </Text>
                  </View>
                </View>

                <View style={styles.underline} />

                <View style={{marginHorizontal: wp('5%')}}>
                  <Text
                    style={{
                      color: AppConstant.Colors.inputTextPlaceholder,
                      fontSize: wp('4%'),
                      fontFamily: AppConstant.Fonts.normal,
                      marginBottom: hp('2%'),
                    }}>
                    Email Address
                    <Text style={{color: 'red'}}> *</Text>
                  </Text>
                  <TextInput
                    style={{
                      height: 40,
                      borderRadius: 4,
                      borderColor: AppConstant.Colors.inputTextPlaceholder,
                      borderWidth: 1,
                      width: '100%',
                      paddingLeft: 10,
                      fontSize: wp('4%'),
                      fontFamily: AppConstant.Fonts.light,
                      color: AppConstant.Colors.black,
                    }}
                    underlineColorAndroid={AppConstant.Colors.white}
                    autoCorrect={false}
                    onChangeText={value =>
                      this.setState({
                        email: {
                          ...this.state.email,
                          value: value.toLowerCase(),
                        },
                      })
                    }
                    onEndEditing={() =>
                      this.setState({
                        email: {
                          ...this.state.email,
                          touched: true,
                          valid: emailReg.test(this.state.email.value),
                        },
                      })
                    }
                    // onBlur={this.props.handleBlur('line_1')}
                    value={this.state.email.value}
                    maxLength={50}
                    keyboardType={'ascii-capable'}
                    autoCapitalize="none"
                    placeholder=""
                  />
                  {this.state.email.touched && !this.state.email.valid && (
                    <Text
                      style={{
                        color: 'red',
                        marginTop: 5,
                        fontFamily: AppConstant.Fonts.regular,
                        fontSize: wp('3%'),
                      }}>
                      {' '}
                      Invalid email address
                    </Text>
                  )}
                </View>

                <View style={styles.underline} />

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: hp('3%'),
                  }}>
                  <CustomButton
                    onClick={() => {
                      this.submitHandler().then(r => console.log(r));
                    }}
                    title="Submit Order"
                    containerStyle={{
                      backgroundColor: AppConstant.Colors.blue,
                      paddingHorizontal: 0,
                      width: wp('50%'),
                    }}
                  />
                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>
        </View>
        <DropdownAlert modal="purchase" />
      </CustomModal>
    );
  }
}

const styles = StyleSheet.create({
  underline: {
    borderBottomWidth: 1,
    borderColor: AppConstant.Colors.separator,
    marginVertical: hp('3%'),
  },
});

// Mapping redux state to props
const mapSateToProps = state => ({
  cards: state.users.cards,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
  saveCards: cards => dispatch(Actions.saveCards(cards)),
});

export default connect(mapSateToProps, mapDispatchToProps)(PurchaseModal);
