import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/api';

console.log('DEBUG: Appointment.js loaded. BASE_URL =', BASE_URL);

const Appointment = () => {
  const navigation = useNavigation();

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===================== ACTIVE CALL API (POST REQUEST) ===================== */
  const getActiveCall = async appointmentId => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log('token', token);

      if (!token) {
        console.log('❌ No access token found');
        return null;
      }

      console.log('📞 Calling active-call API...');
      console.log('Appointment ID:', appointmentId);
      console.log('URL:', `${BASE_URL}/video-call/active-call`);

      const response = await axios.post(
        `${BASE_URL}/video-call/active-call`,
        {
          appointment_id: appointmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('✅ Active Call Response:', response.data);
      return response.data;
    } catch (error) {
      console.log(
        '❌ ACTIVE CALL ERROR:',
        error.response?.data || error.message,
      );
      if (error.response) {
        console.log('Error Status:', error.response.status);
        console.log('Error Data:', error.response.data);
      }
      return null;
    }
  };

  /* ===================== FETCH APPOINTMENTS ===================== */
  const getAppointment = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('sendin id tt', response.data);

      if (response.data?.success) {
        const upcoming = [];
        const past = [];

        response.data.data.forEach(item => {
          if (item.status === 'scheduled' || item.status === 'confirmed') {
            upcoming.push(item);
          } else {
            past.push(item);
          }
        });

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
      }

      setLoading(false);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error Data:', err.response.data);
        console.log('Error Status:', err.response.status);
        console.log('Error Headers:', err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        console.log('Error Request:', err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error Message:', err.message);
      }
      setError('Failed to load appointments: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAppointment();
    }, []),
  );

  /* ===================== JOIN ENABLE LOGIC ===================== */
  const isJoinEnabled = appointment => {
    if (!appointment.appointment_date || !appointment.start_time) return false;

    const appointmentDateTime = new Date(
      `${appointment.appointment_date} ${appointment.start_time}`,
    );

    const now = new Date();

    // Allow join 5 minutes before start time
    const ALLOW_BEFORE_MINUTES = 5;
    const diffMinutes = (appointmentDateTime - now) / 60000;

    return diffMinutes <= ALLOW_BEFORE_MINUTES;
  };

  /* ===================== STATUS HELPERS ===================== */
  const getStatusStyle = status => {
    switch (status) {
      case 'scheduled':
      case 'confirmed':
        return styles.statusConfirmed;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusConfirmed;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  // const isAppointmentInPast = appointment => {
  //   if (!appointment.appointment_date || !appointment.start_time) return false;

  //   const appointmentDateTime = new Date(
  //     `${appointment.appointment_date} ${appointment.start_time}`
  //   );

  //   return new Date() > appointmentDateTime;
  // };
  const isJoinWindowClosed = appointment => {
    if (!appointment.appointment_date || !appointment.start_time) return true;

    const startDateTime = new Date(
      `${appointment.appointment_date} ${appointment.start_time}`
    );

    const now = new Date();

    const ALLOW_BEFORE_MINUTES = 5;
    const ALLOW_AFTER_MINUTES = 15; // grace period after start

    const joinStartTime = new Date(
      startDateTime.getTime() - ALLOW_BEFORE_MINUTES * 60000
    );

    const joinEndTime = new Date(
      startDateTime.getTime() + ALLOW_AFTER_MINUTES * 60000
    );

    return now < joinStartTime || now > joinEndTime;
  };


  /* ===================== HANDLE JOIN BUTTON PRESS ===================== */
  // Updated handleJoinPress with better debugging

  // const handleJoinPress = async (appointmentId) => {
  //   console.log('🎯 JOIN PRESSED');
  //   console.log('Appointment ID:', appointmentId);

  //   try {
  //     const token = await AsyncStorage.getItem('access_token');
  //     if (!token) {
  //       Alert.alert('Error', 'Please login again');
  //       return;
  //     }

  //     const response = await axios.get(
  //       `${BASE_URL}/video-call/active-call`,
  //       {
  //         params: { appointment_id: appointmentId },
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: 'application/json',
  //         },
  //       }
  //     );

  //     console.log('✅ Active Call Response:', response.data);
  //     console.log('✅ Active Call id :', response?.data?.data?.call_id);
  // const callId = response?.data?.data?.call_id;

  // {{baseURL}}/video-call/join

  // {
  //     "call_id" : 9
  // }

  // this is how denfint the callId to this api

  //     // if (response.data?.success) {
  //     //   navigation.navigate('VideoCall', {
  //     //     appointmentId,
  //       // });
  //     // } else {
  //     //   Alert.alert(
  //     //     'Call Not Started',
  //     //     response.data?.message || 'Doctor has not started the call yet',
  //     //   );
  //     // }

  //   } catch (error) {
  //     console.log('❌ ERROR:', error.response?.data || error.message);

  //     Alert.alert(
  //       'Error',
  //       error.response?.data?.message || 'Something went wrong',
  //     );
  //   }
  // };

  const handleJoinPress = async appointmentId => {
    console.log('🎯 JOIN PRESSED');
    console.log('Appointment ID:', appointmentId);

    try {
      // Get token
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Error', 'Please login again');
        return;
      }
      console.log('token', token);

      // 1️⃣ Get active call for this appointment
      const activeCallResponse = await axios.get(
        `${BASE_URL}/video-call/active-call`,
        {
          params: { appointment_id: appointmentId },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      console.log('✅ Active Call Response:', activeCallResponse.data);

      // Extract call_id
      const callId = activeCallResponse?.data?.data?.call_id;
      if (!callId) {
        Alert.alert('Call Not Started', 'Doctor has not started the call yet');
        return;
      }

      console.log('✅ Call ID to join:', callId);

      // 2️⃣ Join the call
      const joinResponse = await axios.post(
        `${BASE_URL}/video-call/join`,
        { call_id: callId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      console.log('✅ sending the call id  Join Response:', joinResponse.data);

      navigation.navigate('VideoCall', {
        appointmentId,
        // callId,
        channelName: joinResponse?.data?.data?.channel_name,
        agoraToken: joinResponse?.data?.data?.token,
        uid: joinResponse?.data?.data?.uid,
      });
    } catch (error) {
      console.log('❌ ERROR:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong',
      );
    }
  };

  /* ===================== APPOINTMENT CARD ===================== */
  const renderAppointmentCard = (appointment, index) => {
    const doctorName = `${appointment.doctor?.first_name || ''} ${appointment.doctor?.last_name || ''
      }`.trim();

    const joinEnabled = isJoinEnabled(appointment);

    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          navigation.navigate('AppointmentDetails', {
            appointmentData: appointment,
          })
        }
      >
        <View style={styles.appointmentRow}>
          <Image
            source={
              appointment.doctor?.profile_image
                ? {
                  uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/${appointment.doctor.profile_image}`,
                }
                : require('../assets/Images/Doctor.png')
            }
            style={styles.doctorImage}
          />

          <View style={styles.appointmentInfo}>
            <Text style={[getStatusStyle(appointment.status)]}>
              {getStatusText(appointment.status)}
            </Text>

            <Text style={styles.doctorText}>
              Dr. {doctorName} ·{' '}
              <Text style={styles.timeText}>
                {appointment.start_time?.substring(0, 5)}
              </Text>
            </Text>
          </View>

          {/* ===================== JOIN BUTTON ===================== */}
          <View>
            {appointment.status === 'scheduled' &&
              appointment.type === 'video' &&
              !isJoinWindowClosed(appointment) && (
                <TouchableOpacity
                  disabled={!joinEnabled}
                  style={[
                    styles.joinButton,
                    !joinEnabled && styles.joinButtonDisabled,
                  ]}
                  onPress={() => handleJoinPress(appointment.id)}
                >
                  <Text style={styles.joinText}>
                    {joinEnabled ? 'Join' : 'Not Started'}
                  </Text>
                </TouchableOpacity>
              )}

            <TouchableOpacity
              onPress={() => {
                console.log('Prescription appointment ID:', appointment.id);
                navigation.navigate('ReportsScreen', { appointmentId: appointment.id });
              }} style={[
                styles.joinButton,
                {
                  marginTop:
                    appointment.status === 'scheduled' &&
                      appointment.type === 'video'
                      ? 10
                      : 0,
                },
              ]}
            >
              <Text style={styles.joinText}>Prescription</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /* ===================== UI ===================== */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} />
        </TouchableOpacity> */}
        <View />
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity onPress={getAppointment}>
          <Icon name="refresh" size={26} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#248907" />
          <Text>Loading appointments...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {upcomingAppointments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming</Text>
              {upcomingAppointments.map(renderAppointmentCard)}
            </View>
          )}

          {pastAppointments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Past</Text>
              {pastAppointments.map(renderAppointmentCard)}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Appointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  /* ================= HEADER ================= */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    backgroundColor: '#fff',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },

  /* ================= SECTIONS ================= */
  section: {
    paddingHorizontal: 16,
    marginTop: 18,
  },

  sectionTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
    fontFamily: 'Poppins-Medium',
  },

  /* ================= APPOINTMENT CARD ================= */
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },

  doctorImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
  },

  appointmentInfo: {
    flex: 1,
  },

  doctorText: {
    fontSize: 15,
    color: '#000',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },

  timeText: {
    color: '#777',
    fontFamily: 'Poppins-Regular',
  },

  /* ================= STATUS ================= */
  statusConfirmed: {
    color: '#248907',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },

  statusCompleted: {
    color: '#1a73e8',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },

  statusCancelled: {
    color: '#d32f2f',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },

  /* ================= JOIN BUTTON ================= */
  joinButton: {
    backgroundColor: '#248907',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },

  joinButtonDisabled: {
    backgroundColor: '#c8e6c9',
  },

  joinText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },

  /* ================= STATES ================= */
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },

  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    fontFamily: 'Poppins-SemiBold',
  },

  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
