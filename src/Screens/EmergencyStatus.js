import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const EmergencyStatus = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Emergency</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ paddingHorizontal: 20 }}>

        {/* Emergency Status */}
        <Text style={styles.sectionTitle}>Emergency Status</Text>

        <View style={styles.statusRow}>
          <View style={styles.statusIconBox}>
            <Icon name="wifi" size={22} color="#fff" />
          </View>
          <View>
            <Text style={styles.statusLabel}>Doctor Connection</Text>
            <Text style={styles.statusValue}>Connected</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusIconBox}>
            <Icon name="clock-outline" size={22} color="#fff" />
          </View>
          <View>
            <Text style={styles.statusLabel}>Estimated Response Time</Text>
            <Text style={styles.statusValue}>5 minutes</Text>
          </View>
        </View>

        {/* Emergency Instructions */}
        <Text style={styles.sectionTitle}>Emergency Instructions</Text>

        <Text style={styles.instructions}>
          Stay calm and follow the doctor’s instructions. Monitor your vital signs and 
          report any changes.
        </Text>

        {/* Vital Signs */}
        <Text style={styles.sectionTitle}>Vital Signs</Text>

        {/* Heart Rate */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Heart Rate</Text>
          <Text style={styles.cardValue}>85 bpm</Text>
        </View>

        {/* Blood Pressure */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Blood Pressure</Text>
          <Text style={styles.cardValue}>120/80 mmHg</Text>
        </View>

        {/* Oxygen Level */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Oxygen Level</Text>
          <Text style={styles.cardValue}>98%</Text>
        </View>

        {/* Escalation */}
        <Text style={styles.sectionTitle}>Escalation</Text>
        <Text style={styles.instructions}>
          If your condition worsens or you need immediate assistance, press the button below to 
          escalate your emergency.
        </Text>

        <TouchableOpacity style={styles.escalateBtn}>
          <Text style={styles.escalateText}>Escalate Emergency</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmergencyStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop:10,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 24,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 25,
  },

  statusRow: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },

  statusIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ff5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  statusLabel: {
    fontSize: 15,
    fontWeight: '600',
  },

  statusValue: {
    fontSize: 14,
    color: '#777',
  },

  instructions: {
    marginTop: 8,
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },

  card: {
    borderWidth: 1,
    borderColor: '#ff5722',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
  },

  cardLabel: {
    fontSize: 15,
    color: '#555',
  },

  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 5,
  },

  escalateBtn: {
    backgroundColor: '#ff5722',
    padding: 15,
    borderRadius: 10,
    marginTop: 18,
    alignItems: 'center',
  },

  escalateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
