import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';

import {Loader} from '../../../components';

import * as Actions from '../../../redux/actions';

import * as AppConstant from '../../../constants';

class WebSearch extends Component {
  state = {
    showLoader: false,
  };

  componentDidMount() {
    this.props.getSearch(this.props.navigation.getParam('searchKeyword'), 1);
  }

  loadMore = () => {
    if (this.props.hasMore && this.props.startIndex < 100) {
      let searchKeyword = this.props.navigation.getParam('searchKeyword');
      this.props.getSearch(searchKeyword, this.props.startIndex);
    }
  };

  renderItemRow = ({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          this.props.navigation.navigate('addHint_web', {
            url: item.formattedUrl,
          })
        }>
        <View
          style={{
            height: hp('15%'),
            justifyContent: 'space-evenly',
            marginVertical: 15,
            backgroundColor: 'white',
          }}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              width: '75%',
              lineHeight: 30,
              color: AppConstant.Colors.black,
              fontSize: wp('4.25%'),
              fontFamily: AppConstant.Fonts.medium,
            }}>
            {item.title}
          </Text>
          <View style={{alignSelf: 'flex-start', height: 30}}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{
                color: AppConstant.Colors.salmon,
                fontSize: wp('3.75%'),
                fontFamily: AppConstant.Fonts.medium,
              }}>
              {item.formattedUrl}
            </Text>
            <View
              style={{height: 1, backgroundColor: AppConstant.Colors.salmon}}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item.pagemap && item.pagemap.cse_thumbnail && (
              <Image
                style={{
                  width: 60,
                  height: 60,
                  marginRight: 10,
                }}
                source={{uri: item.pagemap.cse_thumbnail[0].src}}
              />
            )}
            <Text
              ellipsizeMode="tail"
              numberOfLines={3}
              style={{
                flex: 1,
                lineHeight: 20,
                flexWrap: 'wrap',
                color: AppConstant.Colors.orText,
                fontSize: wp('3.25%'),
                fontFamily: AppConstant.Fonts.normal,
              }}>
              {item.snippet}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <NavigationEvents
          onWillBlur={() => this.props.resetSearch()}
          onWillFocus={() => {
            this.setState({showLoader: true});
            this.props.getSearch(
              this.props.navigation.getParam('searchKeyword'),
              1,
            );
            setTimeout(() => {
              this.setState({showLoader: false});
            }, 3000);
          }}
        />
        {this.props.searchResults.length ? (
          <FlatList
            bounces={false}
            keyboardShouldPersistTaps="handled"
            data={this.props.searchResults}
            style={{width: '100%'}}
            contentContainerStyle={{
              paddingTop: 15,
              paddingBottom: 20,
              paddingHorizontal: wp('7%'),
              width: '100%',
            }}
            extraData={this.props.searchResults}
            keyExtractor={(item, index) => index + ''}
            renderItem={this.renderItemRow}
            onEndReached={this.loadMore}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {this.state.showLoader ? (
              <Loader style={{flex: 1, justifyContent: 'center'}}/>
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: wp('4%'),
                  fontFamily: AppConstant.Fonts.normal,
                  color: AppConstant.Colors.black,
                }}>
                No results found
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  searchResults: state.googleSearch.searchResults,
  hasMore: state.googleSearch.hasMore,
  startIndex: state.googleSearch.startIndex,
});

const mapDispatchTopProps = dispatch => ({
  getSearch: (searchKeyword, startIndex) => {
    dispatch(Actions.getSearchResults(searchKeyword, startIndex));
  },
  resetSearch: () => {
    dispatch({
      type: AppConstant.ActionTypes.SAVE_GOOGLE_SEARCH_RESULTS,
      payload: {
        results: [],
        startIndex: 1,
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchTopProps)(WebSearch);
