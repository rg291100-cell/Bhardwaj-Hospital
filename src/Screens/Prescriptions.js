import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const PrescriptionItem = ({ title, subtitle, isActive }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, !isActive && { backgroundColor: '#ccc' }]}>
        <Icon name="pill" size={22} color="#fff" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.medName}>{title}</Text>
        <View style={styles.subtitleRow}>
          <Icon name={isActive ? "clock-outline" : "calendar-check"} size={13} color={isActive ? '#ff5722' : '#999'} />
          <Text style={[styles.medSub, isActive && { color: '#ff5722' }]}>{subtitle}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color="#ccc" />
    </View>
  );
};

const Prescriptions = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescriptions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Your Medications</Text>
            <Text style={styles.bannerSub}>Track your active and past prescriptions in one place.</Text>
          </View>
          <View style={styles.bannerIcon}>
            <Icon name="medical-bag" size={36} color="#fff" />
          </View>
        </View>

        {/* Active Prescriptions */}
        <View style={styles.sectionHeader}>
          <View style={[styles.indicator, { backgroundColor: '#ff5722' }]} />
          <Text style={styles.sectionTitle}>Active Prescriptions</Text>
        </View>

        <PrescriptionItem
          title="Medication A"
          subtitle="Expires in 3 months"
          isActive={true}
        />
        <PrescriptionItem
          title="Medication B"
          subtitle="Expires in 6 months"
          isActive={true}
        />

        {/* Past Prescriptions */}
        <View style={[styles.sectionHeader, { marginTop: 25 }]}>
          <View style={styles.indicator} />
          <Text style={styles.sectionTitle}>Past Prescriptions</Text>
        </View>

        <PrescriptionItem
          title="Medication C"
          subtitle="Filled on 01/15/2024"
          isActive={false}
        />
        <PrescriptionItem
          title="Medication D"
          subtitle="Filled on 12/01/2023"
          isActive={false}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Prescriptions;

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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  indicator: {
    width: 4,
    height: 18,
    backgroundColor: '#888',
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
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#ff5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  medName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#222',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  medSub: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Poppins-Regular',
    marginLeft: 5,
  },
});
