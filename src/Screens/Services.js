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
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseURL } from '../utils/api';

const Services = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const getServices = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }

      const response = await axios.get(`${baseURL}/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      setServices(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const renderService = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.iconContainer}>
          <Icon name="hospital-marker" size={30} color="#ff5722" />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.category || 'General'}</Text>
            </View>
          </View>

          <Text style={styles.serviceDesc} numberOfLines={2}>
            {item.description || 'Professional medical service provided by BHARDWAJ HOSPITAL experts.'}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.learnMore}>Explore Details</Text>
            <Icon name="chevron-right" size={18} color="#ff5722" />
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
        <Text style={styles.headerTitle}>Our Services</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        contentContainerStyle={{ padding: 20, paddingTop: 10 }}
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderService}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.banner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>World-Class Healthcare</Text>
                <Text style={styles.bannerSub}>Comprehensive medical facilities for you and your family.</Text>
              </View>
              <View style={styles.bannerIconCircle}>
                <Icon name="heart-pulse" size={36} color="#fff" />
              </View>
            </View>
            <View style={styles.sectionHeader}>
              <View style={styles.indicator} />
              <Text style={styles.sectionTitle}>Hospital Services</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Icon name="alert-circle-outline" size={60} color="#ddd" />
              <Text style={styles.emptyText}>No services available at the moment</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

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
  banner: {
    backgroundColor: '#ff5722',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 6,
    shadowColor: '#ff5722',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  bannerSub: {
    color: '#ffe4db',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
    paddingRight: 20,
  },
  bannerIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  indicator: {
    width: 4,
    height: 18,
    backgroundColor: '#ff5722',
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#fff4f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardBody: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#222',
    flex: 1,
  },
  badge: {
    backgroundColor: '#f1f3f8',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 10,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#ff5722',
    textTransform: 'uppercase',
  },
  serviceDesc: {
    fontSize: 13,
    color: '#777',
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  learnMore: {
    fontSize: 12,
    color: '#ff5722',
    fontFamily: 'Poppins-SemiBold',
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#bbb',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});

export default Services;
