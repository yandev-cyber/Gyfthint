import * as Firebase from 'react-native-firebase';

const db = Firebase.firestore(),
  celebrationRef = db.collection('categories');

const getAll = async () => {
  try {
    let categories = [];
    const querySnapshot = await celebrationRef.orderBy('name', 'ASC').get();

    querySnapshot.forEach(doc => {
      categories.push(doc.data());
    });

    return categories;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default {
  getAll,
};
