import * as Firebase from 'react-native-firebase';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import * as AppConstant from '../constants';

import * as Services from '../services';

import * as Common from '../common';

let verificationId;

const sendSecurityCode = phoneNumber => {
  return new Promise((resolve, reject) => {
    Firebase.auth()
      .verifyPhoneNumber(phoneNumber, 5, true)
      .on('state_changed', phoneAuthSnapshot => {
        if (
          phoneAuthSnapshot.state === Firebase.auth.PhoneAuthState.CODE_SENT
        ) {
          console.log('code sent');
          verificationId = phoneAuthSnapshot.verificationId;
          resolve(true);
        }
      })
      .catch(err => {
        console.log(err);

        setTimeout(function() {
          Common.Alert.show(
            '',
            'After multiple tries, your number has been blocked temporarily. Please wait for 24 hours to get it unblocked.',
          );
        }, 4000);

        reject(false);
      });
  });
};

const verifySecurityCode = async (code, link = false) => {
  try {
    const credential = Firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code,
    );

    if (link) {
      await facebookFirebaseLogin();
      const user = await Firebase.auth().currentUser.linkWithCredential(
        credential,
      );
      console.log(user);
      return user;
    } else {
      const user = await Firebase.auth().signInWithCredential(credential);
      console.log(user);
      return user;
    }
  } catch (error) {
    console.log(error);

    setTimeout(function() {
      // Common.Alert.show("", AppConstant.Alert.SECURITY_CODE_2);
      Services.AlertService.show(
        'error',
        'Failed',
        AppConstant.Alert.SECURITY_CODE_2,
      );
    }, 2000);

    return false;
  }
};

const customFacebookLogout = async () => {
  try {
    const data = await AccessToken.getCurrentAccessToken();
    console.log(data);
    if (data && data.accessToken) {
      return new Promise((resolve, reject) => {
        let logout = new GraphRequest(
          'me/permissions/',
          {
            accessToken: data.accessToken,
            httpMethod: 'DELETE',
          },
          error => {
            if (error) {
              console.log(error);
              reject(false);
            } else {
              LoginManager.logOut();
              resolve(true);
            }
          },
        );
        new GraphRequestManager().addRequest(logout).start();
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const facebookAuthentication = async () => {
  try {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      // handle this however suites the flow of your app
      console.log('User cancelled request');
      return false;
      // throw new Error('User cancelled request');
    }

    if (result.declinedPermissions.length > 0) {
      setTimeout(function() {
        // Common.Alert.show("", AppConstant.Alert.FACEBOOK_EMAIL_PERMISSION);
        Services.AlertService.show(
          'error',
          'Failed',
          AppConstant.Alert.FACEBOOK_EMAIL_PERMISSION,
        );
      }, 2000);

      return false;
    }

    const data = await AccessToken.getCurrentAccessToken();

    // console.log(data);

    if (!data) {
      // handle this however suites the flow of your app
      // throw new Error('Something went wrong obtaining the users access token');
      console.log('Something went wrong obtaining the users access token');
      return false;
    }
    return new Promise((resolve, reject) => {
      const infoRequest = new GraphRequest(
        '/me',
        {
          accessToken: data.accessToken,
          parameters: {
            fields: {
              string: 'email,first_name,picture,last_name',
            },
          },
        },
        (error, response) => {
          if (error) {
            console.log(error);
            reject(false);
          } else {
            resolve(response);
          }
        },
      );

      // Start the graph request.
      new GraphRequestManager().addRequest(infoRequest).start();
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};

const facebookFirebaseLogin = async () => {
  const data = await AccessToken.getCurrentAccessToken();

  // create a new firebase credential with the token
  const credential = await Firebase.auth.FacebookAuthProvider.credential(
    data.accessToken,
  );

  const firebaseUserCredential = await Firebase.auth().signInWithCredential(
    credential,
  );

  return firebaseUserCredential.user.toJSON();
};

export default {
  sendSecurityCode,
  verifySecurityCode,
  facebookAuthentication,
  facebookFirebaseLogin,
  customFacebookLogout,
};
