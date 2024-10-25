import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from AsyncStorage
  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('@notifications');
      const notificationsList = storedNotifications ? JSON.parse(storedNotifications) : [];
      setNotifications(notificationsList);
    } catch (e) {
      console.log('Error loading notifications:', e);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.noNotificationsText}>No notifications available</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
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
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  notificationText: {
    fontSize: 16,
  },
  noNotificationsText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificationsScreen;
