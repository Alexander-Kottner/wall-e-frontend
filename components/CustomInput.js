import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function CustomInput({ style, ...props }) {
  return <TextInput style={[styles.input, style]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 4,
    marginVertical: 6,
    width: '100%',
  },
});
