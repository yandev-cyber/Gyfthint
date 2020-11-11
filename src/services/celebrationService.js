import * as Firebase from 'react-native-firebase';
import _ from 'lodash';

import * as AppConstant from '../constants';

const db = Firebase.firestore(),
  celebrationRef = db.collection('celebrations');

const getAll = async () => {
  try {
    let celebrations = [],
      date = new Date(),
      month = date.getMonth(),
      year = date.getFullYear(),
      startDate = `${year}-${(month + 1 + '').padStart(2, '0')}-01`;
    const querySnapshot = await celebrationRef
      .where('occurrence_date', '>=', startDate)
      .orderBy('occurrence_date', 'ASC')
      .get();

    querySnapshot.forEach(doc => {
      console.log(doc.data());
      if (_.findIndex(celebrations, {name: doc.data().name}) === -1) {
        celebrations.push(doc.data());
      }
    });

    let currentYrCelebration = _.filter(celebrations, celebration => {
      return celebration.occurrence_date.split('-')[0] === year + '';
    });
    let nextYrCelebration = _.filter(celebrations, celebration => {
      return celebration.occurrence_date.split('-')[0] === year + 1 + '';
    });

    return [...nextYrCelebration, ...currentYrCelebration];
  } catch (error) {
    console.log(error);
    return false;
  }
};

const addAll = async () => {
  try {
    for (let i = 0; i < AppConstant.Celebrations.length; i++) {
      let docRef = celebrationRef.doc();
      await celebrationRef.doc(docRef.id).set({
        ...AppConstant.Celebrations[i],
        id: docRef.id,
        created_at: Firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default {
  getAll,
  addAll,
};
