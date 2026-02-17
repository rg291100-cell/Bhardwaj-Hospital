import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const Emergency = ({ navigation }) => {
  const [emergencyList, setEmergencyList] = useState([]);
  const [loading, setLoading] = useState(true);

  const emergencyRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get(
        'https://argosmob.uk/bhardwaj-hospital/public/api/emergency',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      setEmergencyList(response.data?.data || []);
    } catch (error) {
      console.log(
        'Emergency API Error:',
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    emergencyRequest();
  }, []);

  // 🔹 CARD UI
  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.patient_name}</Text>
          <Text style={styles.triage(item.triage_level)}>
            {item.triage_level}
          </Text>
        </View>

        <Text style={styles.case}>Case No: {item.case_number}</Text>

        <View style={styles.row}>
          <Text style={styles.meta}>Age: {item.age}</Text>
          <Text style={styles.meta}>Gender: {item.gender}</Text>
          <Text style={styles.meta}>
            Priority: {item.priority_score}
          </Text>
        </View>

        <Text style={styles.symptoms}>
          Symptoms: {item.symptoms}
        </Text>

        <Text style={styles.status}>
          Status: {item.status?.toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Emergency</Text>

        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={emergencyList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.empty}>No emergency cases found</Text>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Emergency;

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
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    marginRight: 24,
    fontFamily:"Poppins-SemiBold"
  },

  card: {
    backgroundColor: '#F9F9F9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
        fontFamily:"Poppins-Medium"

  },

  case: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
      fontFamily:"Poppins-Medium"
  },

  meta: {
    fontSize: 13,
    color: '#444',
      fontFamily:"Poppins-Medium"
  },

  symptoms: {
    fontSize: 13,
    color: '#333',
    marginTop: 6,
      fontFamily:"Poppins-Medium"
  },

  status: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#D32F2F',
      fontFamily:"Poppins-Medium"
  },

  triage: (level) => ({
    fontSize: 12,
  fontFamily:"Poppins-Medium",
      color:
      level === 'Red'
        ? '#E53935'
        : level === 'Green'
        ? '#43A047'
        : '#1E88E5',
  }),

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
      fontFamily:"Poppins-Medium"
  },
});
