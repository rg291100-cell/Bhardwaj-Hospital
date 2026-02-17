import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// 🔹 Single Report Item
const ReportItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.reportRow} onPress={onPress}>
      <View style={styles.iconBox}>
        <Icon name="file-document" size={24} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.reportTitle}>{item.report_title}</Text>
        <Text style={styles.reportSubtitle}>
          {item.report_type} • {item.record_date}
        </Text>
        <Text style={styles.patientName}>Patient: {item.patient?.name}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );
};

// 🔹 Single Prescription Item (Placeholder for now)
const PrescriptionItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.reportRow} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: '#4CAF50' }]}>
        <Icon name="pill" size={24} color="#fff" />
      </View>

      <View style={{ flex: 1, marginRight: 8 }}>
        <Text style={styles.reportTitle}>Prescription #{item.id}</Text>
        <Text style={styles.reportSubtitle}>
          Date: {item.prescription_date?.split('T')[0]}
        </Text>
        <Text style={styles.patientName}>
          Doctor: {item.doctor?.name || 'N/A'}
        </Text>

        {/* Medicines */}
        {item.medicines?.map((med, index) => (
          <View key={index} style={{ marginTop: 6 }}>
            <Text style={styles.medicineText}>
              {med.medicine} - {med.dosage} - {med.frequency} ({med.duration})
            </Text>
          </View>
        ))}

        {/* Instructions */}
        {item.instructions && (
          <Text style={[styles.medicineText, { marginTop: 4 }]}>
            Instructions: {item.instructions}
          </Text>
        )}

        {item.follow_up_advice && (
          <Text style={[styles.medicineText, { marginTop: 2 }]}>
            Follow-up: {item.follow_up_advice}
          </Text>
        )}
      </View>

      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );
};




const ReportsScreen = ({ navigation,route }) => {
const { appointmentId } = route.params || {};
console.log("Appintmet Id",appointmentId);

  // const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'prescriptions'
  const [activeTab, setActiveTab] = useState(
  appointmentId ? 'prescriptions' : 'reports'
);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

   const getPrescriptions = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      const response = await axios.get(
        `https://argosmob.uk/bhardwaj-hospital/public/api/prescriptions?appointment_id=${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
console.log("prection",response.data);

setPrescriptions(response.data?.prescriptions || []);
    } catch (error) {
      console.log(
        'PRESCRIPTION API ERROR:',
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPrescriptions();
  }, []);

  // 🔹 API CALL - Medical Reports
  const getMedicalReports = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get(
        'https://argosmob.uk/bhardwaj-hospital/public/api/medical-reports',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );
      // console.log("hghgfhfhgfhg",response.data);
      
      setReports(response.data?.data || []);
    } catch (error) {
      console.log(
        'MEDICAL REPORT API ERROR:',
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    getMedicalReports();
    getPrescriptions();
  }, []);

  // 🔹 SEARCH FILTER
  const filteredReports = reports.filter(item =>
    item.report_title.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredPrescriptions = prescriptions.filter(item =>
    (item.title || '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Records</Text>
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'reports' && styles.activeTabText,
            ]}>
            Reports
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'prescriptions' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('prescriptions')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'prescriptions' && styles.activeTabText,
            ]}>
            Prescriptions
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Icon name="magnify" size={20} color="#999" />
        <TextInput
          placeholder={`Search ${activeTab}...`}
          style={{ flex: 1, marginLeft: 8, fontFamily: 'Poppins-Regular' }}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* CONTENT - Reports or Prescriptions */}
      {activeTab === 'reports' ? (
        <FlatList
          data={filteredReports}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
          renderItem={({ item }) => (
            <ReportItem
              item={item}
              onPress={() =>
                navigation.navigate('ReportView', { reportId: item.id })
              }
            />
          )}
          ListEmptyComponent={
            !loading && (
              <Text style={styles.emptyText}>No medical reports found</Text>
            )
          }
        />
      ) : (
        <FlatList
          data={filteredPrescriptions}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
          renderItem={({ item }) => (
            <PrescriptionItem
              item={item}
              onPress={() => {
                // Navigate to prescription detail when ready
                console.log('Prescription clicked:', item);
              }}
            />
          )}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Icon name="prescription" size={64} color="#ddd" />
                <Text style={styles.emptyText}>No prescriptions available</Text>
                <Text style={styles.emptySubtext}>
                  Your prescriptions will appear here once you add them
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 24,
    fontFamily: 'Poppins-Medium',
    color: '#111',
  },

  /* TABS */
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#f1f4f6',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'Poppins-Medium',
  },
  activeTabText: {
    color: '#111',
    fontWeight: '600',
  },

  /* SEARCH */
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f4f6',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
  },

  /* REPORT & PRESCRIPTION ROW */
  reportRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
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
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#111',
  },
  reportSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },
  patientName: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },

  /* MEDICINES & INSTRUCTIONS */
  medicineText: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },

  /* EMPTY STATES */
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#999',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  emptySubtext: {
    textAlign: 'center',
    marginTop: 8,
    color: '#bbb',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});
