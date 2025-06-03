import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export interface CustomInputProps {
  style?: any;
  variant?: 'default' | 'filled' | 'underline';
  [x: string]: any;
}
export default function CustomInput({ style, variant = 'default', ...props }: CustomInputProps) {
  const getInputStyle = () => {
    const baseStyle = [styles.input];
    
    switch (variant) {
      case 'filled':
        return [...baseStyle, styles.inputFilled, style];
      case 'underline':
        return [...baseStyle, styles.inputUnderline, style];
      default:
        return [...baseStyle, styles.inputDefault, style];
    }
  };

  return (
    <TextInput
      placeholderTextColor={colors.textSecondary}
      style={getInputStyle()}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: '100%',
    color: colors.text,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    minHeight: 44,
  },
  
  inputDefault: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.secondaryDark,
  },
  
  inputFilled: {
    backgroundColor: colors.surface,
    borderWidth: 0,
  },
  
  inputUnderline: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: colors.secondaryDark,
    borderRadius: 0,
    paddingHorizontal: 0,
  },
});
