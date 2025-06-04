import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { showError, showSuccess } from '../utils/errors';
import colors from '../constants/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { login } from '../services/auth';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      showSuccess('Logged in');
      navigation.replace('Home');
    } catch (e: any) {
      showError(e.response?.data?.message || e.message, 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your WALL-E wallet</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="login-email-input"
          />
          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            testID="login-password-input"
          />

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            style={styles.loginButton}
            testID="login-submit-button"
          />

          <CustomButton
            title="Create Account"
            onPress={() => navigation.navigate('Register')}
            variant="ghost"
            testID="login-create-account-button"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
  },
  form: {
    gap: 8,
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 8,
  },
});
