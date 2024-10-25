import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SummaryScreen from './screens/SummaryScreen';
import ExpensesSummaryScreen from './screens/ExpensesSummaryScreen';
import IncomeSummaryScreen from './screens/IncomeSummaryScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import { createStackNavigator } from '@react-navigation/stack'; // Make sure you import this

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// HomeTabs component to handle the bottom tab navigation
const HomeTabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Summary"
      component={SummaryScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="pie-chart" size={size} color={color} />
        ),
        title: 'Money Manager', // Changing the title here
        headerTitle: 'Money Manager', // Set header title
      }}
    />
    <Tab.Screen
      name="Expenses Summary"
      component={ExpensesSummaryScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="cash-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Income Summary"
      component={IncomeSummaryScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="wallet-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="notifications-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerShown: false }} // You can hide the header if not needed
      />
      <Stack.Screen 
        name="AddExpense" 
        component={AddExpenseScreen} 
        options={{ title: 'Add Expense' }} // This title appears when navigating to the AddExpense screen
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
