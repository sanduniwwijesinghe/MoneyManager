import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Sample colors for each income category
const categoryColors = {
  Salary: '#1E90FF',
  Bonus: '#32CD32',
  Freelance: '#FFA500',
  Investments: '#9370DB',
  Other: '#D3D3D3',
};

const IncomeSummaryScreen = ({ navigation }) => {
  const [income, setIncome] = useState([]);

  // Reload the income every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadIncome();
    }, [])
  );

  // Load income from AsyncStorage
  const loadIncome = async () => {
    try {
      const storedIncome = await AsyncStorage.getItem('@income');
      const incomeList = storedIncome ? JSON.parse(storedIncome) : [];
      setIncome(incomeList);
    } catch (e) {
      console.log('Error loading income:', e);
    }
  };

  // Delete an income entry
  const deleteIncome = async (id) => {
    const updatedIncome = income.filter((inc) => inc.id !== id);
    try {
      await AsyncStorage.setItem('@income', JSON.stringify(updatedIncome));
      setIncome(updatedIncome); // Update the state
      Alert.alert('Success', 'Income deleted successfully');
    } catch (e) {
      console.log('Error deleting income:', e);
    }
  };

  // Modify an income entry
  const modifyIncome = (incomeEntry) => {
    // Navigate to AddExpenseScreen with the income data for editing
    navigation.navigate('AddExpense', { expense: incomeEntry });
  };

  // Render each income item
  const renderIncomeItem = ({ item }) => {
    return (
      <View style={[styles.incomeItem, { backgroundColor: categoryColors[item.category] || '#D3D3D3' }]}>
        <Text style={styles.incomeText}>
          {item.amount} LKR - {item.category} ({new Date(item.date).toLocaleDateString()})
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => modifyIncome(item)}>
            <Ionicons name="pencil" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteIncome(item.id)}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Income</Text>
      {income.length === 0 ? (
        <Text style={styles.noIncomeText}>No income entries added yet.</Text>
      ) : (
        <FlatList
          data={income}
          keyExtractor={(item) => item.id}
          renderItem={renderIncomeItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  incomeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  incomeText: {
    fontSize: 16,
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  noIncomeText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
});

export default IncomeSummaryScreen;
