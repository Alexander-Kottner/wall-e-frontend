import Toast from 'react-native-toast-message';

export function showError(message: string, title = 'Error') {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'bottom',
  });
}

export function showSuccess(message: string, title = 'Success') {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    position: 'bottom',
  });
}
