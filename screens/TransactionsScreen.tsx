import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import colors from '../constants/colors';
import CustomButton from '../components/CustomButton';
import { getWalletDetails } from '../services/wallet';

export default function TransactionsScreen({ navigation }: any) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      const data = await getWalletDetails();
      setTransactions(data.allTransactions || []);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={[
          styles.transactionIndicator,
          item.type === 'IN' ? styles.incomingIndicator : styles.outgoingIndicator
        ]} />
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDesc}>{item.description}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
        <Text style={[
          styles.transactionAmount,
          item.type === 'IN' ? styles.incomingAmount : styles.outgoingAmount
        ]}>
          {item.type === 'OUT' ? '-' : '+'}${item.amount}
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        {loading ? 'Loading transactions...' : 'No transactions yet'}
      </Text>
      {!loading && (
        <Text style={styles.emptySubtext}>
          Your transaction history will appear here
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <CustomButton 
          title="Back to Home" 
          onPress={() => navigation.goBack()}
          variant="outline"
          size="medium"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Montserrat_400Regular',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    flexGrow: 1,
  },
  transactionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginVertical: 4,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  incomingIndicator: {
    backgroundColor: colors.success,
  },
  outgoingIndicator: {
    backgroundColor: colors.warning,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Montserrat_400Regular',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat_700Bold',
  },
  incomingAmount: {
    color: colors.success,
  },
  outgoingAmount: {
    color: colors.warning,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    opacity: 0.8,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
});
