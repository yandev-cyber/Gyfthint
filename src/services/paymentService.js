import * as Firebase from 'react-native-firebase';

import * as Config from '../configs';

import * as AppConstant from '../constants';

import * as Common from '../common';

const createCharge = async (amount, token) => {
  try {
    let tokenId = await Firebase.auth().currentUser.getIdToken();
    const response = await Config.axios.post(
      AppConstant.Api.payment,
      {
        amount: amount,
        token: token,
      },
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
  createCharge,
};
