import React, { useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { showError, showSuccess } from '../utils/errors';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import CustomButton from '../components/CustomButton';
import { getBalance } from '../services/wallet';
import { logout } from '../services/auth';

export default function HomeScreen({ navigation }: any) {
  const [balance, setBalance] = useState(null);

  const fetchBalance = useCallback(async () => {
    try {
      const data = await getBalance();
      setBalance(data.balance);
    } catch (e: any) {
      showError(e.response?.data?.message || e.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBalance();
    }, [fetchBalance])
  );

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out');
      navigation.replace('Login');
    } catch (e: any) {
      showError(e.response?.data?.message || e.message, 'Logout failed');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name="logout" 
            size={24} 
            color={colors.secondary} 
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleLogout]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View>
        {/* Balance Section */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balance} testID="current-balance">{balance !== null ? `$${balance}` : '...'}</Text>
          <CustomButton
            title="Refresh"
            testID="balance-refresh"
            onPress={fetchBalance}
            variant="ghost"
            size="small"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>
              <CustomButton
                title="Send Money"
                testID="goto-transfer"
                onPress={() => navigation.navigate('Transfer')}
                style={styles.fullWidthButton}
                size="medium"
              />
            </View>
            <View style={styles.buttonRow}>
              <CustomButton
                title="Request DEBIN"
                onPress={() => navigation.navigate('Debin')}
                variant="outline"
                style={styles.gridButton}
                size="medium"
              />
              <CustomButton
                title="View History"
                testID="goto-transactions"
                onPress={() => navigation.navigate('Transactions')}
                variant="outline"
                style={styles.gridButton}
                size="medium"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.logoutSection}>
        <CustomButton
          title="Logout"
          testID="logout-button"
          onPress={handleLogout}
          variant="ghost"
          size="small"
        />
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
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  logoutButton: {
    padding: 8,
    marginRight: 8,
  },
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 16,
  },
  buttonGrid: {
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridButton: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
    width: '100%',
  },
  logoutSection: {
    marginTop: 'auto',
    paddingTop: 24,
  },
});
