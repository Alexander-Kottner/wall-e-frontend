import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Request DEBIN</Text>
        <Text style={styles.subtitle}>Request money via DEBIN system</Text>
      </View>

      <View style={styles.form}>
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
            title="Request DEBIN" 
            onPress={handleDebin}
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
