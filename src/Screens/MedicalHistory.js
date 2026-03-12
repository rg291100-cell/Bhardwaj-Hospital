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

const HistoryItem = ({ icon, title, date, isLast }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.leftCol}>
        <View style={[styles.iconBox, { backgroundColor: '#fff4f0' }]}>
          <Icon name={icon} size={24} color="#ff5722" />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={styles.rightCol}>
        <View style={styles.historyCard}>
          <Text style={styles.itemTitle}>{title}</Text>
          {date && (
            <View style={styles.dateRow}>
              <Icon name="calendar-clock" size={14} color="#888" />
              <Text style={styles.itemDate}>{date}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const MedicalHistory = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 10 }}>

        {/* Intro Illustration area replacement with a banner */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Your Health Journey</Text>
            <Text style={styles.bannerSub}>Keep track of your medical milestones and history.</Text>
          </View>
          <View style={styles.bannerIconCircle}>
            <Icon name="chart-timeline-variant" size={36} color="#fff" />
          </View>
        </View>

        {/* Previous Treatments */}
        <View style={styles.sectionHeader}>
          <View style={styles.indicator} />
          <Text style={styles.sectionTitle}>Previous Treatments</Text>
        </View>
        <HistoryItem icon="pill" title="Physical Therapy" date="Aug 15, 2022" />
        <HistoryItem
          icon="pill"
          title="Antibiotics for Sinus Infection"
          date="Mar 20, 2021"
        />

        {/* Chronic Conditions */}
        <View style={[styles.sectionHeader, { marginTop: 25 }]}>
          <View style={styles.indicator} />
          <Text style={styles.sectionTitle}>Chronic Conditions</Text>
        </View>
        <HistoryItem icon="heart-pulse" title="Asthma" />
        <HistoryItem icon="heart-pulse" title="High Blood Pressure" />

        {/* Surgery History */}
        <View style={[styles.sectionHeader, { marginTop: 25 }]}>
          <View style={styles.indicator} />
          <Text style={styles.sectionTitle}>Surgery History</Text>
        </View>
        <HistoryItem icon="stethoscope" title="Appendectomy" date="May 10, 2018" />

        {/* Allergy Information */}
        <View style={[styles.sectionHeader, { marginTop: 25 }]}>
          <View style={styles.indicator} />
          <Text style={styles.sectionTitle}>Allergies</Text>
        </View>
        <HistoryItem icon="alert-decagram-outline" title="Penicillin" />
        <HistoryItem icon="alert-decagram-outline" title="Peanuts" />

        {/* Immunization Records */}
        <View style={[styles.sectionHeader, { marginTop: 25 }]}>
          <View style={styles.indicator} />
          <Text style={styles.sectionTitle}>Immunizations</Text>
        </View>
        <HistoryItem icon="needle" title="Flu Shot" date="Nov 15, 2020" />
        <HistoryItem icon="needle" title="Tetanus Booster" date="Jul 22, 2019" isLast={true} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MedicalHistory;

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
    paddingRight: 10,
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
    marginBottom: 15,
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
  itemContainer: {
    flexDirection: 'row',
    minHeight: 80,
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 15,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 4,
  },
  rightCol: {
    flex: 1,
    paddingBottom: 20,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  itemTitle: {
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins-SemiBold',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  itemDate: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginLeft: 6,
  },
});
