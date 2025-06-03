import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import colors from '../constants/colors';
import CustomButton from '../components/CustomButton';
import { getBalance } from '../services/wallet';
import { logout } from '../services/auth';

export default function HomeScreen({ navigation }) {
  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    try {
      const data = await getBalance();
      setBalance(data.balance);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (e) {
      Alert.alert('Logout failed', e.response?.data?.message || e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet Balance</Text>
      <Text style={styles.balance}>{balance !== null ? `$${balance}` : '...'}</Text>
      <CustomButton title="Refresh" onPress={fetchBalance} />
      <CustomButton title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: colors.text,
    fontFamily: 'Montserrat_700Bold',
  },
  balance: {
    fontSize: 32,
    marginBottom: 20,
    color: colors.primary,
    fontFamily: 'Montserrat_400Regular',
  },
});
