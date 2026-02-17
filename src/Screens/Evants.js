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
        'https://argosmob.uk/bhardwaj-hospital/public/api/events',
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
      <TouchableOpacity style={styles.card} activeOpacity={0.8}
            onPress={() => navigation.navigate('EventsDetail', { eventId: item.id })}

      >
        {/* Event Image */}
        <Image
  source={{ uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/events/${item.image}` }}
          style={styles.eventImage}
        />

        <View style={{ flex: 1 }}>
          {/* Title */}
          <Text style={styles.eventTitle}>{item.title}</Text>

          {/* Type */}
          <Text style={styles.eventType}>
            {item.type.replace('_', ' ').toUpperCase()}
          </Text>

          {/* Description */}
          <Text style={styles.eventDesc} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Date */}
          <View style={styles.row}>
            <Icon name="calendar" size={14} color="#666" />
            <Text style={styles.metaText}>
              {new Date(item.event_date).toDateString()}
            </Text>
          </View>

          {/* Time */}
          <View style={styles.row}>
            <Icon name="clock-outline" size={14} color="#666" />
            <Text style={styles.metaText}>
              {item.start_time} - {item.end_time}
            </Text>
          </View>

          {/* Venue */}
          <View style={styles.row}>
            <Icon name="map-marker" size={14} color="#666" />
            <Text style={styles.metaText}>{item.venue}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Events</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Loader */}
      {loading ? (
        <ActivityIndicator size="large" color="#ff5722" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvent}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No events available</Text>
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
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    marginRight: 24,
     fontFamily: 'Poppins-SemiBold'
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
  },

  eventImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#eee',
  },

  eventTitle: {
    fontSize: 16,
    color: '#000',
     fontFamily: 'Poppins-Medium'
  },

  eventType: {
    fontSize: 12,
    color: '#ff5722',
    marginTop: 2,
    fontWeight: '600',
         fontFamily: 'Poppins-Regular'

  },

  eventDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
             fontFamily: 'Poppins-Regular'

  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
             fontFamily: 'Poppins-Regular'

  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
             fontFamily: 'Poppins-Regular'

  },
});
