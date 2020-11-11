import * as Firebase from 'react-native-firebase';

import * as Common from '../common';

// const db = Config.db,
const db = Firebase.firestore(),
  orderRef = db.collection('orders');

const add = async order => {
  try {
    let docRef = orderRef.doc();
    order = Common.Helper.trimObj(order);
    await orderRef.doc(docRef.id).set({
      id: docRef.id,
      created_at: Firebase.firestore.FieldValue.serverTimestamp(),
      ...order,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAll = async (userId, cursor) => {
  try {
    let orders = [],
      query = orderRef
        .where('purchased_by.id', '==', userId)
        .orderBy('created_at', 'desc')
        .limit(30)
        .get();

    if (cursor) {
      let lastOrder = await orderRef.doc(cursor.id).get();
      query = orderRef
        .where('purchased_by.id', '==', userId)
        .orderBy('created_at', 'desc')
        .startAfter(lastOrder)
        .limit(30)
        .get();
    }

    const querySnapshot = await query;

    querySnapshot.forEach(doc => {
      orders.push(doc.data());
    });

    return orders;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const update = async data => {
  try {
    let userId = Firebase.auth().currentUser.uid;
    const purchasedBy = await orderRef
      .where('purchased_by.id', '==', userId)
      .get();

    const purchasedFor = await orderRef
      .where('purchased_for.id', '==', userId)
      .get();

    purchasedBy.forEach(async doc => {
      await orderRef.doc(doc.id).update({
        'purchased_by.first_name': data.first_name,
        'purchased_by.last_name': data.last_name,
      });
    });

    purchasedFor.forEach(async doc => {
      await orderRef.doc(doc.id).update({
        'purchased_for.first_name': data.first_name,
        'purchased_for.last_name': data.last_name,
      });
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default {
  add,
  getAll,
  update,
};
