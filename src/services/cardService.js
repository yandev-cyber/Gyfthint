import * as Firebase from 'react-native-firebase';

import * as Config from '../configs';

import * as AppConstant from '../constants';

import * as Common from '../common';

const addCard = async cardToken => {
  try {
    let tokenId = await Firebase.auth().currentUser.getIdToken();

    const response = await Config.axios.post(
      AppConstant.Api.card,
      {
        card_token: cardToken.tokenId,
      },
      {
        headers: {
          authorization: `Bearer ${tokenId}`,
        },
      },
    );
    if (response.status === 200) {
      return [response.data];
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    if (error && error.response) {
      Common.Alert.show('', error.response.data.message);
    }
    return false;
  }
};

const getAll = async () => {
  try {
    let tokenId = await Firebase.auth().currentUser.getIdToken();

    const response = await Config.axios.get(AppConstant.Api.card, {
      headers: {
        authorization: `Bearer ${tokenId}`,
      },
    });
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    if (error && error.response.data.message) {
      Common.Alert.show('', error.response.data.message);
    }
    return false;
  }
};

const deleteCard = async cardId => {
  try {
    let tokenId = await Firebase.auth().currentUser.getIdToken();

    const response = await Config.axios.delete(
      AppConstant.Api.card + `/${cardId}`,
      {
        headers: {
          authorization: `Bearer ${tokenId}`,
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    if (error && error.response.data.message) {
      Common.Alert.show('', error.response.data.message);
    }
    return false;
  }
};

export default {
  addCard,
  getAll,
  deleteCard,
};
