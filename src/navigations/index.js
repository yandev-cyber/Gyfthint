import React from 'react';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';
import onboardingStack from './onboarding.stack';
import landingStack from './landing.stack';
import addHintStack from './addHint.stack';

import * as Screen from '../screens';

export default createAnimatedSwitchNavigator(
  {
    splash: Screen.Splash,
    onboarding: onboardingStack,
    landing: landingStack,
    addHint: addHintStack,
  },
  {
    transition: (
      <Transition.Together>
        <Transition.Out type="fade" durationMs={0} interpolation="easeOut" />
        <Transition.In type="fade" durationMs={250} />
      </Transition.Together>
    ),
  },
);
