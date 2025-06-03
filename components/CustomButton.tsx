import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export interface CustomButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  style?: any;
  textStyle?: any;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  testID?: string;
}
export default function CustomButton({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  testID,
}: CustomButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, (styles as any)[`button_${size}`]];
    
    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.buttonSecondary, style];
      case 'outline':
        return [...baseStyle, styles.buttonOutline, style];
      case 'ghost':
        return [...baseStyle, styles.buttonGhost, style];
      default:
        return [...baseStyle, styles.buttonPrimary, style];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.buttonText, (styles as any)[`buttonText_${size}`]];
    
    switch (variant) {
      case 'secondary':
        return [...baseTextStyle, styles.buttonTextSecondary, textStyle];
      case 'outline':
        return [...baseTextStyle, styles.buttonTextOutline, textStyle];
      case 'ghost':
        return [...baseTextStyle, styles.buttonTextGhost, textStyle];
      default:
        return [...baseTextStyle, styles.buttonTextPrimary, textStyle];
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={getButtonStyle()}
      activeOpacity={0.8}
      testID={testID}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  
  // Size variants
  button_small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  button_medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
  },
  button_large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 52,
  },

  // Color variants
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },

  // Text styles
  buttonText: {
    fontWeight: '600',
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },
  
  // Text size variants
  buttonText_small: {
    fontSize: 14,
  },
  buttonText_medium: {
    fontSize: 16,
  },
  buttonText_large: {
    fontSize: 18,
  },

  // Text color variants
  buttonTextPrimary: {
    color: colors.background,
  },
  buttonTextSecondary: {
    color: colors.text,
  },
  buttonTextOutline: {
    color: colors.primary,
  },
  buttonTextGhost: {
    color: colors.secondary,
  },
});
