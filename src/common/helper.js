import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Dimensions, Image, Keyboard, Platform, Share} from 'react-native';
import * as Firebase from 'react-native-firebase';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import _ from 'lodash';
import URL from 'url';

import * as AppConstant from '../constants';
import * as Services from '../services';
import {Alert} from '../common';

const isDeviceHaveNotch = () => {
  return getStatusBarHeight() >= 44;
};

const screenSize = () => {
  return Dimensions.get('window');
};

const isAndroid = () => {
  return Platform.OS === 'android';
};

const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const clearData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const checkConnection = async () => {
  return (await NetInfo.fetch()).isConnected;
};

const saveImage = async image => {
  try {
    let path =
      RNFS.DocumentDirectoryPath +
      '/' +
      Date.now() +
      '.' +
      image.split(';')[0].split('/')[1];

    await RNFS.writeFile(path, image.split(',')[1], 'base64');
    return isAndroid() ? 'file://' + path : path;
  } catch (error) {
    console.log(error);
  }
};

const uploadFile = async (file, userId) => {
  try {
    let filePath = file;
    if (file.startsWith('data:')) {
      filePath = await saveImage(file);
    }
    const result = await Firebase.storage()
      .ref(`${userId}/${Date.now()}`)
      .putFile(`${filePath}`);
    if (result.state === 'success') {
      return result.downloadURL;
    } else {
      console.log(result);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const trimObj = obj => {
  try {
    if (!Array.isArray(obj) && typeof obj != 'object') {
      return obj;
    }
    return Object.keys(obj).reduce(
      function(acc, key) {
        acc[key.trim()] =
          typeof obj[key] == 'string' ? obj[key].trim() : trimObj(obj[key]);
        return acc;
      },
      Array.isArray(obj) ? [] : {},
    );
  } catch (error) {
    console.log(error);
  }
};

const getFormattedDate = date => {
  date = new Date(date.toDate());
  let year = date.getFullYear().toString();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date
    .getDate()
    .toString()
    .padStart(2, '0');
  return month + '/' + day + '/' + year.slice(2);
};

const socialShare = async () => {
  try {
    const result = await Share.share({
      message: `Hey, please download GyftHint! This is going to make our lives so much easier when it comes to buying gifts for each other! We'll be able to see each other's gift ideas and we can buy gifts straight from the app. ${AppConstant.Api.dashboardDeeplink}`,
    });

    Services.AnalyticsService.logEvent(
      AppConstant.AnalyticsEvents.INVITE_TAPPED,
    );

    console.log(result);

  } catch (error) {
    console.log('error: ', error);
  }
};

const createShortLink = async id => {
  const link = new Firebase.links.DynamicLink(
    `https://com.gyfthint.app/?route=user-detail&&id=${id}`,
    `${AppConstant.Api.deepLinkPrefix}`,
  ).android
    .setPackageName('com.gyfthint.app')
    .ios.setBundleId('com.gyfthint.app');

  try {
    return await Firebase.links().createShortDynamicLink(link, 'SHORT');
  } catch (error) {
    console.log(error);
  }
};

const parseUrl = link => {
  let url = URL.parse(link);
  return _.chain(url.search)
    .replace('?', '')
    .split('&')
    .map(_.partial(_.split, _, '=', 2))
    .fromPairs()
    .value();
};

const dismissKeyboard = () => {
  Keyboard.dismiss();
};

const showConnectionAlert = () => {
  Alert.show('Connection', 'Please check your internet connection', null, [
    {
      text: 'retry',
      onPress: async () => {
        console.log(await checkConnection());
        if (!(await checkConnection())) {
          showConnectionAlert();
        }
      },
    },
  ]);
};

const networkChangeListener = () => {
  NetInfo.addEventListener(state => {
    if (!state.isConnected) {
      showConnectionAlert();
    }
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
  });
};

const calculateImageHeight = (src, toWidth) => {
  let toHeight = 0;
  return new Promise((resolve, reject) => {
    if (typeof src === 'number') {
      const {width, height} = Image.resolveAssetSource(src);
      resolve((toHeight = (toWidth * height) / width));
    } else {
      Image.getSize(
        src,
        (width, height) => {
          if (!width || !height) {
            resolve(toHeight);
          }
          resolve((toHeight = (toWidth * height) / width));
        },
        err => {
          console.log(err);
          reject(false);
        },
      );
    }
  });
};

export default {
  isDeviceHaveNotch,
  isAndroid,
  saveData,
  getData,
  clearData,
  checkConnection,
  uploadFile,
  trimObj,
  getFormattedDate,
  screenSize,
  socialShare,
  createShortLink,
  parseUrl,
  dismissKeyboard,
  networkChangeListener,
  calculateImageHeight,
};
