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
import { baseURL } from '../utils/api';

// 🔹 Single Report Item
const ReportItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardItem} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Icon name="file-document-outline" size={26} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.cardTitle}>{item.report_title}</Text>
          <Text style={styles.cardSubtitle}>
            {item.report_type} | {item.record_date}
          </Text>
        </View>
        <View style={styles.arrowBox}>
          <Icon name="chevron-right" size={22} color="#ff5722" />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={{ paddingHorizontal: 4 }}>
        <Text style={styles.doctorName}>
          <Icon name="stethoscope" size={14} color="#666" />  {item.doctor?.name ? `Dr. ${item.doctor.name}`.toUpperCase() : 'HOSPITAL STAFF'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// 🔹 Single Prescription Item
const PrescriptionItem = ({ item, onPress }) => {
  const parsedMedicines = typeof item.medicines === 'string' ? JSON.parse(item.medicines) : item.medicines;

  return (
    <TouchableOpacity style={styles.cardItem} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: '#ff5722' }]}>
          <Icon name="pill" size={26} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.cardTitle}>Prescription #{item.id}</Text>
          <Text style={styles.cardSubtitle}>
            {item.prescription_date?.split('T')[0]}
          </Text>
        </View>
        <View style={styles.arrowBox}>
          <Icon name="chevron-right" size={22} color="#ff5722" />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={{ paddingHorizontal: 4 }}>
        <Text style={[styles.doctorName, { marginBottom: 0 }]}>
          <Icon name="stethoscope" size={14} color="#666" />  {item.doctor?.name ? `Dr. ${item.doctor.name}`.toUpperCase() : 'DOCTOR: N/A'}
        </Text>
        {parsedMedicines?.length > 0 && (
          <Text style={{ fontSize: 13, color: '#ff5722', fontFamily: 'Poppins-Medium', marginTop: 4 }}>
            Contains {parsedMedicines.length} Medicines
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};




const ReportsScreen = ({ navigation, route }) => {
  const { appointmentId } = route.params || {};
  console.log("Appintmet Id", appointmentId);

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
        `${baseURL}/prescriptions?appointment_id=${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      console.log("prection", response.data);

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
        `${baseURL}/medical-reports`,
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
          <Icon name="file-chart-outline" size={18} color={activeTab === 'reports' ? '#fff' : '#666'} style={{ marginRight: 6 }} />
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
          <Icon name="pill" size={18} color={activeTab === 'prescriptions' ? '#fff' : '#666'} style={{ marginRight: 6 }} />
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
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={22} color="#ff5722" />
          <TextInput
            placeholder={`Search ${activeTab}...`}
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="close-circle" size={18} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
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
                navigation.navigate('PrescriptionView', { prescription: item });
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
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#ff5722',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-SemiBold',
  },
  activeTabText: {
    color: '#fff',
  },

  /* SEARCH */
  searchWrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    fontSize: 14,
  },

  /* CARD STYLES (PREMIUM) */
  cardItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#ff5722',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#111',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff0eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
    fontFamily: 'Poppins-Medium',
  },
  doctorName: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  /* MEDICINES & INSTRUCTIONS */
  medicinesContainer: {
    marginTop: 4,
    marginBottom: 10,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff5722',
    marginTop: 7,
    marginRight: 8,
  },
  medicineText: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  notesBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#ff5722',
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#444',
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
  },
  infoLabel: {
    fontFamily: 'Poppins-SemiBold',
    color: '#222',
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
