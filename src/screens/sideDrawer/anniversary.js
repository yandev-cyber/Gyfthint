import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

import * as AppConstant from '../../constants';

import {BackButton} from '../../components';

class Anniversary extends Component {
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
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: wp('4%'),
            fontFamily: AppConstant.Fonts.normal,
            color: AppConstant.Colors.black,
          }}>
          Coming Soon...
        </Text>
      </View>
    );
  }
}

// Mapping redux state to props
const mapStateToProps = state => ({
  activeTab: state.common.activeTab,
});

export default connect(mapStateToProps, null)(Anniversary);
