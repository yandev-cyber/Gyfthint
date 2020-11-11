import React, {Component} from 'react';
import {StatusBar, Text, TextInput} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {Provider} from 'react-redux';
import 'react-native-gesture-handler';

import AppNavigation from './src/navigations';

import {AppLoader,DropdownAlert} from './src/components';

import * as Config from './src/configs';
import * as Services from './src/services';
import * as AppConstant from './src/constants';

const Navigation = createAppContainer(AppNavigation);

const Store = Config.reduxInit();

export default class App extends Component {
  componentDidMount() {
    Config.stripeInit(
      AppConstant.Stripe[
        AppConstant.isProduction ? 'production' : 'development'
      ],
    );
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = true;
    Text.defaultProps.maxFontSizeMultiplier = 1.2;
    TextInput.defaultProps.maxFontSizeMultiplier = 1.2;
  }

  render() {
    return (
      <React.Fragment>
        <Provider store={Store}>
          <StatusBar
            translucent={false}
            animated={true}
            hidden={false}
            backgroundColor={AppConstant.Colors.white}
            barStyle="dark-content"
          />
          <AppLoader />
          <Navigation
            uriPrefix={'gyfthint://'}
            ref={navigatorRef => {
              Services.NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
          <DropdownAlert />
        </Provider>
      </React.Fragment>
    );
  }
}
