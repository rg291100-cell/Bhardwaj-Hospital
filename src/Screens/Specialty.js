import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Specialty = () => {
  const navigation = useNavigation();

  // Treatment buttons with icons
  const treatments = [
    { id: '1', title: 'Piles Treatment', icon: 'medical-bag', url: 'https://bhardwajhospitals.in/piles-treatment' },
    { id: '2', title: 'Fistula Treatment', icon: 'hospital-box-outline', url: 'https://bhardwajhospitals.in/fistula-treatment' },
    { id: '3', title: 'Fissure Treatment', icon: 'bandage', url: 'https://bhardwajhospitals.in/fissure-treatment' },
    { id: '4', title: 'Pilonidal Sinus', icon: 'needle', url: 'https://bhardwajhospitals.in/pilonidal-sinus-treatment' },
  ];

  // Services buttons with icons
  const services = [
    { id: '1', title: 'Treatments', icon: 'hand-heart-outline', url: 'https://bhardwajhospitals.in/treatments' },
    { id: '2', title: 'Orthopaedics', icon: 'bone', url: 'https://bhardwajhospitals.in/orthopaedic-surgery' },
    { id: '3', title: 'Neurosurgery', icon: 'brain', url: 'https://bhardwajhospitals.in/neuro-surgery' },
    { id: '4', title: 'Urology', icon: 'water-outline', url: 'https://bhardwajhospitals.in/urology' },
    { id: '5', title: "Women's Health", icon: 'face-woman-outline', url: 'https://bhardwajhospitals.in/women-care' },
  ];

  const openLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("Can't open this URL");
      }
    } catch (error) {
      console.log('Error opening URL:', error);
    }
  };

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      onPress={() => openLink(item.url)}
      activeOpacity={0.7}
    >
      <View style={styles.iconCircle}>
        <Icon name={item.icon || 'star-outline'} size={28} color="#ff5722" />
      </View>
      <Text style={styles.cardText}>{item.title}</Text>
      <Icon name="arrow-right-circle-outline" size={20} color="#ccc" style={styles.arrowIcon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Specialties</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 10 }}>

        {/* Banner Section */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Excellence in Care</Text>
            <Text style={styles.bannerSub}>Providing world-class medical services with compassion.</Text>
          </View>
          <View style={styles.bannerIconBox}>
            <Icon name="hospital-marker" size={40} color="#fff" />
          </View>
        </View>

        {/* Treatment Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.indicator} />
          <Text style={styles.sectionTitle}>Key Treatments</Text>
        </View>

        <View style={styles.grid}>
          {treatments.map(renderItem)}
        </View>

        {/* Services Section */}
        <View style={[styles.sectionHeader, { marginTop: 25 }]}>
          <View style={styles.indicator} />
          <Text style={styles.sectionTitle}>Medical Services</Text>
        </View>

        <View style={styles.grid}>
          {services.map(renderItem)}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Specialty;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Poppins-SemiBold'
  },
  backButton: {
    padding: 5,
  },
  banner: {
    backgroundColor: '#ff5722',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 5,
    shadowColor: '#ff5722',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  bannerSub: {
    color: '#eee',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
    paddingRight: 10,
  },
  bannerIconBox: {
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
    fontFamily: 'Poppins-SemiBold'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    width: '48%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff0eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardText: {
    color: '#333',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    lineHeight: 18,
    height: 36, // Force 2 lines max
  },
  arrowIcon: {
    marginTop: 8,
  }
});
