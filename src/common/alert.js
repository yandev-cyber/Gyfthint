import {Alert} from 'react-native';

const show = (title, message, action, confirmation) => {
  let buttons = [
    {
      text: 'OK',
      onPress: () => {
        console.log('done...');
        if (action) {
          if (action.type === 'redirect') {
            action.execute(action.routeName);
          }
        }
      },
    },
  ];

  if (confirmation) {
    buttons = confirmation;
  }

  Alert.alert(title, message, buttons, {cancelable: false});
};

export default {
  show,
};
