import * as Firebase from 'react-native-firebase';

const db = Firebase.firestore(),
  eventsRef = db.collection('events');

const addEvents = async (events, userId) => {
  try {
    console.log(events, userId);
    for (let i = 0; i < events.length; i++) {
      let docRef = eventsRef.doc();
      await eventsRef.doc(docRef.id).set({
        ...events[i],
        id: docRef.id,
        user_id: userId,
        created_at: Firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteEvents = async events => {
  try {
    for (let i = 0; i < events.length; i++) {
      await eventsRef.doc(events[i].id).delete();
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getEvents = async (user, eventType) => {
  try {
    let events = [],
      date = new Date(),
      month = date.getMonth(),
      year = date.getFullYear(),
      startDate = new Date(Date.UTC(year, month, 1, 12)),
      dateAfterYear = new Date(
        Date.now() + (year % 4 === 0 ? 366 : 365) * 24 * 60 * 60 * 1000,
      ),
      endDate = new Date(
        Date.UTC(
          dateAfterYear.getFullYear(),
          dateAfterYear.getMonth(),
          dateAfterYear.getDate(),
          12,
        ),
      ),
      query = eventsRef
        .where('occurrence_date', '>=', startDate)
        .where('occurrence_date', '<=', endDate)
        .get();
    console.log('startDate: ', startDate);
    if (user) {
      query = eventsRef
        .where('user_id', '==', user)
        .where('occurrence_date', '>=', startDate)
        .where('occurrence_date', '<=', endDate)
        .get();
    }

    if (eventType && user) {
      query = eventsRef
        .where('user_id', '==', user)
        .where('event_type', '==', eventType)
        .where('occurrence_date', '>=', startDate)
        .get();
    }

    const querySnapshot = await query;

    querySnapshot.forEach(doc => {
      events.push(doc.data());
    });

    console.log('events: ', events);
    return events;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const updateEvents = async events => {
  try {
    for (let i = 0; i < events.length; i++) {
      await eventsRef.doc(events[i].id).set(events[i]);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default {
  addEvents,
  getEvents,
  deleteEvents,
  updateEvents,
};
