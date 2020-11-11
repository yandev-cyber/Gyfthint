import React, {Component} from 'react';
import {View, BackHandler} from 'react-native';
import Swiper from 'react-native-swiper';

import Slide1 from './slide1';
import Slide3 from './slide3';
import Slide4 from './slide4';

class Tutorials extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('welcome');
    return true;
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Swiper
          containerStyle={{flex: 1}}
          loop={false}
          autoplay={false}
          showsButtons={false}
          removeClippedSubviews={false}
          dotStyle={{
            width: 6,
            height: 6,
            borderRadius: 3,
          }}
          activeDotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
          }}
          dotColor="rgb(228,228,228)"
          activeDotColor="rgba(228,228,228,0.5)">
          <Slide1 {...this.props} />
          {/* <Slide2 {...this.props} /> */}
          <Slide3 {...this.props} />
          <Slide4 {...this.props} />
        </Swiper>
      </View>
    );
  }
}

export default Tutorials;
