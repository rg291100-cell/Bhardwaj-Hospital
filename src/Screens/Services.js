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

      const response = await axios.get(
        'https://argosmob.uk/bhardwaj-hospital/public/api/services',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

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
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconBox}>
          <Icon name="hospital-box-outline" size={24} color="#ff5722" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.serviceCategory}>{item.category}</Text>
          <Text style={styles.serviceDesc}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <View style={{ width: 24 }} />
      </View>

      <StatusBar barStyle="dark-content" />

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderService}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Hospital Services</Text>
        }
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>No services available</Text>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    elevation: 2,
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#ffe7dd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },

  serviceCategory: {
    fontSize: 13,
    color: '#ff5722',
    marginTop: 2,
  },

  serviceDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
});

export default Services;
