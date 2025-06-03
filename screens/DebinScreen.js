import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import colors from '../constants/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { requestDebin } from '../services/wallet';

export default function DebinScreen({ navigation }) {
  const [amount, setAmount] = useState('');

  const handleDebin = async () => {
    const value = parseFloat(amount);
    if (!value) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }
    try {
      await requestDebin(value);
      Alert.alert('Success', 'DEBIN requested');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request DEBIN</Text>
      <CustomInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <CustomButton title="Request" onPress={handleDebin} />
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
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: colors.text,
    fontFamily: 'Montserrat_700Bold',
  },
  link: {
    backgroundColor: 'transparent',
  },
});
