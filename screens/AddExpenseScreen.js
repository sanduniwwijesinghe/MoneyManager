import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const AddExpenseScreen = ({ navigation }) => {
  const [entryType, setEntryType] = useState(''); // 'income' or 'expense'
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [openType, setOpenType] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  // Categories for income and expense
  const incomeCategories = [
    { label: 'Salary', value: 'Salary' },
    { label: 'Bonus', value: 'Bonus' },
    { label: 'Freelance', value: 'Freelance' },
    { label: 'Investments', value: 'Investments' },
  ];

  const expenseCategories = [
    { label: 'Food', value: 'Food' },
    { label: 'Rent', value: 'Rent' },
    { label: 'Transportation', value: 'Transportation' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Groceries', value: 'Groceries' },
  ];

  const entryTypeOptions = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

  const saveEntry = async () => {
    if (!entryType || !amount || !category) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      amount,
      category,
      date: date.toDateString(),
      type: entryType, // Store whether it's income or expense
    };

    const storageKey = entryType === 'income' ? '@income' : '@expenses';

    try {
      const storedEntries = await AsyncStorage.getItem(storageKey);
      const updatedEntries = storedEntries ? JSON.parse(storedEntries) : [];
      updatedEntries.push(newEntry);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedEntries));
      Alert.alert('Success', `${entryType.charAt(0).toUpperCase() + entryType.slice(1)} added successfully!`);
      navigation.goBack(); // Go back to the summary screen
    } catch (e) {
      console.log('Error saving entry:', e);
    }
  };

  // Show the date picker
  const onShowDatePicker = () => {
    setShowDatePicker(true);
  };

  // Handle the selected date
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false); // Close the picker after selection
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Entry</Text>

      {/* Income or Expense Selection */}
      <Text style={styles.label}>Select Entry Type:</Text>
      <DropDownPicker
        open={openType}
        value={entryType}
        items={entryTypeOptions}
        setOpen={setOpenType}
        setValue={setEntryType}
        placeholder="Select Type"
        style={styles.dropdown}
      />

      {/* Category Selection Based on Entry Type */}
      {entryType !== '' && (
        <>
          <Text style={styles.label}>Select Category:</Text>
          <DropDownPicker
            open={openCategory}
            value={category}
            items={entryType === 'income' ? incomeCategories : expenseCategories}
            setOpen={setOpenCategory}
            setValue={setCategory}
            placeholder="Select Category"
            style={styles.dropdown}
          />
        </>
      )}

      {/* Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {/* Date Picker */}
      <TouchableOpacity onPress={onShowDatePicker} style={styles.dateButton}>
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Save Button */}
      <Button title="Save" onPress={saveEntry} />
      <Button title="Cancel" color="red" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  dateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
  },
});

export default AddExpenseScreen;
