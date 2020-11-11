import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import CustomModal from '../components/customModal';
import Loader from '../components/loader';


class AppLoader extends Component {
  render() {
    return (
      <CustomModal isVisible={this.props.isLoading}>
        <View style={styles.container}>
          <Loader style={{zIndex: 1}}/>
        </View>
      </CustomModal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

const mapStateToProps = state => ({
  isLoading: state.common.isLoading,
});

export default connect(mapStateToProps, null)(AppLoader);
