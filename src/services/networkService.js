import * as Firebase from 'react-native-firebase';

// const db = Config.db,
const db = Firebase.firestore(),
  networkRef = db.collection('networks');

const add = async notification => {
  try {
    const {sender, receiver} = notification;

    console.log(sender, receiver);

    let batch = db.batch();

    let requestedUser = networkRef.doc();
    batch.set(requestedUser, {
      id: requestedUser.id,
      user_id: receiver.user_id,
      friend_id: sender.user_id,
      first_name: sender.first_name,
      last_name: sender.last_name,
      full_name: sender.full_name,
      email: sender.email,
      dob: sender.dob,
      image: sender.image,
      phone: sender.phone,
      is_birth_year: sender.is_birth_year,
      created_at: Firebase.firestore.FieldValue.serverTimestamp(),
    });

    let requestingUser = networkRef.doc();
    batch.set(requestingUser, {
      id: requestingUser.id,
      user_id: sender.user_id,
      friend_id: receiver.user_id,
      first_name: receiver.first_name,
      last_name: receiver.last_name,
      full_name: receiver.full_name,
      email: receiver.email,
      dob: receiver.dob,
      image: receiver.image,
      phone: receiver.phone,
      is_birth_year: receiver.is_birth_year,
      created_at: Firebase.firestore.FieldValue.serverTimestamp(),
    });

    await batch.commit();
  } catch (error) {
    console.log(error);
  }
};

const get = async (cursor, keyword) => {
  try {
    let users = [],
      userId = Firebase.auth().currentUser.uid,
      query = networkRef
        .where('user_id', '==', userId)
        .orderBy('full_name')
        .limit(30)
        .get();

    if (cursor) {
      let lastUser = await networkRef.doc(cursor.id).get();
      query = networkRef
        .where('user_id', '==', userId)
        .orderBy('full_name')
        .startAfter(lastUser)
        .limit(30)
        .get();
    }

    if (keyword) {
      query = networkRef
        .where('user_id', '==', userId)
        .orderBy('full_name')
        .limit(30)
        .startAt(keyword)
        .endAt(keyword + '\uf8ff')
        .get();
    }

    if (keyword && cursor) {
      let lastUser = await networkRef.doc(cursor.id).get();
      query = networkRef
        .where('user_id', '==', userId)
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

const update = async (userId, details) => {
  try {
    const querySnapshot = await networkRef
      .where('friend_id', '==', userId)
      .get();

    querySnapshot.forEach(async doc => {
      await networkRef.doc(doc.id).update(details);
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const remove = async (userId, friendId) => {
  try {
    const querySnapshot = [];
    querySnapshot.push(
      networkRef
        .where('user_id', '==', userId)
        .where('friend_id', '==', friendId)
        .get(),
      networkRef
        .where('friend_id', '==', userId)
        .where('user_id', '==', friendId)
        .get(),
    );

    const result = await Promise.all(querySnapshot);

    for (let i = 0; i < result.length; i++) {
      result[i].forEach(async data => {
        await networkRef.doc(data.id).delete();
      });
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default {
  add,
  get,
  update,
  remove,
};
