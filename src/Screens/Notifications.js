import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseURL } from '../utils/api';

const Notifications = () => {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getNotifications(1);
  }, []);

  const getNotifications = async (pageNumber = 1, isRefreshing = false) => {
    try {
      if (pageNumber === 1) {
        if (!isRefreshing) setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      console.log('Fetching notifications, page:', pageNumber);
      const response = await axios.get(
        `${baseURL}/notifications?page=${pageNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log('Notification API Response Received');

      // Flexible parsing for different pagination structures
      const resData = response.data?.data;
      if (resData) {
        const newNotifications = resData.data || (Array.isArray(resData) ? resData : []);

        if (pageNumber === 1) {
          setNotifications(newNotifications);
        } else {
          setNotifications(prev => [...(prev || []), ...newNotifications]);
        }

        // Handle Laravel pagination fields
        if (resData.current_page && resData.last_page) {
          setHasMore(resData.current_page < resData.last_page);
          setPage(resData.current_page);
        } else {
          setHasMore(false);
        }
      } else {
        if (pageNumber === 1) setNotifications([]);
        setHasMore(false);
      }
    } catch (error) {
      console.log('NOTIFICATION API ERROR:', error?.response?.data || error.message);
      if (pageNumber === 1) setNotifications([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getNotifications(1, true);
  };

  const handleMarkAsRead = async (id, alreadyRead) => {
    if (alreadyRead) return;

    try {
      const token = await AsyncStorage.getItem('access_token');
      await axios.post(`${baseURL}/notifications/${id}/mark-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch (error) {
      console.log('Mark read error:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      await axios.post(`${baseURL}/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (error) {
      console.log('Mark all read error:', error);
    }
  };

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      getNotifications(page + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllRead}>
          <Icon name="check-all" size={24} color="#E66A2C" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E66A2C" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#E66A2C']}
            />
          }
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Icon name="bell-off-outline" size={60} color="#E66A2C" />
              </View>
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySubText}>We'll notify you when something important happens.</Text>
              <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
                <Text style={styles.refreshBtnText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {notifications.map(item => {
                const isRead = !!item.read_at;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.notificationCard,
                      !isRead && styles.unreadCard,
                    ]}
                    onPress={() => handleMarkAsRead(item.id, isRead)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: isRead ? '#F1F1F1' : '#FFF3E0' }]}>
                      <Icon
                        name={item.type === 'prescription' ? 'pill' : item.type === 'report' ? 'file-document-outline' : 'bell-outline'}
                        size={22}
                        color={isRead ? '#999' : '#E66A2C'}
                      />
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={[styles.title, !isRead && styles.unreadTitle]}>{item.title}</Text>
                      <Text style={styles.message} numberOfLines={2}>{item.message || item.meta_data?.message || item.type}</Text>
                      <Text style={styles.time}>{new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>

                    {!isRead && <View style={styles.dot} />}
                  </TouchableOpacity>
                );
              })}

              {hasMore && (
                <TouchableOpacity
                  style={styles.loadMoreBtn}
                  onPress={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <ActivityIndicator size="small" color="#E66A2C" />
                  ) : (
                    <Text style={styles.loadMoreText}>Load More</Text>
                  )}
                </TouchableOpacity>
              )}
            </>
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
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ---------- HEADER ---------- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },

  /* ---------- EMPTY STATE ---------- */
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
  },

  /* ---------- NOTIFICATION CARD ---------- */
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  unreadCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#E66A2C',
  },

  /* ---------- ICON ---------- */
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  /* ---------- TEXT ---------- */
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: '#555',
    fontFamily: 'Poppins-Medium',
  },
  unreadTitle: {
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  message: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },
  time: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 6,
    fontFamily: 'Poppins-Regular',
  },

  /* ---------- UNREAD DOT ---------- */
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E66A2C',
    marginLeft: 10,
  },

  /* ---------- LOAD MORE ---------- */
  loadMoreBtn: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E66A2C22',
    marginBottom: 20,
  },
  loadMoreText: {
    color: '#E66A2C',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  refreshBtn: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#E66A2C',
    borderRadius: 25,
  },
  refreshBtnText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});
