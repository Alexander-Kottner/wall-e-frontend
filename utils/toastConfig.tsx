import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import colors from '../constants/colors';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.success, backgroundColor: colors.surface }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
        color: colors.text,
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: colors.textSecondary,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: colors.error, backgroundColor: colors.surface }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
        color: colors.text,
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        color: colors.textSecondary,
      }}
    />
  ),
};
