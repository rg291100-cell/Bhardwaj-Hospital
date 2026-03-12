import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseURL } from '../utils/api';

const Events = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }

      const response = await axios.get(
        `${baseURL}/events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      console.log('All Events:', response.data.data);
      setEvents(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const renderEvent = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EventsDetail', { eventId: item.id })}
      >
        <Image
          source={{ uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/events/${item.image}` }}
          style={styles.eventImage}
        />

        <View style={styles.cardBody}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>
              {item.type.replace('_', ' ').toUpperCase()}
            </Text>
          </View>

          <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>

          <Text style={styles.eventDesc} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Icon name="calendar" size={13} color="#ff5722" />
              <Text style={styles.metaText}>
                {new Date(item.event_date).toDateString()}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Icon name="clock-outline" size={13} color="#ff5722" />
              <Text style={styles.metaText}>
                {item.start_time} - {item.end_time}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Icon name="map-marker" size={13} color="#ff5722" />
              <Text style={styles.metaText}>{item.venue}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Events</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ff5722" />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
          ListHeaderComponent={
            <View style={styles.banner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>Upcoming Events</Text>
                <Text style={styles.bannerSub}>Don't miss out on hospital events and health camps.</Text>
              </View>
              <View style={styles.bannerIcon}>
                <Icon name="calendar-star" size={36} color="#fff" />
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="calendar-blank" size={70} color="#ddd" />
              <Text style={styles.emptyText}>No events available</Text>
              <Text style={styles.emptySub}>Check back later for new events and camps.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    backgroundColor: '#ff5722',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#ff5722',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
  },
  bannerSub: {
    color: '#ffe4db',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
    paddingRight: 20,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  eventImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#eee',
  },
  cardBody: {
    padding: 16,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff4f0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 10,
    color: '#ff5722',
    fontFamily: 'Poppins-Bold',
  },
  eventTitle: {
    fontSize: 17,
    color: '#111',
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
    marginBottom: 10,
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 6,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    marginTop: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  emptySub: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});
