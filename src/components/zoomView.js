import React, {Component} from 'react';
import {View, Animated} from 'react-native';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';

class ZoomView extends Component {
  _baseScale = new Animated.Value(1);
  _pinchScale = new Animated.Value(1);
  _scale = Animated.multiply(this._baseScale, this._pinchScale);
  _lastScale = 1;
  _onPinchGestureEvent = Animated.event(
    [{nativeEvent: {scale: this._pinchScale}}],
    {useNativeDriver: false},
  );

  _onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale *= event.nativeEvent.scale;
      console.log(event.nativeEvent.scale);
      console.log(event.nativeEvent.velocity);
      console.log(event.nativeEvent.focalX);
      console.log(event.nativeEvent.focalY);
      this.props.setZoom(event.nativeEvent.scale / 10);
      this._baseScale.setValue(this._lastScale);
      this._pinchScale.setValue(1);
    }
  };

  render() {
    return (
      <PinchGestureHandler
        onGestureEvent={this._onPinchGestureEvent}
        onHandlerStateChange={this._onPinchHandlerStateChange}>
        <View style={{flex: 1}} collapsable={false}>
          {this.props.children}
        </View>
      </PinchGestureHandler>
    );
  }
}

export default ZoomView;
