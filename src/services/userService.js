import * as Firebase from 'react-native-firebase';

import * as Config from '../configs';

import * as AppConstant from '../constants';

const db = Firebase.firestore(),
  usersRef = db.collection('users');

const add = async userDetails => {
  try {
    await usersRef.doc(userDetails.id).set({
      id: userDetails.id,
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      full_name: `${userDetails.first_name.toLowerCase()} ${userDetails.last_name.toLowerCase()}`,
      phone: userDetails.countryCode + userDetails.phone,
      dob: {
        day: userDetails.dob.day,
        month: userDetails.dob.month + 1,
        year: userDetails.dob.year,
      },
      image: userDetails.image || '',
      email: userDetails.email || '',
      customer_id: '',
      is_private: false,
      created_at: Firebase.firestore.FieldValue.serverTimestamp(),
      has_new_notification: false,
      is_birth_year: userDetails.is_birth_year,
      active: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const get = async userId => {
  try {
    const user = await usersRef
      .doc(userId ? userId : Firebase.auth().currentUser.uid)
      .get();

    return user.data();
  } catch (error) {
    console.log(error);
    return false;
  }
};

const update = async (id, userDetails) => {
  try {
    await usersRef
      .doc(id ? id : Firebase.auth().currentUser.uid)
      .update(userDetails);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const checkExistence = async (data, checkType) => {
  try {
    const response = await Config.axios.get(AppConstant.Api.userExistence, {
      params: {
        checkType: checkType,
        data: data,
      },
    });
    if (response.status === 204) {
      return false;
    } else {
      return response.data;
    }
  } catch (error) {
    //  Common.Alert.show('', AppConstant.Alert.SERVER_ERROR);
    console.log(error);
    return false;
  }
};

const getAll = async (cursor, keyword) => {
  try {
    let users = [],
      query = usersRef
        .orderBy('full_name')
        .limit(30)
        .get();

    if (cursor) {
      let lastUser = await usersRef.doc(cursor.id).get();
      query = usersRef
        .orderBy('full_name')
        .startAfter(lastUser)
        .limit(30)
        .get();
    }

    if (keyword) {
      query = usersRef
        .orderBy('full_name')
        .limit(30)
        .startAt(keyword)
        .endAt(keyword + '\uf8ff')
        .get();
    }

    if (keyword && cursor) {
      let lastUser = await usersRef.doc(cursor.id).get();
      query = usersRef
        .orderBy('full_name')
        .startAt(keyword)
        .endAt(keyword + '\uf8ff')
        .startAfter(lastUser)
        .limit(30)
        .get();
    }

    const querySnapshot = await query;

    querySnapshot.forEach(doc => {
      users.push(doc.data());
    });

    return users;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default {
  add,
  get,
  update,
  checkExistence,
  getAll,
};
