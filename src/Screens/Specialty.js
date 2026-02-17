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

  // Treatment buttons
  const treatments = [
    { id: '1', title: 'Piles Treatment', url: 'https://bhardwajhospitals.in/piles-treatment' },
    { id: '2', title: 'Fistula Treatment', url: 'https://bhardwajhospitals.in/fistula-treatment' },
    { id: '3', title: 'Fissure Treatment', url: 'https://bhardwajhospitals.in/fissure-treatment' },
    { id: '4', title: 'Pilonidal Sinus', url: 'https://bhardwajhospitals.in/pilonidal-sinus-treatment' },
  ];

  // Services buttons
  const services = [
    { id: '1', title: 'Treatments', url: 'https://bhardwajhospitals.in/treatments' },
    { id: '2', title: 'Orthopaedics', url: 'https://bhardwajhospitals.in/orthopaedic-surgery' },
    { id: '3', title: 'Neurosurgery', url: 'https://bhardwajhospitals.in/neuro-surgery' },
    { id: '4', title: 'Urology', url: 'https://bhardwajhospitals.in/urology' },
    { id: '5', title: "Women's Health Care", url: 'https://bhardwajhospitals.in/women-care' },
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Specialty</Text>
          <View/>
        </View>

        {/* Treatment Section */}
        <Text style={styles.sectionTitle}>Treatments</Text>
        <View style={styles.buttonContainer}>
          {treatments.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.button}
              onPress={() => openLink(item.url)}
            >
              <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Services Section */}
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.buttonContainer}>
          {services.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.button}
              onPress={() => openLink(item.url)}
            >
              <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Specialty;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center',justifyContent:'space-between', marginBottom: 20 },
  headerTitle: { fontSize: 20, color: '#000', marginLeft: 10, fontFamily: 'Poppins-SemiBold' },
  sectionTitle: { fontSize: 18, color: '#000', marginVertical: 15, fontFamily: 'Poppins-SemiBold' },
  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  button: {
    backgroundColor: '#E66A2C',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 14, fontFamily: 'Poppins-Medium', textAlign: 'center' },
});
