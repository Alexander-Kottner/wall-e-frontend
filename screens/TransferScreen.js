import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { p2pTransfer } from '../services/transactions';

export default function TransferScreen({ navigation }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    const value = parseFloat(amount);
    if (!recipient || !value) {
      Alert.alert('Error', 'Please enter recipient and amount');
      return;
    }
    try {
      await p2pTransfer(recipient, value);
      Alert.alert('Success', 'Transfer completed');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Money</Text>
      <CustomInput
        placeholder="Email or alias"
        value={recipient}
        onChangeText={setRecipient}
      />
      <CustomInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <CustomButton title="Send" onPress={handleTransfer} />
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
