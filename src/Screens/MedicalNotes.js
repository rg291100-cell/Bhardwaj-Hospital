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

const MedicalNotes = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Notes</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>

        {/* Diagnosis */}
        <Text style={styles.title}>Diagnosis</Text>
        <Text style={styles.text}>Acute bronchitis</Text>

        {/* Clinical Notes */}
        <Text style={styles.title}>Clinical Notes</Text>
        <Text style={styles.text}>
          Patient presents with a persistent cough, fatigue, and mild chest discomfort.
          Auscultation reveals wheezing in the lower lobes. No fever reported.
          Symptoms started 5 days ago.
        </Text>

        {/* Tests */}
        <Text style={styles.title}>Tests</Text>
        <Text style={styles.text}>
          Chest X-ray recommended to rule out pneumonia.
          Sputum culture to identify potential bacterial infection.
        </Text>

        {/* Treatment */}
        <Text style={styles.title}>Treatment</Text>
        <Text style={styles.text}>
          Prescribed amoxicillin 500mg three times daily for 7 days. 
          Advised rest, hydration, and over-the-counter cough syrup for symptomatic relief.
        </Text>

        {/* Follow-up */}
        <Text style={styles.title}>Follow-up</Text>
        <Text style={styles.text}>
          Schedule a follow-up appointment in 1 week to assess treatment response and 
          symptom resolution. Contact the clinic immediately if symptoms worsen or 
          new symptoms develop.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default MedicalNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop:20,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 24,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
  },

  text: {
    marginTop: 5,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});
