import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const SummaryScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [balance, setBalance] = useState(0);
  const [currentMonth, setCurrentMonth] = useState('');
  const screenWidth = Dimensions.get('window').width;

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
      loadIncome();
    }, [])
  );

  // Load expenses from AsyncStorage
  const loadExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('@expenses');
      const expensesList = storedExpenses ? JSON.parse(storedExpenses) : [];
      setExpenses(expensesList);

      // Set the month name from the first expense date
      if (expensesList.length > 0) {
        const firstExpenseDate = new Date(expensesList[0].date);
        setCurrentMonth(firstExpenseDate.toLocaleString('default', { month: 'long' }));
      }
    } catch (e) {
      console.log('Error loading expenses:', e);
    }
  };

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

  // Recalculate the balance when either income or expenses change
  useEffect(() => {
    calculateBalance(expenses, income);
  }, [expenses, income]);

  // Calculate balance as Income - Expenses
  const calculateBalance = (expensesList, incomeList) => {
    const totalExpenses = expensesList.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const totalIncome = incomeList.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
    const currentBalance = totalIncome - totalExpenses;
    setBalance(currentBalance);
    checkBalanceNotification(currentBalance);
  };

  // Generate notifications based on balance
  const checkBalanceNotification = async (currentBalance) => {
    const notifications = [];
    // Check if balance is below 10,000 LKR
    if (currentBalance < 10000) {
      notifications.push({
        id: Date.now().toString(),
        message: 'Your current balance is below 10,000 LKR. Please review your expenses.',
      });
    }

    // Daily expense reminder
    notifications.push({
      id: Date.now().toString(),
      message: 'Reminder: Don’t forget to add today’s expenses!',
    });

    try {
      const storedNotifications = await AsyncStorage.getItem('@notifications');
      const notificationsList = storedNotifications ? JSON.parse(storedNotifications) : [];
      const updatedNotifications = [...notificationsList, ...notifications];
      await AsyncStorage.setItem('@notifications', JSON.stringify(updatedNotifications));
    } catch (e) {
      console.log('Error saving notifications:', e);
    }
  };

  // Define fixed colors for specific categories
  const categoryColors = {
    Rent: '#FF6347',        // Tomato red
    Transportation: '#FFD700',  // Gold
    Food: '#90EE90',        // Light Green
    Groceries: '#4682B4',   // Steel Blue
    Entertainment: '#FF69B4', // Hot Pink
  };

  // Group expenses by category for the pie chart with fixed colors
  const getCategoryData = () => {
    const categoryData = expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(amount);
      return acc;
    }, {});

    return Object.keys(categoryData).map((category) => ({
      name: category,
      population: categoryData[category] > 0 ? categoryData[category] : 1, // Ensure there's no 0 population
      color: categoryColors[category] || getRandomColor(), // Use fixed color if available, else random
      legendFontColor: '#7F7F7F',
      legendFontSize: 13,  // Reduced font size for the legend
    }));
  };

  // Function to generate random colors for categories without fixed colors
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Helper function to format date only for weekly expenses (no month, just date)
  const formatDate = (date) => {
    return `${date.getDate()}`; // Display only the date (day of the month)
  };

  // Get weekly expenses by date only
  const getWeeklyExpensesData = () => {
    const currentDate = new Date();
    const last7DaysExpenses = [];
    const labels = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() - i);
      labels.push(formatDate(day)); // Add only the day of the month as the label

      const totalForDay = expenses.reduce((acc, expense) => {
        if (new Date(expense.date).toDateString() === day.toDateString()) {
          return acc + parseFloat(expense.amount);
        }
        return acc;
      }, 0);

      last7DaysExpenses.push(totalForDay > 0 ? totalForDay : 0);
    }

    return {
      labels, // Use formatted date for the bar chart labels
      datasets: [
        {
          data: last7DaysExpenses,
        },
      ],
    };
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Add Button in top right corner outside balance shape */}
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddExpense')}>
          <Ionicons name="add-circle-outline" size={50} color="tomato" />
        </TouchableOpacity>

        {/* Current Balance inside a shape */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Current Balance: {balance.toFixed(2)}</Text>
        </View>

        {/* Monthly Expenses by Category inside shape */}
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Monthly Expenses - {currentMonth}</Text>
          <PieChart
            data={getCategoryData()}
            width={screenWidth - 40}  // Adjusting width
            height={220}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'-10'}  // Increased padding to avoid legend cutoff
            absolute
          />
        </View>

        {/* Weekly Expenses by Day and Date inside shape */}
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Weekly Expenses</Text>
          <BarChart
            data={getWeeklyExpensesData()}
            width={screenWidth - 70}  // Adjusting width for better display
            height={220}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.5,
              decimalPlaces: 0, // Ensures no decimal places
              fillShadowGradient: '#4285F4',
              fillShadowGradientOpacity: 1,
            }}
            verticalLabelRotation={30}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10, // Ensures the button stays on top
  },
  balanceContainer: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 3, 
    elevation: 3,
  },
  balanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default SummaryScreen;
