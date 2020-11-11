import React, {Component} from 'react';
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
import _ from 'lodash';
import {NavigationEvents} from 'react-navigation';

// Custom Components
import {CheckBox, CustomButton, Loader, BackButton} from '../../components';

// App Constants
import * as AppConstant from '../../constants';

// Redux Actions
import * as Actions from '../../redux/actions';

// Services
import * as Services from '../../services';

class ManageCelebrations extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: (
      <Text
        style={{
          color: AppConstant.Colors.black,
          fontSize: wp('5%'),
          fontFamily: AppConstant.Fonts.medium,
        }}>
        Manage Holidays
      </Text>
    ),
    headerLeft: (
      <BackButton
        goBack={() => navigation.navigate(navigation.getParam('activeTab'))}
      />
    ),
  });

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

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
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('MY DASHBOARD');
    return true;
  };

  getSubscribedCelebration = async () => {
    this.props.toggleLoader(true);
    let subscribedCelebrations = await Services.EventService.getEvents(
      this.props.user.id,
      AppConstant.Event.HOLIDAY,
    );
    subscribedCelebrations = this.props.celebrations.filter(item => {
      return (
        subscribedCelebrations.findIndex(
          celebration => celebration.name === item.name,
        ) > -1
      );
    });
    this.props.getSubscribeCelebrations(subscribedCelebrations);
    this.props.toggleLoader(false);
  };

  handleSubmit = async () => {
    try {
      this.props.toggleLoader(true);
      const celebrations = await Services.EventService.getEvents(
        this.props.user.id,
        AppConstant.Event.HOLIDAY,
      );

      const eventsToDelete = _.differenceBy(
        celebrations,
        this.props.subscribedCelebrations,
        'name',
      );

      const eventsToAdd = _.differenceBy(
        this.props.subscribedCelebrations,
        celebrations,
        'name',
      );

      if (eventsToDelete && eventsToDelete.length > 0) {
        await Services.EventService.deleteEvents(eventsToDelete);
      }

      if (eventsToAdd && eventsToAdd.length > 0) {
        await Services.EventService.addEvents(eventsToAdd, this.props.user.id);
      }

      this.props.toggleLoader(false);
      Services.AlertService.show(
        'success',
        'Success',
        'Holidays updated successfully',
      );
    } catch (error) {
      console.log(error);
      this.props.toggleLoader(false);
      Services.AlertService.show('error', 'Failed', 'Something went wrong');
    }
  };

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
              celebration => celebration.id === item.id,
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
        <NavigationEvents
          onDidFocus={() => this.getSubscribedCelebration()}
        />

        {/* Celebrations list container starts  */}
        <View style={{flex: 0.7, marginVertical: hp('2%')}}>
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
            title="Done"
            titleStyle={styles.buttonText}
            iconStyle={{marginLeft: 0}}
            containerStyle={[styles.submitButton]}
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
    justifyContent: 'center',
    marginHorizontal: wp('10%'),
    // marginBottom: hp('5%'),
    backgroundColor: AppConstant.Colors.white,
  },
  buttonContainer: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: AppConstant.Colors.blue,
  },
  buttonText: {
    fontFamily: AppConstant.Fonts.medium,
    // width: '90%',
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
  activeTab: state.common.activeTab,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  getCelebrations: () => dispatch(Actions.celebrationsList()),
  subscribeCelebrations: celebration =>
    dispatch(Actions.subscribeCelebrations(celebration)),
  addEvents: events => dispatch(Actions.addEvents(events, 'addCelebrations')),
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
  getSubscribeCelebrations: celebrations =>
    dispatch({
      type: AppConstant.ActionTypes.SUBSCRIBE_CELEBRATION,
      payload: {
        data: celebrations,
      },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageCelebrations);
