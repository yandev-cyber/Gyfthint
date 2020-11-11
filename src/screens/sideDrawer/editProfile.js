import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-picker';
import _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import SwitchToggle from 'react-native-switch-toggle';

import * as AppConstant from '../../constants';

import * as Common from '../../common';

import * as Services from '../../services';

import * as Actions from '../../redux/actions';

import {BackButton, CustomButton, CheckBox} from '../../components';

class EditProfile extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: (
      <Text
        style={{
          color: AppConstant.Colors.black,
          fontSize: wp('5%'),
          fontFamily: AppConstant.Fonts.medium,
        }}>
        Edit Profile
      </Text>
    ),
    headerLeft: (
      <BackButton
        goBack={() => navigation.navigate(navigation.getParam('activeTab'))}
      />
    ),
  });

  state = {
    months: [
      'January',
      'Febuary',
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
    isDateTimePickerVisible: false,
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
  }

  openImagePicker = props => {
    const options = {
      title: 'Select Image',
      takePhotoButtonTitle: 'Take picture',
      chooseFromLibraryButtonTitle: 'Choose from gallery',
      storageOptions: {
        skipBackup: true,
        cameraRoll: false,
      },
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      allowsEditing: true,
      noData: true,
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const image = response.path ? response.path : response.uri;
        props.setFieldValue(
          'image',
          Common.Helper.isAndroid() ? 'file://' + response.path : image,
        );
      }
    });
  };

  showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

  hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  handleDatePicked = (date, props) => {
    props.setFieldValue('dob.day', +date.getDate());
    props.setFieldValue('dob.month', +date.getMonth() + 1);
    props.setFieldValue('dob.year', date.getFullYear() + '');
    this.hideDateTimePicker();
  };

  checkError = (props, fieldName) => {
    return (
      props.errors[fieldName] &&
      (props.touched[fieldName] || props.submitCount > 0)
    );
  };

  toggleYear = props => {
    props.setFieldValue('is_birth_year', !props.values.is_birth_year);
  };

  updateDetails = async details => {
    const previousDetails = {
      first_name: this.props.user.first_name,
      image: this.props.user.image,
      is_birth_year: this.props.user.is_birth_year,
      last_name: this.props.user.last_name,
      dob: {
        day: this.props.user.dob.day,
        year: this.props.user.dob.year,
        month: this.props.user.dob.month,
      },
      is_private: this.props.user.is_private,
    };

    delete details.full_name;

    if (!_.isEqual(details, previousDetails)) {
      this.props.toggleLoader(true);
      details.full_name = `${details.first_name.toLowerCase()} ${details.last_name.toLowerCase()}`;

      if (!_.isEqual(details.image, previousDetails.image)) {
        const uploadUri = !Common.Helper.isAndroid()
          ? details.image.replace('file://', '')
          : details.image;
        details.image = await Common.Helper.uploadFile(
          uploadUri,
          this.props.user.id,
        );
        await Services.NotificationService.update(details.image);
      }

      const updateEvent = {
        ...this.props.event[0],
        name: `birthday#${this.props.user.id}#${
          details.is_birth_year ? details.dob.year : null
        }#${details.first_name} ${details.last_name}`,
        occurrence_date: new Date(
          `${
            new Date().getMonth() + 1 <= details.dob.month
              ? new Date().getFullYear()
              : new Date().getFullYear() + 1
          }/
                     ${details.dob.month}/
                     ${details.dob.day}`,
        ),
      };
      try {
        await Services.OrderService.update({
          first_name: details.first_name,
          last_name: details.last_name,
        });
        await Services.UserService.update(this.props.user.id, details);
        await Services.NetworkService.update(this.props.user.id, details);
        await Services.EventService.updateEvents([updateEvent]);
        this.props.toggleLoader(false);
        Services.AlertService.show(
          'success',
          'Success',
          'Profile updated successfully',
        );
      } catch (error) {
        console.log(error);
        this.props.toggleLoader(false);
        Services.AlertService.show('error', 'Failed', 'Something went wrong');
      }
    } else {
      Services.AlertService.show(
        'info',
        'Info',
        'Please edit fields to update',
      );
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        contentContainerStyle={{flexGrow: 1, paddingHorizontal: wp('10%')}}>
        <Formik
          validateOnChange={false}
          validateOnBlur={true}
          validationSchema={Common.Validations.EditProfileSchema}
          initialValues={{
            first_name: this.props.user.first_name,
            last_name: this.props.user.last_name,
            dob: this.props.user.dob,
            is_birth_year: this.props.user.is_birth_year,
            image: this.props.user.image,
            is_private: this.props.user.is_private || false,
          }}
          onSubmit={(values) => this.updateDetails(values)}>
          {props => {
            return (
              <View style={{flex: 1}}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <TouchableWithoutFeedback
                    onPress={() => this.openImagePicker(props)}>
                    <View
                      style={{
                        width: wp('30%'),
                        marginTop: hp('5%'),
                        marginBottom: hp('7%'),
                        borderRadius: wp('15%'),
                      }}>
                      <FastImage
                        style={{
                          width: wp('30%'),
                          height: wp('30%'),
                          borderRadius: wp('15%'),
                        }}
                        source={
                          props.values.image && props.values.image.length > 0
                            ? {uri: props.values.image}
                            : AppConstant.Images.placeholderAvatar
                        }
                      />
                      <Image
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          right: -5,
                        }}
                        source={AppConstant.Images.editOverlay}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <View style={{flexDirection: 'row'}}>
                    <View style={[styles.inputContainer, {width: '48%'}]}>
                      <Text style={styles.fieldTitle}>
                        First Name
                        <Text style={styles.mandatory}> *</Text>
                      </Text>
                      <TextInput
                        onChangeText={props.handleChange('first_name')}
                        onBlur={props.handleBlur('first_name')}
                        maxLength={15}
                        value={props.values.first_name}
                        style={[
                          styles.textInput,
                          this.checkError(props, 'first_name')
                            ? {borderColor: 'red'}
                            : '',
                        ]}
                        keyboardType={'ascii-capable'}
                      />
                      {this.checkError(props, 'first_name') && (
                        <Text style={styles.error}>
                          {props.errors.first_name}
                        </Text>
                      )}
                    </View>

                    <View
                      style={[
                        styles.inputContainer,
                        {width: '48%', marginLeft: wp('3%')},
                      ]}>
                      <Text style={styles.fieldTitle}>
                        Last Name
                        <Text style={styles.mandatory}> *</Text>
                      </Text>
                      <TextInput
                        onChangeText={props.handleChange('last_name')}
                        onBlur={props.handleBlur('last_name')}
                        maxLength={25}
                        value={props.values.last_name}
                        style={[
                          styles.textInput,
                          this.checkError(props, 'last_name')
                            ? {borderColor: 'red'}
                            : '',
                        ]}
                        keyboardType={'ascii-capable'}
                      />
                      {this.checkError(props, 'last_name') && (
                        <Text style={styles.error}>
                          {props.errors.last_name}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={[styles.inputContainer]}>
                    <Text style={styles.fieldTitle}>
                      Birthday
                      <Text style={styles.mandatory}> *</Text>
                    </Text>
                    <TouchableWithoutFeedback onPress={this.showDateTimePicker}>
                      <View
                        style={{
                          height: 40,
                          borderRadius: 4,
                          borderColor: AppConstant.Colors.inputTextPlaceholder,
                          borderWidth: 1,
                          width: '100%',
                          paddingLeft: 10,
                          marginHorizontal: 2,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: wp('4%'),
                            fontFamily: AppConstant.Fonts.medium,
                            color: AppConstant.Colors.black,
                          }}>{`${
                          this.state.months[props.values.dob.month - 1]
                        } ${props.values.dob.day}${
                          props.values.is_birth_year
                            ? ', ' + props.values.dob.year
                            : ''
                        }`}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                    {!Common.Helper.isAndroid() && (
                      <TouchableWithoutFeedback
                        onPress={() => this.toggleYear(props)}>
                        <View
                          style={{
                            flexDirection: 'row',
                            width: '100%',
                            marginTop: hp('2%'),
                          }}>
                          <CheckBox
                            onClick={() => this.toggleYear(props)}
                            isSelected={props.values.is_birth_year}
                          />
                          <Text
                            style={{
                              marginTop: 2,
                              marginLeft: wp('3%'),
                              fontSize: wp('3.5%'),
                              fontFamily: AppConstant.Fonts.normal,
                              color: AppConstant.Colors.titlePlaceholder,
                            }}>
                            Share my birth year{' '}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                  </View>
                  <DateTimePicker
                    titleIOS=""
                    // maximumDate={new Date()}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={date => this.handleDatePicked(date, props)}
                    onCancel={this.hideDateTimePicker}
                    date={
                      new Date(
                        `${+props.values.dob.year}/${+props.values.dob
                          .month}/${+props.values.dob.day}`,
                      )
                    }
                  />
                  <View style={{width: wp('80%'), marginTop: hp('3%')}}>
                    <Text
                      style={{
                        fontFamily: AppConstant.Fonts.medium,
                        fontSize: wp('3.75%'),
                        color: AppConstant.Colors.black,
                      }}>
                      Privacy Setting
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: hp('1.5%'),
                      }}>
                      <Text
                        style={{
                          fontFamily: AppConstant.Fonts.light,
                          fontSize: wp('4%'),
                          color: AppConstant.Colors.black,
                        }}>
                        Make my profile private
                      </Text>

                      <SwitchToggle
                        containerStyle={{
                          width: 46,
                          height: 25,
                          borderRadius: 20,
                          padding: 3,
                        }}
                        circleStyle={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                        }}
                        switchOn={props.values.is_private}
                        onPress={() =>
                          props.setFieldValue(
                            'is_private',
                            !props.values.is_private,
                          )
                        }
                        backgroundColorOn={AppConstant.Colors.darkGreen}
                        backgroundColorOff={AppConstant.Colors.cancelColor}
                        circleColorOff={AppConstant.Colors.white}
                        circleColorOn={AppConstant.Colors.white}
                        duration={250}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
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
              </View>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: wp('35%'),
    height: wp('35%'),
    backgroundColor: AppConstant.Colors.white,
    marginVertical: hp('3%'),
  },
  titleText: {
    alignSelf: 'center',
    color: AppConstant.Colors.black,
    fontSize: wp('5%'), // 20,
    fontFamily: AppConstant.Fonts.medium,
    // marginTop: hp('5%')
  },
  fieldContainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
    marginTop: hp('5%'),
    width: wp('85%'),
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
    // height: 70,
    width: '100%',
    marginBottom: hp('3%'),
  },
  fieldTitle: {
    alignSelf: 'flex-start',
    color: AppConstant.Colors.titlePlaceholder,
    fontSize: wp('3.5%'), // 20,
    fontFamily: AppConstant.Fonts.normal,
    marginBottom: 4,
  },
  textInput: {
    height: 40,
    borderRadius: 4,
    borderColor: AppConstant.Colors.inputTextPlaceholder,
    borderWidth: 1,
    width: '100%',
    paddingLeft: 20,
    marginHorizontal: 2,
    fontSize: wp('4%'),
    fontFamily: AppConstant.Fonts.medium,
    color: AppConstant.Colors.black,
  },
  buttonText: {
    fontFamily: AppConstant.Fonts.medium,
  },
  mandatory: {
    color: 'red',
  },
  error: {
    color: 'red',
    marginTop: 5,
    alignSelf: 'flex-start',
    fontSize: wp('3%'),
  },
});

// Mapping redux state to props
const mapStateToProps = state => ({
  activeTab: state.common.activeTab,
  user: state.onboard.user,
  event: state.events.months[state.onboard.user.dob.month - 1].events.filter(
    event => {
      return (
        event.name.startsWith('birthday') &&
        event.name.split('#')[1] === state.onboard.user.id
      );
    },
  ),
  networkUsers: _.sortBy(
    state.network.networkUsers,
    ['dob.month', 'dob.day', 'full_name'],
    ['asc', 'asc', 'asc'],
  ),
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
