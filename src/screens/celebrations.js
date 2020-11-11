// Third Party Liabraries
import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

// Custom Components
import {CheckBox, CustomButton, Loader} from '../components';

// App Constants
import * as AppConstant from '../constants';

// Redux Actions
import * as Actions from '../redux/actions';

// StateFull Component
class Celebrations extends PureComponent {
  // Component Life cycle hooks
  componentDidMount() {
    // Method to get list of all celebrations from firestore
    this.props.getCelebrations();

    // Add listener on android hardware back button
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    // Remove listener from android hardware back button
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  // Method to be called on hardware back press in android
  handleBackPress = () => {
    this.props.navigation.navigate('welcome');
    return true;
  };

  handleSubmit = async () => {
    // const celebrations = await Services.EventService.getEvents(this.props.user.id, AppConstant.Event.HOLIDAY);

    // const eventsToDelete = _.differenceBy(celebrations, this.props.subscribedCelebrations, 'name');

    // const eventsToAdd = _.differenceBy(this.props.subscribedCelebrations, celebrations, 'name');

    // if (eventsToDelete && eventsToDelete.length > 0) {
    //     await Services.EventService.deleteEvents(eventsToDelete);
    // }

    // if (eventsToAdd && eventsToAdd.length > 0) {
    //     await Services.EventService.addEvents(eventsToAdd, this.props.user.id);
    // }
    this.props.navigation.navigate('addCelebrations');
  };

  // JSX to render celebration list row
  renderCelebrationRow = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() =>
        this.props.subscribeCelebrations({
          ...item,
          event_type: AppConstant.Event.HOLIDAY,
        })
      }>
      <View style={{flex: 1, flexDirection: 'row', marginTop: hp('3%')}}>
        <CheckBox
          onClick={() =>
            this.props.subscribeCelebrations({
              ...item,
              event_type: AppConstant.Event.HOLIDAY,
            })
          }
          isSelected={
            this.props.subscribedCelebrations &&
            this.props.subscribedCelebrations.findIndex(
              celebration => celebration.id == item.id,
            ) > -1
          }
        />
        <Text style={styles.textStyle}>{item.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  render() {
    return (
      <View style={styles.container}>
        {/* Text container starts */}
        <View style={{flex: 0.5, marginBottom: hp('5%')}}>
          <Text adjustsFontSizeToFit numberOfLines={2} style={styles.label}>
            Stay organised and add the events you celebrate to the calendar.
          </Text>
        </View>
        {/* Text container ends */}

        {/* Celebrations list container starts  */}
        <View style={{flex: 4}}>
          {this.props.celebrations.length > 0 ? (
            <FlatList
              bounces={false}
              data={this.props.celebrations}
              keyExtractor={item => item.id}
              renderItem={this.renderCelebrationRow}
              extraData={this.props.subscribedCelebrations}
            />
          ) : (
            <Loader style={{flex: 1, justifyContent: 'center'}}/>
          )}
        </View>
        {/* celebrations list container ends */}

        {/* bottom button container starts */}
        <View style={styles.buttonContainer}>
          <CustomButton
            onClick={this.handleSubmit}
            title="Next"
            titleStyle={styles.buttonText}
            iconStyle={{marginLeft: 0}}
            containerStyle={[styles.submitButton]}
            iconName="md-arrow-forward"
          />
        </View>
        {/* bottom button container ends */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: wp('10%'),
    marginBottom: hp('5%'),
    backgroundColor: AppConstant.Colors.white,
  },
  buttonContainer: {
    flex: 0.5,
    // alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp('10%'),
  },
  label: {
    fontSize: wp('4%'), // 16,
    fontFamily: AppConstant.Fonts.normal,
    color: AppConstant.Colors.titlePlaceholder,
    marginTop: hp('3%'),
  },
  textStyle: {
    color: AppConstant.Colors.black,
    fontSize: wp('4.5%'), //18,
    fontFamily: AppConstant.Fonts.normal,
    marginLeft: wp('4%'),
  },
  submitButton: {
    backgroundColor: AppConstant.Colors.lightGreen,
  },
  buttonText: {
    fontFamily: AppConstant.Fonts.medium,
    width: '90%',
    textAlign: 'center',
    // fontSize: 16
  },
});

// Mapping redux state to props
const mapStateToProps = state => ({
  user: state.onboard.user,
  isAuthenticated: state.onboard.isAuthenticated,
  celebrations: state.onboard.celebrations,
  subscribedCelebrations: state.onboard.subscribedCelebrations,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  getCelebrations: () => dispatch(Actions.celebrationsList()),
  subscribeCelebrations: celebration =>
    dispatch(Actions.subscribeCelebrations(celebration)),
  addEvents: events => dispatch(Actions.addEvents(events, 'addCelebrations')),
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Celebrations);
