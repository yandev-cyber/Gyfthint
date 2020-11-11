import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

import {CustomButton, BackButton} from '../../components';

import * as AppConstant from '../../constants';

import * as Actions from '../../redux/actions';

class Introduction extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <BackButton
        goBack={() => navigation.navigate(navigation.getParam('activeTab'))}
      />
    ),
  });

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

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'center', marginTop: hp('10%')}}>
          <Text
            style={{
              fontFamily: AppConstant.Fonts.bold,
              fontSize: wp('5.5%'),
              color: AppConstant.Colors.black,
            }}>
            Share who you are and get{' '}
          </Text>
          <Text
            style={{
              fontFamily: AppConstant.Fonts.bold,
              fontSize: wp('5.5%'),
              color: AppConstant.Colors.black,
            }}>
            gifts you'll actually use.
          </Text>
        </View>

        <View style={{alignItems: 'center', marginVertical: hp('15%')}}>
          <Text
            style={{
              fontFamily: AppConstant.Fonts.normal,
              fontSize: wp('4%'),
              color: AppConstant.Colors.black,
            }}>
            Keep in mind where you go, what
          </Text>
          <Text
            style={{
              fontFamily: AppConstant.Fonts.normal,
              fontSize: wp('4%'),
              color: AppConstant.Colors.black,
            }}>
            you do, and what you like, and
          </Text>
          <Text
            style={{
              fontFamily: AppConstant.Fonts.normal,
              fontSize: wp('4%'),
              color: AppConstant.Colors.black,
            }}>
            inspire great gift ideas for your
          </Text>
          <Text
            style={{
              fontFamily: AppConstant.Fonts.normal,
              fontSize: wp('4%'),
              color: AppConstant.Colors.black,
            }}>
            friends and family.
          </Text>
        </View>

        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: AppConstant.Fonts.normal,
              fontSize: wp('4%'),
              color: AppConstant.Colors.blue,
            }}>
            Let's make it happen{' '}
          </Text>
          <CustomButton
            onClick={() => this.props.navigation.navigate('addPreference_q1')}
            title="Begin"
            containerStyle={{
              backgroundColor: AppConstant.Colors.blue,
              marginTop: hp('3%'),
            }}
            iconName
          />
        </View>
      </View>
    );
  }
}

// Mapping redux state to props
const mapStateToProps = state => ({
  activeTab: state.common.activeTab,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Introduction);
