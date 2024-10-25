import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Sample colors for each category
const categoryColors = {
  Food: '#FF6347',
  Rent: '#4682B4',
  Transportation: '#32CD32',
  Entertainment: '#FFD700',
  Groceries: '#9370DB',
  Other: '#D3D3D3',
};

const ExpensesSummaryScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);

  // Reload the expenses every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  // Load expenses from AsyncStorage
  const loadExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('@expenses');
      const expensesList = storedExpenses ? JSON.parse(storedExpenses) : [];
      setExpenses(expensesList);
    } catch (e) {
      console.log('Error loading expenses:', e);
    }
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    try {
      await AsyncStorage.setItem('@expenses', JSON.stringify(updatedExpenses));
      setExpenses(updatedExpenses); // Update the state
      Alert.alert('Success', 'Expense deleted successfully');
    } catch (e) {
      console.log('Error deleting expense:', e);
    }
  };

  // Modify an expense
  const modifyExpense = (expense) => {
    // Navigate to AddExpenseScreen with the expense data for editing
    navigation.navigate('AddExpense', { expense });
  };

  // Render each expense item
  const renderExpenseItem = ({ item }) => {
    return (
      <View style={[styles.expenseItem, { backgroundColor: categoryColors[item.category] || '#D3D3D3' }]}>
        <Text style={styles.expenseText}>
          {item.amount} LKR - {item.category} ({new Date(item.date).toLocaleDateString()})
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => modifyExpense(item)}>
            <Ionicons name="pencil" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteExpense(item.id)}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Expenses</Text>
      {expenses.length === 0 ? (
        <Text style={styles.noExpensesText}>No expenses added yet.</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderExpenseItem}
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
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  expenseText: {
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
  noExpensesText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
});

export default ExpensesSummaryScreen;
