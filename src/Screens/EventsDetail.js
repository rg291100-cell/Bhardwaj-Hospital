import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Linking
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const EventsDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const getEventDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://argosmob.uk/bhardwaj-hospital/public/api/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      console.log("Events Detail", response.data.data);

      setEvent(response.data.data);
    } catch (error) {
      console.log('Event Detail API Error:', error.response?.data || error);
      Alert.alert('Error', 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventDetail();
  }, []);

  const openFacebook = async (url) => {
    if (!url || url.trim() === '') {
      Alert.alert('URL Not Available', 'Facebook link not provided');
      return;
    }

    const webUrl = url.startsWith('http') ? url : `https://${url}`;
    const fbAppUrl = webUrl.replace(
      'https://www.facebook.com',
      'fb://facewebmodal/f?href='
    );

    try {
      await Linking.openURL(fbAppUrl);
    } catch {
      await Linking.openURL(webUrl);
    }
  };

  const openSocialLink = async (url, platformName) => {
    if (!url || url.trim() === '') {
      Alert.alert(
        'URL Not Available',
        `${platformName} link not provided by organizer`
      );
      return;
    }

    const finalUrl = url.startsWith('http') ? url : `https://${url}`;

    try {
      const supported = await Linking.canOpenURL(finalUrl);
      if (supported) {
        await Linking.openURL(finalUrl);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while opening the link');
    }
  };

  // Function to format URLs for display
  const formatUrlForDisplay = (url) => {
    if (!url) return '';
    // Remove protocol for cleaner display
    return url.replace(/^https?:\/\/(www\.)?/, '');
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff5722" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Organizer */}
        <Text style={styles.eventOrganizer}>
          {event.organizer || 'Organizer not available'}
        </Text>

        {/* Event Image */}
        <Image
          source={{
            uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/events/${event.image}`,
          }}
          style={styles.eventImage}
          // defaultSource={require('../assets/placeholder.png')}
        />

        {/* Title */}
        <Text style={styles.eventTitle}>{event.title}</Text>

        {/* Type */}
        <Text style={styles.eventType}>
          {event.type.replace('_', ' ').toUpperCase()}
        </Text>

        {/* Contact Information */}
        <Text style={styles.info}>
          Contact Person: {event.contact_person || 'Contact person not available'}
        </Text>
        <Text style={styles.info}>
          Contact Number: {event.contact_number || 'Contact number not available'}
        </Text>
        <Text style={[styles.info, { marginBottom: 8 }]}>
          Email: {event.email || 'Email not available'}
        </Text>

        {/* Website URL - IMPROVED WITH BLUE LINK */}
        {event.website_url && event.website_url.trim() !== '' && (
          <View style={styles.websiteContainer}>
            <Text style={styles.websiteLabel}>More Details: </Text>
            <TouchableOpacity
              onPress={() => openSocialLink(event.website_url, 'Website')}
              style={styles.websiteLinkContainer}
            >
              <Icon name="link" size={14} color="#2196F3" style={styles.linkIcon} />
              <Text style={styles.websiteLink} numberOfLines={1}>
                {formatUrlForDisplay(event.website_url)}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Description */}
        <Text style={styles.eventDesc}>{event.description}</Text>

        {/* Event Details Container */}
        <View style={styles.detailsContainer}>
          {/* Date */}
          <View style={styles.detailRow}>
            <Icon name="calendar" size={18} color="#666" />
            <Text style={styles.detailText}>
              {new Date(event.event_date).toDateString()}
            </Text>
          </View>

          {/* Time */}
          <View style={styles.detailRow}>
            <Icon name="clock-outline" size={18} color="#666" />
            <Text style={styles.detailText}>
              {event.start_time} - {event.end_time}
            </Text>
          </View>

          {/* Venue */}
          <View style={styles.detailRow}>
            <Icon name="map-marker" size={18} color="#666" />
            <Text style={styles.detailText}>{event.venue}</Text>
          </View>
        </View>

        {/* Social Media Icons */}
        <View style={styles.socialContainer}>
          {/* Facebook */}
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => openFacebook(event.facebook_url)}
          >
            <Image
              source={require('../assets/facebook.png')}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>

          {/* Instagram */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openSocialLink(event.instagram_url, 'Instagram')}
          >
            <Image
              source={require('../assets/instagram.png')}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>

          {/* LinkedIn */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openSocialLink(event.linkedin_url, 'LinkedIn')}
          >
            <Image
              source={require('../assets/linkedin.png')}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text style={styles.socialText}>LinkedIn</Text>
          </TouchableOpacity>

          {/* Feedback */}
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../assets/feedback.png')}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text style={styles.socialText}>Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#999',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginRight: 24,
  },
  scrollContent: {
    padding: 16,
  },
  eventImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  eventTitle: {
    fontSize: 22,
    color: '#000',
    marginBottom: 6,
    fontFamily: 'Poppins-SemiBold',
  },
  eventType: {
    fontSize: 14,
    color: '#ff5722',
    fontWeight: '600',
    marginBottom: 16,
    backgroundColor: '#ffebee',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventDesc: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
  },
  eventOrganizer: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  info: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  // Website Link Styles
  websiteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  websiteLabel: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    marginRight: 5,
  },
  websiteLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbdefb',
    flex: 1,
  },
  linkIcon: {
    marginRight: 6,
  },
  websiteLink: {
    fontSize: 14,
    color: '#2196F3', // Blue color for link
    fontFamily: 'Poppins-Medium',
    textDecorationLine: 'underline',
    flex: 1,
  },
  // Event Details Container
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  // Social Media Styles
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  socialButton: {
    alignItems: 'center',
    width: '23%',
    marginBottom: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  socialText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});