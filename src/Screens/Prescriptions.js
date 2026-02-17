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

const PrescriptionItem = ({ title, subtitle }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.iconBox}>
        <Icon name="pill" size={22} color="#fff" />
      </View>

      <View>
        <Text style={styles.medName}>{title}</Text>
        <Text style={styles.medSub}>{subtitle}</Text>
      </View>
    </View>
  );
};

const Prescriptions = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescriptions</Text>
      </View>

      {/* Content */}
      <ScrollView style={{ paddingHorizontal: 20 }}>

        {/* Active Prescriptions */}
        <Text style={styles.sectionTitle}>Active Prescriptions</Text>

        <PrescriptionItem
          title="Medication A"
          subtitle="Expires in 3 months"
        />

        <PrescriptionItem
          title="Medication B"
          subtitle="Expires in 6 months"
        />

        {/* Past Prescriptions */}
        <Text style={styles.sectionTitle}>Past Prescriptions</Text>

        <PrescriptionItem
          title="Medication C"
          subtitle="Filled on 01/15/2024"
        />

        <PrescriptionItem
          title="Medication D"
          subtitle="Filled on 12/01/2023"
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default Prescriptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    marginTop:20,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 30,
  },

  sectionTitle: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 17,
    fontWeight: '700',
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginBottom: 10,
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#ff5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  medName: {
    fontSize: 16,
    fontWeight: '600',
  },

  medSub: {
    fontSize: 13,
    marginTop: 3,
    color: '#777',
  },
});
