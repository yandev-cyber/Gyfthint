import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import * as AppConstant from '../constants';

export default props => {
  let isDateSelected =
    Object.values(props.values[Object.keys(props.values)[0]]).length === 0;
  let months = [
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
  ];
  return (
    <TouchableWithoutFeedback onPress={props.showDateTimePicker}>
      <View style={[props.style, styles.container]}>
        <View style={styles.inputFieldContainer}>
          <Text
            style={
              isDateSelected ? styles.inputFieldPlaceholder : styles.inputField
            }>
            {isDateSelected
              ? 'Month'
              : months[props.values[Object.keys(props.values)[0]].month]}{' '}
          </Text>
          <Image
            style={styles.dropDownIcon}
            source={AppConstant.Images.dropDownIcon}
          />
        </View>
        <View style={styles.inputFieldContainer}>
          <Text
            style={
              isDateSelected ? styles.inputFieldPlaceholder : styles.inputField
            }>
            {isDateSelected
              ? 'Day'
              : props.values[Object.keys(props.values)[0]].day}{' '}
          </Text>
          <Image
            style={styles.dropDownIcon}
            source={AppConstant.Images.dropDownIcon}
          />
        </View>
        {(props.values.is_birth_year ||
          Object.keys(props.values)[0] === 'occurrence_date') && (
          <View style={styles.inputFieldContainer}>
            <Text
              style={
                isDateSelected
                  ? styles.inputFieldPlaceholder
                  : styles.inputField
              }>
              {isDateSelected
                ? 'Year'
                : props.values[Object.keys(props.values)[0]].year}{' '}
            </Text>
            <Image
              style={styles.dropDownIcon}
              source={AppConstant.Images.dropDownIcon}
            />
          </View>
        )}
        <DateTimePicker
          titleIOS=""
          maximumDate={props.maximumDate}
          isVisible={props.isDateTimePickerVisible}
          onConfirm={date => props.handleDatePicked(date, props)}
          onCancel={props.hideDateTimePicker}
          //   date={new Date(`${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  inputFieldContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: AppConstant.Colors.separator,
    marginRight: wp('2%'),
  },
  inputField: {
    width: wp('20%'),
    padding: 0,
    color: AppConstant.Colors.black,
    fontSize: 16,
    fontFamily: AppConstant.Fonts.light,
    paddingBottom: hp('1%'),
    paddingLeft: wp('1%'),
  },
  inputFieldPlaceholder: {
    width: wp('20%'),
    color: AppConstant.Colors.inputTextPlaceholder,
    padding: 0,
    fontSize: 16,
    fontFamily: AppConstant.Fonts.light,
    paddingBottom: hp('1%'),
    paddingLeft: wp('1%'),
  },
  dropDownIcon: {
    marginTop: hp('1%'),
    marginLeft: hp('1%'),
  },
});
