import * as Firebase from 'react-native-firebase';

import * as Config from '../configs';

import * as AppConstant from '../constants';

// const db = Config.db,
const db = Firebase.firestore(),
  notificationRef = db.collection('notifications'),
  usersRef = db.collection('users');

const add = async (sender, receiver, type) => {
  try {
    let docRef = notificationRef.doc(),
      notification = {
        id: docRef.id,
        created_at: Firebase.firestore.FieldValue.serverTimestamp(),
        type: type,
        sender: {
          user_id: sender.id,
          first_name: sender.first_name,
          last_name: sender.last_name,
          full_name: sender.full_name,
          email: sender.email,
          dob: sender.dob,
          image: sender.image,
          phone: sender.phone,
          is_birth_year: sender.is_birth_year,
        },
        receiver: {
          user_id: receiver.id,
          first_name: receiver.first_name,
          last_name: receiver.last_name,
          full_name: receiver.full_name,
          email: receiver.email,
          dob: receiver.dob,
          image: receiver.image,
          phone: receiver.phone,
          is_birth_year: receiver.is_birth_year,
        },
      };

    let badgeCount = 0;
    if (receiver.fbiid) {
      badgeCount = receiver.badgeCount ? receiver.badgeCount + 1 : 1;
      sendNotification(receiver.fbiid, badgeCount);
    }

    await usersRef.doc(receiver.id).update({
      has_new_notification: true,
      badgeCount: badgeCount,
    });

    await notificationRef.doc(docRef.id).set(notification);
    return notification;
  } catch (error) {
    console.log(error);
  }
};

const get = async (userId, cursor) => {
  try {
    let notifications = [],
      query = notificationRef
        .where('receiver.user_id', '==', userId)
        .orderBy('created_at', 'desc')
        .limit(30)
        .get();

    if (cursor) {
      let lastNotification = await notificationRef.doc(cursor.id).get();
      query = notificationRef
        .where('receiver.user_id', '==', userId)
        .orderBy('created_at', 'desc')
        .startAfter(lastNotification)
        .limit(30)
        .get();
    }

    const querySnapshot = await query;

    querySnapshot.forEach(doc => {
      notifications.push(doc.data());
    });

    return notifications;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const update = async image => {
  try {
    let userId = Firebase.auth().currentUser.uid;
    const notificationSend = await notificationRef
      .where('sender.user_id', '==', userId)
      .get();

    const notificationRecieve = await notificationRef
      .where('receiver.user_id', '==', userId)
      .get();

    notificationSend.forEach(async doc => {
      await notificationRef.doc(doc.id).update({'sender.image': image});
    });

    notificationRecieve.forEach(async doc => {
      await notificationRef.doc(doc.id).update({'receiver.image': image});
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const remove = async notificationId => {
  try {
    await notificationRef.doc(notificationId).delete();
  } catch (error) {
    console.log(error);
    return false;
  }
};

const generateToken = async () => {
  try {
    const fcmToken = await Firebase.messaging().getToken();
    if (fcmToken) {
      return fcmToken;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const sendNotification = async (fbiid, badgeCount) => {
  try {
    let tokenId = await Firebase.auth().currentUser.getIdToken();
    await Config.axios.get(AppConstant.Api.pushNotification, {
      params: {
        fbiid,
        badgeCount,
      },
      headers: {
        authorization: `Bearer ${tokenId}`,
      },
    });
  } catch (error) {
    //  Common.Alert.show('', AppConstant.Alert.SERVER_ERROR);
    console.log(error);
    return false;
  }
};

const resetNotificationBadgeCount = async () => {
  await Firebase.notifications().removeAllDeliveredNotifications();
};

export default {
  add,
  get,
  remove,
  update,
  generateToken,
  sendNotification,
  resetNotificationBadgeCount,
};
