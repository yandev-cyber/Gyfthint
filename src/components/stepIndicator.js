import React from 'react';
import StepIndicator from 'react-native-step-indicator';

export default props => {
  return (
    <StepIndicator
      customStyles={{
        stepIndicatorSize: 32,
        currentStepIndicatorSize: 32,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 1,
        stepStrokeCurrentColor: 'rgb(137,207,212)',
        stepStrokeWidth: 1,
        stepStrokeFinishedColor: 'rgb(137,207,212)',
        stepStrokeUnFinishedColor: 'rgb(137,207,212)',
        separatorFinishedColor: 'rgb(137,207,212)',
        separatorUnFinishedColor: 'rgb(137,207,212)',
        stepIndicatorFinishedColor: 'rgb(175,223,226)',
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 17,
        currentStepIndicatorLabelFontSize: 17,
        stepIndicatorLabelCurrentColor: 'rgb(137,207,212)',
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: 'rgb(137,207,212)',
      }}
      currentPosition={props.currentPosition}
      stepCount={6}
    />
  );
};
