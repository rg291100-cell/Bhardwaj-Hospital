import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Notifications = () => {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        console.log('No access token found');
        setNotifications([]);
        return;
      }

      const response = await axios.get(
        'https://argosmob.uk/bhardwaj-hospital/public/api/notifications',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );
console.log("Notifications",response?.data?.data);

      setNotifications(response?.data?.data || []);
    } catch (error) {
      console.log('NOTIFICATION API ERROR', error?.response || error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 26 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4f8cff" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="bell-off-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          ) : (
            notifications.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.notificationCard,
                  !item.read && styles.unreadCard,
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.iconContainer}>
                  <Icon
                    name={
                      item.title?.includes('Message')
                        ? 'message-text'
                        : 'calendar-check'
                    }
                    size={20}
                    color="#fff"
                  />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.message}>{item.message}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>

                {!item.read && <View style={styles.dot} />}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Notifications;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  /* ---------- HEADER ---------- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
  },

  /* ---------- EMPTY STATE ---------- */
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120,
  },
  emptyText: {
    marginTop: 14,
    fontSize: 15,
    color: '#9ca3af',
    fontFamily: 'Poppins-Medium',
  },

  /* ---------- NOTIFICATION CARD ---------- */
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,

    /* Shadow */
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  unreadCard: {
    backgroundColor: '#f2f7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#4f8cff',
  },

  /* ---------- ICON ---------- */
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f8cff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  /* ---------- TEXT ---------- */
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: '#111827',
    fontFamily: 'Poppins-Medium',
  },
  message: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 3,
    lineHeight: 18,
    fontFamily: 'Poppins-Regular',
  },
  time: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 6,
    fontFamily: 'Poppins-Regular',
  },

  /* ---------- UNREAD DOT ---------- */
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#4f8cff',
    marginLeft: 10,
  },
});
