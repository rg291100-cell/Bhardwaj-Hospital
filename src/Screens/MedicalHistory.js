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

const HistoryItem = ({ icon, title, date }) => {
  return (
    <View style={styles.itemRow}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={22} color="#fff" />
      </View>
      <View>
        <Text style={styles.itemTitle}>{title}</Text>
        {date && <Text style={styles.itemDate}>{date}</Text>}
      </View>
    </View>
  );
};

const MedicalHistory = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ paddingHorizontal: 20 }}>

        {/* Previous Treatments */}
        <Text style={styles.sectionTitle}>Previous Treatments</Text>
        <HistoryItem icon="pill" title="Physical Therapy" date="2022-08-15" />
        <HistoryItem
          icon="pill"
          title="Antibiotics for Sinus Infection"
          date="2021-03-20"
        />

        {/* Chronic Conditions */}
        <Text style={styles.sectionTitle}>Chronic Conditions</Text>
        <HistoryItem icon="heart-pulse" title="Asthma" />
        <HistoryItem icon="heart-pulse" title="High Blood Pressure" />

        {/* Surgery History */}
        <Text style={styles.sectionTitle}>Surgery History</Text>
        <HistoryItem icon="stethoscope" title="Appendectomy" date="2018-05-10" />

        {/* Allergy Information */}
        <Text style={styles.sectionTitle}>Allergy Information</Text>
        <HistoryItem icon="alert" title="Penicillin" />
        <HistoryItem icon="alert" title="Peanuts" />

        {/* Immunization Records */}
        <Text style={styles.sectionTitle}>Immunization Records</Text>
        <HistoryItem icon="needle" title="Flu Shot" date="2020-11-15" />
        <HistoryItem icon="needle" title="Tetanus Booster" date="2019-07-22" />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MedicalHistory;

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
    marginBottom: 10,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#ff5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  itemDate: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
  },
});
