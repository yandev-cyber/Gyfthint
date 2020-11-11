// Third Party Liabraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, BackHandler, Image} from 'react-native';
import {Formik} from 'formik';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Swipeout from 'react-native-swipeout';

// Custom Components
import {CustomButton, DatePicker, InputField} from '../components';

// Services
import * as Services from '../services';

// Redux Actions
import * as Actions from '../redux/actions';

// App Common functions
import * as Common from '../common';

// App Constants
import * as AppConstant from '../constants';

// StateFull Component
class AddCelebrations extends Component {
  // Component's State
  state = {
    activeRow: null,
    isDateTimePickerVisible: false,
    enableScrollViewScroll: true,
    specialEvent: null,
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

  // component life cycle hooks
  componentDidMount() {
    // Add listener on android hardware back button
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    console.log(this.props.subscribedCelebrations);
  }

  componentWillUnmount() {
    // Remove listener from android hardware back button
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  // Method to be called on hardware back press in android
  handleBackPress = () => {
    this.props.navigation.navigate('celebrations');
    return true;
  };

  //Methods to handle datepicker
  showDateTimePicker = () => {
    if (!this.state.specialEvent) {
      this.setState({isDateTimePickerVisible: true});
    }
  };

  hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  handleDatePicked = (date, props) => {
    //long
    // const month = date.toLocaleString('en-us', { month: 'short' });
    props.setFieldValue('occurrence_date.day', +date.getDate());
    props.setFieldValue('occurrence_date.month', +date.getMonth());
    props.setFieldValue('occurrence_date.year', date.getFullYear() + '');
    this.hideDateTimePicker();
  };

  // Method to add event locally in a array.
  addSpecialEvent = event => {
    this.setState({specialEvent: event});
  };

  // Method to remove event from  local array.
  removeSpecialEvent = () => {
    this.setState({specialEvent: null});
  };

  // Method to check form validations and submit the form
  checkErrors = async props => {
    if (props.dirty) {
      if (props.errors.name) {
        Common.Alert.show('', props.errors.name);
        return false;
      }
      if (props.errors.occurrence_date) {
        Common.Alert.show('', props.errors.occurrence_date.day);
        return false;
      }
      await props.submitForm();
      return true;
    }
  };

  // Method called upon finish button
  submitHandler = async () => {
    let specialEvent = [],
      occurrenceDate = '',
      currentYear = new Date().getFullYear(),
      currentMonth = new Date().getMonth(),
      events = this.props.subscribedCelebrations;
    if (this.state.specialEvent) {
      if (currentYear >= this.state.specialEvent.occurrence_date.year) {
        occurrenceDate = new Date(
          Date.UTC(
            currentMonth < this.state.specialEvent.occurrence_date.month
              ? currentYear
              : currentYear + 1,
            this.state.specialEvent.occurrence_date.month,
            this.state.specialEvent.occurrence_date.day,
            12,
          ),
        );
      } else {
        occurrenceDate = new Date(
          Date.UTC(
            this.state.specialEvent.occurrence_date.year,
            this.state.specialEvent.occurrence_date.month,
            this.state.specialEvent.occurrence_date.day,
            12,
          ),
        );
      }

      specialEvent.push({
        ...this.state.specialEvent,
        occurrence_date: occurrenceDate,
      });
    }
    this.props.toggleLoader(true);
    const result = await Services.EventService.addEvents(
      [...events, ...specialEvent],
      this.props.user.id,
    );
    if (result) {
      Services.NavigationService.navigate('landing');
    }
    this.props.toggleLoader(false);
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

  activeButton = props => {
    if (props.dirty) {
      return (
        Boolean(props.values.name) && Boolean(props.values.occurrence_date.day)
      );
    }
    return false;
  };

  // JSX to render event list rows
  renderEventsRow = (item, index) => {
    let swipeoutBtns = [
      {
        type: 'delete',
        backgroundColor: AppConstant.Colors.red,
        component: (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={AppConstant.Images.deleteIcon} />
          </View>
        ),
        onPress: () => this.props.subscribeCelebrations(item),
        disabled: this.state.activeRow !== index,
      },
    ];
    return (
      // Swipeout a third party component to create a swipeable row in event's list
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
        <View
          style={{
            height: 50,
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: wp('12%'),
              height: wp('12%'),
              borderRadius: wp('6%'),
              marginLeft: wp('10%'),
              backgroundColor: AppConstant.Colors.checkBox,
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: wp('4%'),
                color: AppConstant.Colors.white,
                fontFamily: AppConstant.Fonts.bold,
              }}>
              {item.occurrence_date
                .getDate()
                .toString()
                .padStart(2, '0')}{' '}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: wp('2%'),
                color: AppConstant.Colors.white,
                fontFamily: AppConstant.Fonts.bold,
              }}>
              {this.state.months[item.occurrence_date.getMonth()].toUpperCase()}{' '}
            </Text>
          </View>
          <Text
            style={{
              alignSelf: 'center',
              fontFamily: AppConstant.Fonts.normal,
              marginLeft: wp('5%'),
              fontSize: wp('3.5%'),
              color: AppConstant.Colors.black,
            }}>
            {item.name}
          </Text>
        </View>
      </Swipeout>
    );
  };

  render() {
    let swipeoutBtns = [
      {
        type: 'delete',
        backgroundColor: AppConstant.Colors.red,
        component: (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              resizeMode="contain"
              style={{height: '40%', width: '40%'}}
              source={AppConstant.Images.deleteIcon}
            />
          </View>
        ),
        onPress: () => this.removeSpecialEvent(),
      },
    ];
    return (
      <View
        onStartShouldSetResponderCapture={() => {
          this.setState({enableScrollViewScroll: true});
        }}
        style={{flex: 1}}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          scrollEnabled={this.state.enableScrollViewScroll}
          contentContainerStyle={{flexGrow: 1}}>
          {/* Event Addition Form Starts */}
          <View style={{marginHorizontal: wp('10%')}}>
            {/*Formik a third party component to handle form */}
            <Formik
              initialValues={{
                occurrence_date: {},
                name: '',
                event_type: AppConstant.Event.SPECIAL_EVENT,
              }}
              validationSchema={Common.Validations.EventSchema}
              onSubmit={(values, {resetForm}) => {
                this.addSpecialEvent(values);
                resetForm();
              }}>
              {props => {
                return (
                  <React.Fragment>
                    <Text
                      adjustsFontSizeToFit
                      numberOfLines={2}
                      style={[styles.label, {textAlign: 'center'}]}>
                      Do you celebrate an anniversary?
                    </Text>

                    <Text
                      adjustsFontSizeToFit
                      numberOfLines={2}
                      style={styles.label}>
                      Give it a name
                    </Text>

                    <InputField
                      editable={!this.state.specialEvent}
                      onChangeText={props.handleChange('name')}
                      onBlur={props.handleBlur('name')}
                      value={props.values.name}
                      returnKeyType="next"
                      onSubmitEditing={() => this.showDateTimePicker()}
                      placeholder="Event Name"
                      style={[styles.inputField, {width: wp('80%')}]}
                      maxLength={30}
                    />

                    <DatePicker
                      style={styles.datePicker}
                      isDateTimePickerVisible={
                        this.state.isDateTimePickerVisible
                      }
                      handleDatePicked={this.handleDatePicked}
                      hideDateTimePicker={this.hideDateTimePicker}
                      showDateTimePicker={this.showDateTimePicker}
                      {...props}
                    />
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <CustomButton
                        onClick={
                          this.activeButton(props)
                            ? () => this.checkErrors(props)
                            : null
                        }
                        title="Add"
                        titleStyle={styles.buttonText}
                        containerStyle={{
                          backgroundColor: this.activeButton(props)
                            ? AppConstant.Colors.lightGreen
                            : AppConstant.Colors.lightGray,
                        }}
                      />
                    </View>
                  </React.Fragment>
                );
              }}
            </Formik>
          </View>
          {/* Events Addition Form Ends */}

          {/* Events List Title container starts */}
          <View
            style={{
              flex: 0.3,
              marginLeft: wp('10%'),
              marginTop: hp('2%'),
              marginBottom: hp('1%'),
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={[styles.textStyle]}>Added Events</Text>
            <Text
              style={{
                fontSize: wp('3.25%'),
                fontFamily: AppConstant.Fonts.normal,
                color: AppConstant.Colors.titlePlaceholder,
              }}>
              Your family and friends birthdays will be added to
            </Text>
            <Text
              style={{
                fontSize: wp('3.25%'),
                fontFamily: AppConstant.Fonts.normal,
                color: AppConstant.Colors.titlePlaceholder,
              }}>
              your calendar when you add them to your
            </Text>
            <Text
              style={{
                fontSize: wp('3.25%'),
                fontFamily: AppConstant.Fonts.normal,
                color: AppConstant.Colors.titlePlaceholder,
              }}>
              GyftHint Network
            </Text>
          </View>
          {/* Events List Title container Ends */}

          {/* Events list container starts */}
          <View
            onStartShouldSetResponderCapture={() => {
              this.setState({enableScrollViewScroll: false});
            }}
            style={styles.eventsListContainer}>
            <View style={{height: 50, flexDirection: 'row'}}>
              <View
                style={{
                  width: wp('12%'),
                  height: wp('12%'),
                  borderRadius: wp('6%'),
                  marginLeft: wp('10%'),
                  backgroundColor: AppConstant.Colors.checkBox,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: wp('4%'),
                    color: AppConstant.Colors.white,
                    fontFamily: AppConstant.Fonts.bold,
                  }}>
                  {this.props.user.dob.day.toString().padStart(2, '0') || 'NA'}{' '}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: wp('2%'),
                    color: AppConstant.Colors.white,
                    fontFamily: AppConstant.Fonts.bold,
                  }}>
                  {this.state.months[
                    this.props.user.dob.month - 1
                  ].toUpperCase() || 'NA'}{' '}
                </Text>
              </View>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: AppConstant.Fonts.normal,
                  marginLeft: wp('5%'),
                  fontSize: wp('3.5%'),
                  color: AppConstant.Colors.black,
                }}>
                {'My Birthday'}
              </Text>
            </View>
            <KeyboardAwareScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled">
              {this.state.specialEvent && (
                <Swipeout
                  buttonWidth={wp('30%')}
                  style={{marginTop: hp('1%')}}
                  backgroundColor={AppConstant.Colors.white}
                  autoClose={true}
                  right={swipeoutBtns}
                  onOpen={(secId, rowId, direction) =>
                    this.onSwipeOpen(rowId, direction)
                  }
                  onClose={(secId, rowId, direction) =>
                    this.onSwipeClose(rowId, direction)
                  }>
                  <View style={{height: 50, flexDirection: 'row'}}>
                    <View
                      style={{
                        width: wp('12%'),
                        height: wp('12%'),
                        borderRadius: wp('6%'),
                        marginLeft: wp('10%'),
                        backgroundColor: AppConstant.Colors.checkBox,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: wp('4%'),
                          color: AppConstant.Colors.white,
                          fontFamily: AppConstant.Fonts.bold,
                        }}>
                        {this.state.specialEvent.occurrence_date.day
                          .toString()
                          .padStart(2, '0')}{' '}
                      </Text>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: wp('2%'),
                          color: AppConstant.Colors.white,
                          fontFamily: AppConstant.Fonts.bold,
                        }}>
                        {this.state.months[
                          this.state.specialEvent.occurrence_date.month
                        ].toUpperCase()}{' '}
                      </Text>
                    </View>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontFamily: AppConstant.Fonts.normal,
                        marginLeft: wp('5%'),
                        fontSize: wp('3.5%'),
                        color: AppConstant.Colors.black,
                      }}>
                      {this.state.specialEvent.name}
                    </Text>
                  </View>
                </Swipeout>
              )}

              {this.props.subscribedCelebrations.map((event, index) => {
                return this.renderEventsRow(event, index);
              })}
            </KeyboardAwareScrollView>
          </View>
          {/* Events List container Ends */}

          {/* Finish button container starts */}
          <View
            style={[
              styles.buttonContainer,
              {width: '80%', alignSelf: 'center'},
            ]}>
            <CustomButton
              onClick={() => this.submitHandler()}
              title="Finish"
              titleStyle={[styles.buttonText, {width: '90%'}]}
              iconStyle={{marginLeft: 0}}
              containerStyle={[styles.submitButton]}
              iconName="md-arrow-forward"
            />
          </View>
          {/* Finish button container Ends */}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    marginHorizontal: wp('10%'),
  },
  container: {
    flex: 3,
  },
  eventsListContainer: {
    maxHeight: 220,
    marginVertical: hp('1%'),
  },
  buttonContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('3'),
  },
  label: {
    fontSize: wp('4%'), // 16,
    fontFamily: AppConstant.Fonts.normal,
    color: AppConstant.Colors.titlePlaceholder,
    marginTop: hp('3%'),
    marginBottom: hp('1%'),
  },
  submitButton: {
    backgroundColor: AppConstant.Colors.lightGreen,
  },
  buttonText: {
    fontFamily: AppConstant.Fonts.medium,
    textAlign: 'center',
    // fontSize: 16
  },
  datePicker: {
    marginVertical: hp('5%'),
  },
  textStyle: {
    marginBottom: 8,
    color: AppConstant.Colors.black,
    fontSize: wp('4%'), // 16,
    fontFamily: AppConstant.Fonts.medium,
  },
});

// Mapping redux state to props
const mapSateToProps = state => ({
  user: state.onboard.user,
  subscribedCelebrations: state.onboard.subscribedCelebrations,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  addEvents: events => dispatch(Actions.addEvents(events, 'landing')),
  subscribeCelebrations: celebration =>
    dispatch(Actions.subscribeCelebrations(celebration)),
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
});

export default connect(mapSateToProps, mapDispatchToProps)(AddCelebrations);
