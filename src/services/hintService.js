import * as Firebase from 'react-native-firebase';

import * as Common from '../common';

import * as AppConstant from '../constants';

// const db = Config.db,
const db = Firebase.firestore(),
  hintRef = db.collection('hints');

const add = async hint => {
  try {
    let docRef = hintRef.doc();
    hint = Common.Helper.trimObj(hint);
    hint.price = +hint.price;
    await hintRef.doc(docRef.id).set({
      ...hint,
      id: docRef.id,
      shipping_and_handling: 0,
      sales_tax: 0,
      final_price: hint.price,
      status: AppConstant.Status.hint.IN_INVENTORY,
      created_at: Firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
  }
};

const get = async (
  userId,
  cursor,
  order = {key: 'created_at', direction: 'desc'},
) => {
  try {
    let hints = [],
      query = hintRef
        .where('user_id', '==', userId)
        .orderBy(order.key, order.direction)
        .limit(30)
        .get();

    if (cursor) {
      let lastHint = await hintRef.doc(cursor.id).get();
      query = hintRef
        .where('user_id', '==', userId)
        .orderBy(order.key, order.direction)
        .startAfter(lastHint)
        .limit(30)
        .get();
    }

    const querySnapshot = await query;

    querySnapshot.forEach(doc => {
      let hint = doc.data();
      if (hint.status < AppConstant.Status.hint.DECLINED) {
        hints.push(hint);
      }
    });

    return hints;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const update = async (hint, id) => {
  try {
    await hintRef.doc(id).set(hint, {merge: true});
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const remove = async hintId => {
  try {
    await hintRef.doc(hintId).delete();
    return true;
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
