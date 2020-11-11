import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import Swipeout from 'react-native-swipeout';
import {NavigationEvents} from 'react-navigation';
import stripe from 'tipsi-stripe';
import _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Image from 'react-native-fast-image';

import {BackButton, CheckBox, CustomButton, StateDropdown} from '../../components';
// Services
import * as Services from '../../services';

// Redux Actions
import * as Actions from '../../redux/actions';

// App Common functions
import * as Common from '../../common';

// App Constants
import * as AppConstant from '../../constants';

class PaymentInformation extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: (
      <Text
        style={{
          color: AppConstant.Colors.black,
          fontSize: wp('5%'),
          fontFamily: AppConstant.Fonts.medium,
        }}>
        Payment Information
      </Text>
    ),
    headerLeft: (
      <BackButton
        goBack={() => navigation.navigate(navigation.getParam('activeTab'))}
      />
    ),
  });

  state = {
    activeRow: null,
    formData: {
      email: this.props.user.email,
      shipping_address: this.props.user.shipping_address || {
        line_1: '',
        line_2: '',
        state: '',
        zip: '',
        city: '',
      },
      mailing_address: this.props.user.mailing_address || {
        line_1: '',
        line_2: '',
        state: '',
        zip: '',
        city: '',
      },
      is_mailing: this.props.user.is_mailing || false,
    },
  };

  componentDidMount() {
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

    if (prevProps.user !== this.props.user) {
      this.setState({
        formData: {
          email: this.props.user.email,
          shipping_address: this.props.user.shipping_address || {
            line_1: '',
            line_2: '',
            state: '',
            zip: '',
            city: '',
          },
          mailing_address: this.props.user.mailing_address || {
            line_1: '',
            line_2: '',
            state: '',
            zip: '',
            city: '',
          },
          is_mailing: this.props.user.is_mailing || false,
        },
      });
    }
  }

  checkButton = props => {
    props.setFieldValue('is_mailing', !props.values.is_mailing);
  };

  formattedZip = value => {
    if (value.length === 6 && !value.includes('-')) {
      return value.slice(0, 5) + '-' + value.slice(5, 9);
    }
    return value;
  };

  addCard = async () => {
    try {
      const cardToken = await stripe.paymentRequestWithCardForm({});
      this.props.toggleLoader(true);
      let card = await Services.CardService.addCard(cardToken);
      this.props.toggleLoader(false);
      if (card) {
        this.props.saveCards(card);
        Services.AlertService.show(
          'success',
          'Success',
          'Card added successfully',
        );
      } else {
        Services.AlertService.show('error', 'Failed', 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      this.props.toggleLoader(false);
      if (error.code !== 'cancelled') {
        Services.AlertService.show('error', 'Failed', 'Something went wrong');
      }
    }
  };

  deleteCard = cardId => {
    Alert.alert(
      'Confirmation',
      AppConstant.Alert.CARD_DELETE_CONFIRMATION_DIALOG,
      [
        {
          text: 'Yes',
          onPress: async () => {
            try {
              this.props.toggleLoader(true);
              let card = await Services.CardService.deleteCard(cardId);
              this.props.toggleLoader(false);
              if (card) {
                this.props.deleteCard(card);
                Services.AlertService.show(
                  'success',
                  'Success',
                  'Card deleted successfully',
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
        {
          text: 'No',
          onPress: () => {
            console.log('canceled');
          },
        },
      ],
      {cancelable: false},
    );
  };

  checkError = (props, fieldName) => {
    if (
      fieldName.includes('.') &&
      props.errors.hasOwnProperty(fieldName.split('.')[0]) &&
      props.touched.hasOwnProperty(fieldName.split('.')[0])
    ) {
      return (
        props.errors[fieldName.split('.')[0]][fieldName.split('.')[1]] &&
        (props.touched[fieldName.split('.')[0]][fieldName.split('.')[1]] ||
          props.submitCount > 0)
      );
    }
    return (
      props.errors[fieldName] &&
      (props.touched[fieldName] || props.submitCount > 0)
    );
  };

  handleSubmit = async values => {
    try {
      if (!_.isEqual(values, this.state.formData)) {
        this.props.toggleLoader(true);
        if (this.props.user.is_mailing && !values.is_mailing) {
          values.mailing_address = values.shipping_address;
        }
        await Services.UserService.update(this.props.user.id, values);
        this.props.toggleLoader(false);
        Services.AlertService.show(
          'success',
          'Success',
          'Information updated successfully',
        );
      } else {
        Services.AlertService.show(
          'info',
          'Info',
          'Please edit fields to update',
        );
      }
    } catch (error) {
      console.log(error);
      this.props.toggleLoader(false);
      Services.AlertService.show('error', 'Failed', 'Something went wrong');
    }
  };

  onSwipeOpen(rowId, direction) {
    if (typeof direction !== 'undefined') {
      this.setState({activeRow: rowId});
    }
  }

  onSwipeClose(rowId, direction) {
    if (rowId === this.state.activeRow && typeof direction !== 'undefined') {
      this.setState({activeRow: null});
    }
  }

  renderStateDropDown = (props, type) => (
    <StateDropdown
      placeholder={{}}
      value={props.values[type].state}
      onValueChange={value => props.setFieldValue(type + '.state', value)}
      style={{
        viewContainer: {
          marginTop: 10,
        },
        headlessAndroidContainer: {
          marginTop: 10,
        },
        inputIOS: {
          paddingLeft: 15,
          fontFamily: AppConstant.Fonts.normal,
        },
        inputAndroid: {
          paddingLeft: 12,
          fontFamily: AppConstant.Fonts.normal,
        },
      }}
    />
  );

  renderCardRow = ({item, index}) => {
    // console.log(this.state.activeRow,index);
    let swipeoutBtns = [
      {
        type: 'delete',
        backgroundColor: AppConstant.Colors.red,
        component: (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              resizeMode="contain"
              style={{height: '40%', width: '40%'}}
              source={AppConstant.Images.deleteIcon}
            />
          </View>
        ),
        onPress: () => this.deleteCard(item.id),
        disabled: this.state.activeRow !== index,
      },
    ];
    return (
      <Swipeout
        key={item.id}
        buttonWidth={wp('30%')}
        style={{marginTop: hp('1%')}}
        close={this.state.activeRow !== index}
        backgroundColor={AppConstant.Colors.white}
        autoClose={true}
        rowID={index}
        right={swipeoutBtns}
        onOpen={(secId, rowId, direction) => this.onSwipeOpen(rowId, direction)}
        onClose={(secId, rowId, direction) =>
          this.onSwipeClose(rowId, direction)
        }>
        <View style={{height: 50, flexDirection: 'row'}}>
          <View
            style={{
              width: '30%',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: AppConstant.Fonts.medium,
                fontSize: wp('3.75%'),
                color: AppConstant.Colors.black,
              }}>
              {item.brand}
            </Text>
          </View>
          <View
            style={{
              width: '70%',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: AppConstant.Fonts.normal,
                fontSize: wp('3.25%'),
                color: AppConstant.Colors.titlePlaceholder,
              }}>
              {item.last4.padStart(16, 'X')}
            </Text>
          </View>
        </View>
      </Swipeout>
    );
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          contentContainerStyle={{
            width: wp('100%'),
            alignItems: 'center',
            paddingVertical: 20,
          }}>
          <Formik
            validateOnChange={false}
            validateOnBlur={true}
            validationSchema={Common.Validations.Address}
            initialValues={this.state.formData}
            onSubmit={(values) => this.handleSubmit(values)}>
            {props => {
              return (
                <View style={{width: wp('85%')}}>
                  <NavigationEvents
                    onWillBlur={() => {
                      this.setState({activeRow: null});
                      props.resetForm();
                    }}
                  />

                  <View style={{}}>
                    <Text
                      style={{
                        fontSize: wp('3.5%'),
                        fontFamily: AppConstant.Fonts.normal,
                        color: AppConstant.Colors.titlePlaceholder,
                      }}>
                      Email address for shipping and payment
                    </Text>
                    <TextInput
                      onChangeText={props.handleChange('email')}
                      onBlur={props.handleBlur('email')}
                      value={props.values.email}
                      underlineColorAndroid={AppConstant.Colors.white}
                      autoCorrect={false}
                      maxLength={30}
                      style={[
                        {
                          height: 40,
                          borderRadius: 4,
                          borderColor: AppConstant.Colors.inputTextPlaceholder,
                          borderWidth: 1,
                          width: '100%',
                          paddingLeft: 15,
                          marginTop: 5,
                          fontSize: wp('4%'),
                          fontFamily: AppConstant.Fonts.normal,
                          color: AppConstant.Colors.black,
                        },
                      ]}
                      keyboardType={'ascii-capable'}
                      autoCapitalize="none"
                      placeholder="email"
                      editable={!this.props.user.email}
                    />
                    {this.checkError(props, 'email') && (
                      <Text style={styles.error}>{props.errors.email}</Text>
                    )}
                  </View>

                  <View
                    style={{
                      width: wp('85%'),
                      marginTop: hp('3%'),
                    }}>
                    <Text
                      style={{
                        fontSize: wp('3.5%'),
                        fontFamily: AppConstant.Fonts.normal,
                        color: AppConstant.Colors.titlePlaceholder,
                      }}>
                      Shipping address
                    </Text>

                    <TextInput
                      onChangeText={props.handleChange(
                        'shipping_address.line_1',
                      )}
                      onBlur={props.handleBlur('shipping_address.line_1')}
                      value={props.values.shipping_address.line_1}
                      style={[
                        {
                          height: 40,
                          borderRadius: 4,
                          borderColor: AppConstant.Colors.inputTextPlaceholder,
                          borderWidth: 1,
                          width: '100%',
                          paddingLeft: 15,
                          marginTop: 5,
                          fontSize: wp('4%'),
                          fontFamily: AppConstant.Fonts.normal,
                          color: AppConstant.Colors.black,
                        },
                      ]}
                      maxLength={50}
                      keyboardType={'ascii-capable'}
                      placeholder="Line 1"
                    />
                    {this.checkError(props, 'shipping_address.line_1') && (
                      <Text style={styles.error}>
                        {props.errors.shipping_address.line_1}
                      </Text>
                    )}

                    <TextInput
                      onChangeText={props.handleChange(
                        'shipping_address.line_2',
                      )}
                      onBlur={props.handleBlur('shipping_address.line_2')}
                      value={props.values.shipping_address.line_2}
                      style={[
                        {
                          height: 40,
                          borderRadius: 4,
                          borderColor: AppConstant.Colors.inputTextPlaceholder,
                          borderWidth: 1,
                          width: '100%',
                          paddingLeft: 15,
                          marginTop: 10,
                          fontSize: wp('4%'),
                          fontFamily: AppConstant.Fonts.normal,
                          color: AppConstant.Colors.black,
                        },
                      ]}
                      maxLength={50}
                      keyboardType={'ascii-capable'}
                      placeholder="Line 2"
                    />
                    {this.checkError(props, 'shipping_address.line_2') && (
                      <Text style={styles.error}>
                        {props.errors.shipping_address.line_2}
                      </Text>
                    )}

                    <TextInput
                      onChangeText={props.handleChange('shipping_address.city')}
                      onBlur={props.handleBlur('shipping_address.city')}
                      value={props.values.shipping_address.city}
                      style={[
                        {
                          height: 40,
                          borderRadius: 4,
                          borderColor: AppConstant.Colors.inputTextPlaceholder,
                          borderWidth: 1,
                          width: '100%',
                          paddingLeft: 15,
                          marginTop: 10,
                          fontSize: wp('4%'),
                          fontFamily: AppConstant.Fonts.normal,
                          color: AppConstant.Colors.black,
                        },
                      ]}
                      maxLength={30}
                      keyboardType={'ascii-capable'}
                      placeholder="Town/City"
                    />
                    {this.checkError(props, 'shipping_address.city') && (
                      <Text style={styles.error}>
                        {props.errors.shipping_address.city}
                      </Text>
                    )}

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={[
                          {
                            width: '48%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            marginBottom: hp('3%'),
                          },
                        ]}>
                        {this.renderStateDropDown(props, 'shipping_address')}
                        {this.checkError(props, 'shipping_address.state') && (
                          <Text style={styles.error}>
                            {props.errors.shipping_address.state}
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          {
                            width: '48%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            marginBottom: hp('3%'),
                          },
                        ]}>
                        <TextInput
                          onChangeText={props.handleChange(
                            'shipping_address.zip',
                          )}
                          onBlur={props.handleBlur('shipping_address.zip')}
                          value={this.formattedZip(
                            props.values.shipping_address.zip,
                          )}
                          returnKeyType="done"
                          style={[
                            {
                              height: 40,
                              borderRadius: 4,
                              borderColor:
                              AppConstant.Colors.inputTextPlaceholder,
                              borderWidth: 1,
                              width: '100%',
                              paddingLeft: 15,
                              marginTop: 10,
                              fontSize: wp('4%'),
                              fontFamily: AppConstant.Fonts.normal,
                              color: AppConstant.Colors.black,
                            },
                          ]}
                          maxLength={10}
                          keyboardType={'number-pad'}
                          placeholder="Zipcode"
                        />
                        {this.checkError(props, 'shipping_address.zip') && (
                          <Text style={styles.error}>
                            {props.errors.shipping_address.zip}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={{marginTop: hp('1.5%')}}>
                    <Text
                      style={{
                        fontSize: wp('3.5%'),
                        fontFamily: AppConstant.Fonts.normal,
                        color: AppConstant.Colors.titlePlaceholder,
                      }}>
                      Mailing Address
                    </Text>

                    <TouchableWithoutFeedback
                      onPress={() => this.checkButton(props)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: hp('2%'),
                        }}>
                        <CheckBox
                          onClick={() => this.checkButton(props)}
                          isSelected={!props.values.is_mailing}
                        />
                        <Text
                          style={{
                            marginLeft: 10,
                            color: AppConstant.Colors.black,
                            fontSize: wp('4%'),
                            fontFamily: AppConstant.Fonts.normal,
                          }}>
                          My shipping is my mailing address
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                  {props.values.is_mailing && (
                    <View style={{marginTop: hp('3%')}}>
                      {/* <Text style={{ fontSize: wp('3.5%'), fontFamily: AppConstant.Fonts.normal, color: AppConstant.Colors.titlePlaceholder }}>Mailing address</Text> */}

                      <TextInput
                        onChangeText={props.handleChange(
                          'mailing_address.line_1',
                        )}
                        onBlur={props.handleBlur('mailing_address.line_1')}
                        value={props.values.mailing_address.line_1}
                        style={[
                          {
                            height: 40,
                            borderRadius: 4,
                            borderColor:
                            AppConstant.Colors.inputTextPlaceholder,
                            borderWidth: 1,
                            width: '100%',
                            paddingLeft: 15,
                            marginTop: 5,
                            fontSize: wp('4%'),
                            fontFamily: AppConstant.Fonts.normal,
                            color: AppConstant.Colors.black,
                          },
                        ]}
                        maxLength={50}
                        keyboardType={'ascii-capable'}
                        placeholder="Line 1"
                      />
                      {this.checkError(props, 'mailing_address.line_1') && (
                        <Text style={styles.error}>
                          {props.errors.mailing_address.line_1}
                        </Text>
                      )}

                      <TextInput
                        onChangeText={props.handleChange(
                          'mailing_address.line_2',
                        )}
                        onBlur={props.handleBlur('mailing_address.line_2')}
                        value={props.values.mailing_address.line_2}
                        style={[
                          {
                            height: 40,
                            borderRadius: 4,
                            borderColor:
                            AppConstant.Colors.inputTextPlaceholder,
                            borderWidth: 1,
                            width: '100%',
                            paddingLeft: 15,
                            marginTop: 10,
                            fontSize: wp('4%'),
                            fontFamily: AppConstant.Fonts.normal,
                            color: AppConstant.Colors.black,
                          },
                        ]}
                        maxLength={50}
                        keyboardType={'ascii-capable'}
                        placeholder="Line 2"
                      />
                      {this.checkError(props, 'mailing_address.line_2') && (
                        <Text style={styles.error}>
                          {props.errors.mailing_address.line_2}
                        </Text>
                      )}

                      <TextInput
                        onChangeText={props.handleChange(
                          'mailing_address.city',
                        )}
                        onBlur={props.handleBlur('mailing_address.city')}
                        value={props.values.mailing_address.city}
                        style={[
                          {
                            height: 40,
                            borderRadius: 4,
                            borderColor:
                            AppConstant.Colors.inputTextPlaceholder,
                            borderWidth: 1,
                            width: '100%',
                            paddingLeft: 15,
                            marginTop: 10,
                            fontSize: wp('4%'),
                            fontFamily: AppConstant.Fonts.normal,
                            color: AppConstant.Colors.black,
                          },
                        ]}
                        maxLength={30}
                        keyboardType={'ascii-capable'}
                        placeholder="Town/City"
                      />
                      {this.checkError(props, 'mailing_address.city') && (
                        <Text style={styles.error}>
                          {props.errors.mailing_address.city}
                        </Text>
                      )}

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={[
                            {
                              width: '48%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'column',
                              backgroundColor: 'white',
                            },
                          ]}>
                          {this.renderStateDropDown(props, 'mailing_address')}
                          {this.checkError(props, 'mailing_address.state') && (
                            <Text style={styles.error}>
                              {props.errors.mailing_address.state}
                            </Text>
                          )}
                        </View>
                        <View
                          style={[
                            {
                              width: '48%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'column',
                              backgroundColor: 'white',
                            },
                          ]}>
                          <TextInput
                            onChangeText={props.handleChange(
                              'mailing_address.zip',
                            )}
                            onBlur={props.handleBlur('mailing_address.zip')}
                            value={this.formattedZip(
                              props.values.mailing_address.zip,
                            )}
                            returnKeyType="done"
                            style={[
                              {
                                height: 40,
                                borderRadius: 4,
                                borderColor:
                                AppConstant.Colors.inputTextPlaceholder,
                                borderWidth: 1,
                                width: '100%',
                                paddingLeft: 15,
                                marginTop: 10,
                                fontSize: wp('4%'),
                                fontFamily: AppConstant.Fonts.normal,
                                color: AppConstant.Colors.black,
                              },
                            ]}
                            maxLength={10}
                            keyboardType={'number-pad'}
                            placeholder="Zipcode"
                          />
                          {this.checkError(props, 'mailing_address.zip') && (
                            <Text style={styles.error}>
                              {props.errors.mailing_address.zip}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  )}

                  {this.props.cards.length > 0 && (
                    <View style={{marginTop: hp('3%')}}>
                      <Text
                        style={{
                          fontSize: wp('3.5%'),
                          fontFamily: AppConstant.Fonts.normal,
                          color: AppConstant.Colors.titlePlaceholder,
                        }}>
                        Payment Methods
                      </Text>
                      <FlatList
                        data={this.props.cards}
                        keyExtractor={item => item.id}
                        extraData={this.state}
                        renderItem={this.renderCardRow}
                        bounces={false}
                      />
                    </View>
                  )}

                  <TouchableWithoutFeedback onPress={() => this.addCard()}>
                    <View
                      style={{
                        height: hp('5%'),
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: hp('3%'),
                      }}>
                      <Text
                        style={{
                          fontSize: wp('3.5%'),
                          fontFamily: AppConstant.Fonts.normal,
                          color: AppConstant.Colors.titlePlaceholder,
                        }}>
                        Add Payment Method
                      </Text>
                      <Image
                        style={{marginLeft: wp('10%')}}
                        source={AppConstant.Images.cardIcon}
                      />
                    </View>
                  </TouchableWithoutFeedback>

                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      alignSelf: 'flex-end',
                      marginVertical: hp('3%'),
                    }}>
                    <View
                      style={{
                        width: '48%',
                        paddingHorizontal: wp('1%'),
                      }}>
                      <CustomButton
                        onClick={() =>
                          this.props.navigation.navigate(
                            this.props.navigation.getParam('activeTab'),
                          )
                        }
                        title="Cancel"
                        containerStyle={{
                          backgroundColor: AppConstant.Colors.cancelColor,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        width: '48%',
                        paddingHorizontal: wp('1%'),
                      }}>
                      <CustomButton
                        onClick={() => props.handleSubmit()}
                        title="Save"
                        containerStyle={{
                          backgroundColor: AppConstant.Colors.blue,
                        }}
                      />
                    </View>
                  </View>
                </View>
              );
            }}
          </Formik>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
    marginTop: 5,
    alignSelf: 'flex-start',
    fontSize: wp('3%'),
  },
});

// Mapping redux state to props
const mapSateToProps = state => ({
  user: state.onboard.user,
  cards: state.users.cards,
  activeTab: state.common.activeTab,
  states: state.common.states,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
  saveLoggedInUser: user => dispatch(Actions.saveLoggedInUser(user)),
  updateAddress: address => dispatch(Actions.updateAddress(address, null)),
  saveCards: cards => dispatch(Actions.saveCards(cards)),
  deleteCard: card => dispatch(Actions.deleteCard(card)),
});

export default connect(mapSateToProps, mapDispatchToProps)(PaymentInformation);
