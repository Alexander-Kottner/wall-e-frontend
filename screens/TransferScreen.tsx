import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { showError, showSuccess } from '../utils/errors';
import colors from '../constants/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { p2pTransfer } from '../services/transactions';

export default function TransferScreen({ navigation }: any) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    const value = parseFloat(amount);
    if (!recipient || !value) {
      showError('Please enter recipient and amount');
      return;
    }
    try {
      await p2pTransfer(recipient, value);
      showSuccess('Money sent');
      navigation.goBack();
    } catch (e: any) {
      showError(e.response?.data?.message || e.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Send Money</Text>
        <Text style={styles.subtitle}>Transfer funds to another user</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recipient</Text>
          <CustomInput
            placeholder="Email or alias"
            value={recipient}
            onChangeText={setRecipient}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <CustomInput
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonGroup}>
          <CustomButton 
            title="Send Money" 
            onPress={handleTransfer}
            style={styles.primaryButton}
          />
          <CustomButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
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
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Montserrat_700Bold',
    marginLeft: 4,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    marginBottom: 4,
  },
});
