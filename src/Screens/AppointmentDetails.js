import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const baseURL = 'https://argosmob.uk/bhardwaj-hospital/public/api';

const AppointmentDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentData } = route.params || {};
  console.log('appintment data', appointmentData);

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAppointmentDetails = async id => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      const response = await axios.get(`${baseURL}/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Appointment Details:', response.data.data);
      setAppointment(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(
        'GET Appointment ERROR',
        error.response?.data || error.message,
      );
      setLoading(false);
    }
  };
  const formatAppointmentDate = isoDate => {
    if (!isoDate) return '';
    const dateObj = new Date(isoDate); 
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
  useEffect(() => {
    if (appointmentData.id) {
      getAppointmentDetails(appointmentData.id);
    }
  }, [appointmentData.id]);

  const formatDateForCalendar = isoDate => {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  };

  const deleteAppointment = async id => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }

      const response = await axios.delete(
        `https://argosmob.uk/bhardwaj-hospital/public/api/appointments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(`Appointment ${id} deleted:`, response.data);
      setLoading(false);

      Alert.alert(
        'Success',
        'Appointment deleted successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      console.log('Delete API ERROR', error.response?.data || error.message);
      setLoading(false);
    }
  };

  const formatAppointmentDateTime = (date, time) => {
    if (!date) return '';

    const dateTimeString = time ? `${date}T${time}` : date;

    const dateObj = new Date(dateTimeString);

    return dateObj
      .toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .replace(',', ' ·');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Details</Text>
        <View style={{ width: 26 }} />
      </View>
      <ScrollView
        style={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.doctorSection}>
          <View style={styles.doctordetail}>
            <Image
              source={
                appointment?.doctor?.profile_image
                  ? {
                      uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/${appointment.doctor.profile_image}`,
                    }
                  : require('../assets/Images/Doctor.png')
              }
              style={styles.doctorImage}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.doctorName}>
                Dr. {appointment?.doctor?.first_name}{' '}
                {appointment?.doctor?.last_name}
              </Text>
              <Text style={styles.specialty}>
                {appointment?.doctor?.qualifications}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Chat', {
                appointmentId: appointment?.id, // only pass appointment ID
                doctorName: `Dr. ${appointment?.doctor?.first_name} ${appointment?.doctor?.last_name}`,
                doctorImage: appointment?.doctor?.profile_image
                  ? `https://argosmob.uk/bhardwaj-hospital/storage/app/public/${appointment.doctor.profile_image}`
                  : null,
              })
            }
          >
            <Icon name="message-text-outline" size={24} color="#E66A2C" />
          </TouchableOpacity>
        </View>
        <View style={styles.bioContainer}>
          <Text style={styles.bioLabel}>Bio: </Text>
          <Text style={styles.bioText}>
            {appointment?.doctor?.bio || 'No bio available'}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment</Text>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="calendar" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Date & Time</Text>
              <Text style={styles.infoText}>
                {formatAppointmentDate(appointment?.appointment_date)} ·{' '}
                {appointment?.start_time?.substring(0, 5)}
              </Text>
            </View>
          </View>



          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="heart-pulse" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Symptoms</Text>
              <Text style={styles.infoText}>Headache, fatigue</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="note-text" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Notes</Text>
              {/* <Text style={styles.infoText}>{appointment.notes}</Text> */}
              <Text style={styles.infoText}>
                {appointment?.notes || 'No notes available'}
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescription</Text>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="pill" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Medication</Text>
              <Text style={styles.infoText}>Ibuprofen 200mg</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="clock-outline" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Dosage</Text>
              <Text style={styles.infoText}>
                Take 1 tablet every 6 hours as needed
              </Text>
            </View>
          </View>
        </View> */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow-up</Text>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name="calendar-clock" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Instructions</Text>
              <Text style={styles.infoText}>
                Schedule a follow-up in 2 weeks
              </Text>
            </View>
          </View>
        </View> */}
        <View style={styles.buttonRow}>
          {/* <TouchableOpacity
            style={styles.rescheduleButton}
            onPress={() =>
              console.log("kshdfkashk",appointment);
              
              navigation.navigate('RescheduleAppointment', {
                doctorId: appointment.doctor.id,
                appointmentId: appointment.id,
                appointmentDate: formatDateForCalendar(
                  appointment.appointment_date,
                ),
                appointmentStartTime: appointment.start_time,
                appointmentEndTime: appointment.end_time,
                resourceName: appointment.resource?.name || '',
                notes: appointment.notes || '',
              })
            }
          > */}
          <TouchableOpacity
  style={styles.rescheduleButton}
  onPress={() => {

    navigation.navigate('RescheduleAppointment', {
      doctorId: appointment.doctor.id,
      appointmentId: appointment.id,
      appointmentDate: formatDateForCalendar(
        appointment.appointment_date,
      ),
      appointmentStartTime: appointment.start_time,
      appointmentEndTime: appointment.end_time,
      resourceName: appointment.resource?.name || '',
      notes: appointment.notes || '',
        doctorImage: appointment.doctor?.profile_image || ''  , // ONLY image name/path

    });
  }}
>

            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteAppointment(appointmentData.id)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  doctorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'space-between',
  },
  doctorImage: { width: 100, height: 100, borderRadius: 50 },
  doctordetail: { flexDirection: 'row', alignItems: 'center' },
  doctorName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  specialty: { fontSize: 14, color: '#777', fontFamily: 'Poppins-Regular' },
  section: { marginTop: 25 },
  sectionTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconContainer: {
    backgroundColor: '#E66A2C',
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  infoText: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
    fontFamily: 'Poppins-Medium',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 30,
  },
  rescheduleButton: {
    backgroundColor: '#E66A2C',
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rescheduleText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  cancelButton: {
    backgroundColor: '#ffe4dc',
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#E66A2C',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  bioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows long text to wrap to the next line
    marginTop: 10,
    marginBottom: 10,
  },
  bioLabel: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  bioText: {
    fontSize: 14,
    color: '#555',
    flexShrink: 1, 
    fontFamily: 'Poppins-Medium',
  },
});
