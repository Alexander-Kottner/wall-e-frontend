import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import colors from '../constants/colors';
import CustomButton from '../components/CustomButton';
import { getWalletDetails } from '../services/wallet';

export default function TransactionsScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const data = await getWalletDetails();
      setTransactions(data.allTransactions || []);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.item,
        item.type === 'IN' ? styles.incoming : styles.outgoing,
      ]}
    >
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.amount}>
        {item.type === 'OUT' ? '-' : '+'}${item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text>{loading ? 'Loading...' : 'No transactions'}</Text>
        }
      />
      <CustomButton title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: colors.text,
    fontFamily: 'Montserrat_700Bold',
  },
  item: {
    padding: 12,
    borderRadius: 4,
    marginVertical: 6,
  },
  incoming: {
    backgroundColor: '#d1e7dd',
  },
  outgoing: {
    backgroundColor: '#f8d7da',
  },
  date: {
    fontSize: 12,
    color: colors.secondary,
    fontFamily: 'Montserrat_400Regular',
  },
  desc: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Montserrat_400Regular',
  },
  amount: {
    fontWeight: 'bold',
    textAlign: 'right',
    color: colors.text,
    fontFamily: 'Montserrat_700Bold',
  },
});
