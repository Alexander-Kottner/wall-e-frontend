import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { addMoneyManual } from '../services/wallet';

export default function TopUpScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');

  const handleTopup = async () => {
    const value = parseFloat(amount);
    if (!value) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }
    try {
      await addMoneyManual(value, 'BANK_ACCOUNT', source);
      Alert.alert('Success', 'Balance added');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Load Balance</Text>
      <CustomInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <CustomInput
        placeholder="Source identifier"
        value={source}
        onChangeText={setSource}
      />
      <CustomButton title="Add" onPress={handleTopup} />
      <CustomButton
        title="Cancel"
        onPress={() => navigation.goBack()}
        style={styles.link}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  link: {
    backgroundColor: 'transparent',
  },
});
