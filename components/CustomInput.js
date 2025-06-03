import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function CustomInput({ style, ...props }) {
  return (
    <TextInput
      placeholderTextColor={colors.secondary}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: 10,
    borderRadius: 4,
    marginVertical: 6,
    width: '100%',
    color: colors.text,
    backgroundColor: colors.background,
    fontFamily: 'Montserrat',
  },
});
