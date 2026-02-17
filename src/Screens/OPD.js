import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const OPD = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OPD Queue</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Doctor Info */}
      <View style={styles.doctorSection}>
        <Text style={styles.doctorName}>Dr. Amelia Chen</Text>
        <Text style={styles.opdText}>OPD 1</Text>
        <Text style={styles.specialty}>Cardiology</Text>
      </View>

      {/* Queue Info Boxes */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Current Token</Text>
        <Text style={styles.infoValue}>A12</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Your Token</Text>
        <Text style={styles.infoValue}>A15</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Estimated Wait Time</Text>
        <Text style={styles.infoValue}>15 min</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Status</Text>
        <Text style={[styles.infoValue, { color: '#248907' }]}>Available</Text>
      </View>
    </SafeAreaView>
  );
};

export default OPD;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  doctorSection: {
    marginTop: 25,
    marginBottom: 20,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  opdText: {
    fontSize: 15,
    color: '#555',
  },
  specialty: {
    fontSize: 14,
    color: '#777',
  },
  infoBox: {
    backgroundColor: '#f1f6f8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
});
