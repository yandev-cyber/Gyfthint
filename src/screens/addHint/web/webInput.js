import React, {Component} from 'react';
import {View, Text, BackHandler, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Formik} from 'formik';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {CustomButton, InputField, BackButton} from '../../../components';

import * as AppConstant from '../../../constants';

import * as Common from '../../../common';

class WebInput extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <BackButton
        goBack={() => navigation.navigate(navigation.getParam('activeTab'))}
      />
    ),
  });

  componentDidMount() {
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
    this.props.navigation.navigate(this.props.navigation.getParam('activeTab'));
    return true;
  };

  checkError = (props, fieldName) => {
    return (
      props.errors[fieldName] &&
      (props.touched[fieldName] || props.submitCount > 0)
    );
  };

  render() {
    return (
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}>
        <Text style={styles.header}> Find gifts you'd love to get </Text>
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>
            Enter URL or search with Google to find an
          </Text>
          <Text style={styles.paragraph}>
            item online or online retailer. Click on the
          </Text>
          <Text style={styles.paragraph}>
            item you want and capture the URL of the
          </Text>
          <Text style={styles.paragraph}>item's detail page.</Text>
        </View>
        <Formik
          validateOnChange={false}
          validateOnBlur={true}
          initialValues={{searchKeyword: ''}}
          validationSchema={Common.Validations.WebInputSchema}
          onSubmit={(values) =>
            this.props.navigation.navigate('addHint_web_search', values)
          }>
          {props => {
            return (
              <View style={styles.inputContainer}>
                <NavigationEvents
                  onWillBlur={() => {
                    BackHandler.removeEventListener(
                      'hardwareBackPress',
                      this.handleBackPress,
                    );
                  }}
                  onDidFocus={() => {
                    BackHandler.addEventListener(
                      'hardwareBackPress',
                      this.handleBackPress,
                    );
                  }}
                />

                <InputField
                  onChangeText={props.handleChange('searchKeyword')}
                  onBlur={props.handleBlur('searchKeyword')}
                  value={props.values.url}
                  placeholder="Search"
                  returnKeyType="send"
                  autoCapitalize="none"
                  onSubmitEditing={() => props.handleSubmit()}
                  style={[
                    {width: '80%'},
                    this.checkError(props, 'url') ? {borderColor: 'red'} : '',
                  ]}
                />
                {this.checkError(props, 'url') && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.error}>{props.errors.url}</Text>
                  </View>
                )}

                <CustomButton
                  onClick={() => props.handleSubmit()}
                  title="Go"
                  titleStyle={styles.buttonText}
                  containerStyle={[styles.submitButton]}
                />
              </View>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontFamily: AppConstant.Fonts.bold,
    fontSize: wp('5.5%'),
    color: AppConstant.Colors.black,
  },
  paragraphContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: hp('3%'),
  },
  paragraph: {
    fontFamily: AppConstant.Fonts.normal,
    fontSize: wp('3.75%'),
    color: AppConstant.Colors.black,
  },
  inputContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: hp('7%'),
  },
  submitButton: {
    backgroundColor: AppConstant.Colors.blue,
    marginVertical: hp('3%'),
    width: '30%',
    paddingHorizontal: 0,
    paddingVertical: hp('1%'),
  },
  errorContainer: {
    width: '80%',
    marginTop: 5,
    marginLeft: 5,
  },
  error: {
    color: 'red',
    fontSize: wp('3%'),
  },
});
// Mapping redux state to props
const mapStateToProps = state => ({
  activeTab: state.common.activeTab,
});

export default connect(mapStateToProps, null)(WebInput);
