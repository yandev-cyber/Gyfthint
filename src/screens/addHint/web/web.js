import React, {Component} from 'react';
import {View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';
import {NavigationEvents} from 'react-navigation';

import {Loader, InputField} from '../../../components';

import * as AppConstant from '../../../constants';

import * as Actions from '../../../redux/actions';

import * as Common from '../../../common';

import * as Services from '../../../services';

class Web extends Component {
  state = {
    url: '',
    currentUrl: '',
    isLoading: false,
    fieldNumber: 1,
  };

  componentDidMount() {
    let url = this.props.navigation.getParam('url');
    this.setState({
      url,
    });
  }

  _onNavigationStateChange(webViewState) {
    this.setState({currentUrl: webViewState.url});
  }

  activeButton = props => {
    switch (this.state.fieldNumber) {
      case AppConstant.Status.webForm.NAME:
        return Boolean(props.values.name);
      case AppConstant.Status.webForm.PRICE:
        return Boolean(props.values.price >= 1);
      default:
        return true;
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}>
        {this.state.url.length > 0 && (
          <React.Fragment>
            {this.state.isLoading && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <Loader/>
              </View>
            )}
            <WebView
              source={{uri: this.state.url}}
              onNavigationStateChange={this._onNavigationStateChange.bind(this)}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              useWebKit={true}
              startInLoadingState={false}
              allowsLinkPreview={true}
              injectedJavaScript={`
                                    (function() {
                                    function wrap(fn) {
                                        return function wrapper() {
                                        var res = fn.apply(this, arguments);
                                        window.ReactNativeWebView.postMessage(window.location.href);
                                        return res;
                                        }
                                    }

                                    history.pushState = wrap(history.pushState);
                                    history.replaceState = wrap(history.replaceState);
                                    window.addEventListener('popstate', function() {
                                        window.ReactNativeWebView.postMessage(window.location.href);
                                    });
                                    })();

                                    true;
                                `}
              onMessage={({nativeEvent: state}) => {
                this.setState({currentUrl: state.data});
              }}
              onError={() => {
                Common.Alert.show('', 'Webpage not found', {
                  type: 'redirect',
                  routeName: 'addHint_web_input',
                  execute: Services.NavigationService.navigate,
                });
              }}
            />
            <View
              style={{
                height: hp('12%'),
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                backgroundColor: AppConstant.Colors.blue,
                shadowColor: AppConstant.Colors.black,
                shadowOpacity: 0.15,
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowRadius: 34,
                elevation: 10,
              }}>
              <Text
                style={{
                  fontFamily: AppConstant.Fonts.normal,
                  fontSize: wp('3.5%'),
                  color: AppConstant.Colors.orText,
                }}>
                Found it!
              </Text>

              <Formik
                ref={ref => (this.form = ref)}
                validateOnChange={true}
                validateOnBlur={true}
                validationSchema={Common.Validations.WebFormSchema}
                initialValues={{
                  price: '',
                  name: '',
                  image: '',
                  brand: '',
                  store: '',
                  category: '',
                  color_type: '',
                  size_model: '',
                  detail: '',
                  feedback: '',
                  url: '',
                  sku: '',
                  type: '',
                }}
                onSubmit={(values) => {
                  console.log(_.size(AppConstant.Status.webForm));
                  if (
                    _.size(AppConstant.Status.webForm) ===
                    this.state.fieldNumber
                  ) {
                    this.props.navigation.navigate(
                      this.props.address && this.props.address.line_1.length > 0
                        ? 'addHint_web_preview'
                        : 'addHint_address',
                      {
                        formValues: {
                          ...values,
                          url: this.state.currentUrl,
                          type: AppConstant.Status.hintType.WEB,
                        },
                      },
                    );
                  } else {
                    this.setState({
                      fieldNumber: this.state.fieldNumber + 1,
                    });
                  }
                }}>
                {props => {
                  return (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <NavigationEvents
                        onDidBlur={() => {
                          this.setState({fieldNumber: 1});
                        }}
                        onDidFocus={() => {
                          if (this.props.navigation.getParam('addAnother')) {
                            props.resetForm();
                          }
                        }}
                      />

                      {this.state.fieldNumber ===
                      AppConstant.Status.webForm.NAME && (
                        <React.Fragment>
                          <View
                            style={{
                              width: '20%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontFamily: AppConstant.Fonts.normal,
                                fontSize: wp('3.5%'),
                                color: AppConstant.Colors.orText,
                              }}>
                              Name:
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              backgroundColor: AppConstant.Colors.white,
                              borderRadius: 15,
                              width: '55%',
                              height: 30,
                              justifyContent: 'center',
                              alignItems: 'center',
                              shadowColor: AppConstant.Colors.black,
                              shadowOpacity: 0.12,
                              shadowOffset: {
                                width: 0,
                                height: 3,
                              },
                              shadowRadius: 6,
                              elevation: 1.5,
                            }}>
                            <InputField
                              onChangeText={props.handleChange('name')}
                              onBlur={props.handleBlur('name')}
                              value={props.values.name}
                              keyboardType={'ascii-capable'}
                              returnKeyType="done"
                              maxLength={30}
                              style={{
                                width: '100%',
                                borderBottomWidth: 0,
                                paddingBottom: 0,
                                paddingLeft: 10,
                                color: AppConstant.Colors.black,
                                fontFamily: AppConstant.Fonts.medium,
                                fontSize: wp('4%'),
                              }}
                            />
                          </View>
                        </React.Fragment>
                      )}

                      {this.state.fieldNumber ===
                      AppConstant.Status.webForm.PRICE && (
                        <React.Fragment>
                          <View
                            style={{
                              width: '20%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontFamily: AppConstant.Fonts.normal,
                                fontSize: wp('3.5%'),
                                color: AppConstant.Colors.orText,
                              }}>
                              Price:
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              backgroundColor: AppConstant.Colors.white,
                              borderRadius: 15,
                              width: '55%',
                              height: 30,
                              justifyContent: 'center',
                              alignItems: 'center',
                              shadowColor: AppConstant.Colors.black,
                              shadowOpacity: 0.12,
                              shadowOffset: {
                                width: 0,
                                height: 3,
                              },
                              shadowRadius: 6,
                              elevation: 1.5,
                            }}>
                            <Text
                              style={{
                                color: AppConstant.Colors.black,
                                fontFamily: AppConstant.Fonts.medium,
                                fontSize: wp('4%'),
                              }}>
                              $
                            </Text>
                            <InputField
                              onChangeText={props.handleChange('price')}
                              onBlur={props.handleBlur('price')}
                              value={props.values.price}
                              keyboardType={'numeric'}
                              returnKeyType="done"
                              maxLength={6}
                              style={{
                                width: '85%',
                                borderBottomWidth: 0,
                                paddingBottom: 0,
                                color: AppConstant.Colors.black,
                                fontFamily: AppConstant.Fonts.medium,
                                fontSize: wp('4%'),
                              }}
                            />
                          </View>
                        </React.Fragment>
                      )}

                      {this.state.fieldNumber ===
                      AppConstant.Status.webForm.COLOR && (
                        <React.Fragment>
                          <View
                            style={{
                              width: '20%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontFamily: AppConstant.Fonts.normal,
                                fontSize: wp('3.5%'),
                                color: AppConstant.Colors.orText,
                              }}>
                              Color/
                            </Text>
                            <Text
                              style={{
                                fontFamily: AppConstant.Fonts.normal,
                                fontSize: wp('3.5%'),
                                color: AppConstant.Colors.orText,
                              }}>
                              Type:
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              backgroundColor: AppConstant.Colors.white,
                              borderRadius: 15,
                              width: '55%',
                              height: 30,
                              justifyContent: 'center',
                              alignItems: 'center',
                              shadowColor: AppConstant.Colors.black,
                              shadowOpacity: 0.12,
                              shadowOffset: {
                                width: 0,
                                height: 3,
                              },
                              shadowRadius: 6,
                              elevation: 1.5,
                            }}>
                            <InputField
                              onChangeText={props.handleChange('color_type')}
                              onBlur={props.handleBlur('color_type')}
                              value={props.values.color_type}
                              keyboardType={'ascii-capable'}
                              returnKeyType="done"
                              maxLength={30}
                              style={{
                                width: '100%',
                                borderBottomWidth: 0,
                                paddingBottom: 0,
                                paddingLeft: 10,
                                color: AppConstant.Colors.black,
                                fontFamily: AppConstant.Fonts.medium,
                                fontSize: wp('4%'),
                              }}
                            />
                          </View>
                        </React.Fragment>
                      )}

                      {this.state.fieldNumber ===
                      AppConstant.Status.webForm.SIZE && (
                        <React.Fragment>
                          <View
                            style={{
                              width: '20%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontFamily: AppConstant.Fonts.normal,
                                fontSize: wp('3.5%'),
                                color: AppConstant.Colors.orText,
                              }}>
                              Size/
                            </Text>
                            <Text
                              style={{
                                fontFamily: AppConstant.Fonts.normal,
                                fontSize: wp('3.5%'),
                                color: AppConstant.Colors.orText,
                              }}>
                              Model:
                            </Text>
                          </View>
                          <View style={{width: '55%'}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                backgroundColor: AppConstant.Colors.white,
                                borderRadius: 15,
                                // width: "55%",
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                shadowColor: AppConstant.Colors.black,
                                shadowOpacity: 0.12,
                                shadowOffset: {
                                  width: 0,
                                  height: 3,
                                },
                                shadowRadius: 6,
                                elevation: 1.5,
                              }}>
                              <InputField
                                onChangeText={props.handleChange('size_model')}
                                onBlur={props.handleBlur('size_model')}
                                value={props.values.size_model}
                                keyboardType={'ascii-capable'}
                                returnKeyType="done"
                                maxLength={30}
                                style={{
                                  width: '100%',
                                  borderBottomWidth: 0,
                                  paddingBottom: 0,
                                  paddingLeft: 10,
                                  color: AppConstant.Colors.black,
                                  fontFamily: AppConstant.Fonts.medium,
                                  fontSize: wp('4%'),
                                }}
                              />
                            </View>
                            <Text
                              style={{
                                marginVertical: 5,
                                fontSize: wp('2.5%'),
                                color: AppConstant.Colors.black,
                                fontFamily: AppConstant.Fonts.light,
                              }}>
                              Size isn't visible to other users
                            </Text>
                          </View>
                        </React.Fragment>
                      )}

                      <View
                        style={{
                          width: '25%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableWithoutFeedback
                          onPress={
                            this.activeButton(props) ? props.handleSubmit : null
                          }>
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 20,
                              backgroundColor: this.activeButton(props)
                                ? AppConstant.Colors.darkGreen
                                : AppConstant.Colors.lightGray,
                              shadowColor: AppConstant.Colors.black,
                              shadowOpacity: 0.16,
                              shadowOffset: {
                                width: 0,
                                height: 3,
                              },
                              shadowRadius: 6,
                              elevation: 10,
                            }}>
                            <Image source={AppConstant.Images.rightArrowIcon}/>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                  );
                }}
              </Formik>
              <View/>
            </View>
          </React.Fragment>
        )}
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => ({
  address: state.onboard.user.shipping_address,
});

// Mapping redux actions to props
const mapDispatchToProps = dispatch => ({
  toggleLoader: state => dispatch(Actions.toggleLoader(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Web);
