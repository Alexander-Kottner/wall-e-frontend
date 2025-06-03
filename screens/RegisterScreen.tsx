import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import colors from '../constants/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { register } from '../services/auth';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');

  const handleRegister = async () => {
    try {
      await register(email, password, alias || undefined);
      navigation.replace('Home');
    } catch (e: any) {
      Alert.alert('Registration failed', e.response?.data?.message || e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the WALL-E wallet community</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="register-email-input"
          />
          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            testID="register-password-input"
          />
          <CustomInput
            placeholder="Alias (optional)"
            value={alias}
            onChangeText={setAlias}
            testID="register-alias-input"
          />
          
          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            style={styles.registerButton}
            testID="register-submit-button"
          />
          
          <CustomButton
            title="Back to Sign In"
            onPress={() => navigation.goBack()}
            variant="ghost"
            testID="register-back-button"
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
  registerButton: {
    marginTop: 16,
    marginBottom: 8,
  },
});
