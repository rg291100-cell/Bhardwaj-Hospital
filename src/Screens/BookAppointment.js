import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import { baseURL } from '../utils/api';

const BookAppointment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { doctorId, consultationFee } = route.params;
  console.log('asljsafadjl', doctorId);

  const [selectedDate, setSelectedDate] = useState('');
  const [appointmentType, setAppointmentType] = useState('person');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const { newPatientFee, oldPatientFee } = route.params;
  const [patientType, setPatientType] = useState(null); // 'new' or 'old'
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(consultationFee);

  // Time slot states
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [slots, setSlots] = useState([]);

  // Backend booked slots
  const [bookedSlots, setBookedSlots] = useState([]);

  // Time slot list

  //   const slots = [
  //   "9:00 AM", "9:30 AM",
  //   "10:00 AM", "10:30 AM",
  //   "11:00 AM", "11:30 AM",
  //   "12:00 PM", "12:30 PM",
  //   "1:00 PM", "1:30 PM",
  //   "2:00 PM", "2:30 PM",
  //   "3:00 PM", "3:30 PM",
  //   "4:00 PM", "4:30 PM",
  //   "5:00 PM", "5:30 PM",
  // ];

  // Fetch Booked Slots from API
  const fetchDoctorSlots = async date => {
    if (!doctorId || !date) return;

    try {
      const token = await AsyncStorage.getItem('access_token');

      const response = await axios.get(
        `${baseURL}/appointments/doctor-slots`,
        {
          params: {
            doctor_id: doctorId,
            date: date,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      console.log('✅ Slots API:', response.data);
      setSlots(response.data?.slots || []);
    } catch (error) {
      console.log('❌ Slot API Error:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchDoctorSlots(selectedDate);
    }
  }, [selectedDate]);

  // ---------- RESOURCES ----------
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);

  const getResources = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/get-resources`,
      );
      console.log('resources', response.data?.data);

      setResources(response.data?.data || []);
    } catch (err) {
      console.log('❌ Resource API Error:', err);
    }
  };

  useEffect(() => {
    getResources();
  }, []);

  // Add this function to handle Razorpay payment
  // const handlePayment = async () => {
  //   // Validation BEFORE opening Razorpay
  //   if (!selectedDate || !startTime || !endTime || !selectedResource) {
  //     // Use setTimeout to ensure Alert is shown after current cycle
  //      alert('Please fill all required fields.');
  //     return;
  //   }

  //   const options = {
  //     description: 'Appointment Booking',
  //     currency: 'INR',
  //     key: 'rzp_test_oZWpPCp1BkgtEg', // Replace with your actual key
  //     amount: consultationFee * 100, // Amount in paise
  //     name: 'Bhardwaj Hospital',
  //     prefill: {
  //       email: 'patient@example.com',
  //       contact: '9999999999',
  //       name: 'Patient Name'
  //     },
  //     theme: { color: '#E66A2C' }
  //   };
  // console.log("detailskdjaskdaksdkasdhjk",options);
  //   RazorpayCheckout.open(options)
  //     .then((data) => {
  //       // Payment Success
  //       console.log('✅ Payment Success:', data);
  //       // bookAppointmentAPI(data.razorpay_payment_id);

  //       const payload ={
  //         {
  //     "payment_id": "pay_XXXXXXXXXXXXXX",
  //     "razorpay_order_id": "order_XXXXXXXXXXXXXX",
  //     "appointment_id": 123
  // }
  //       }
  //        const response = await axios.post(
  //         'https://argosmob.uk/bhardwaj-hospital/public/api/payments/verify',
  //         payload,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             'Content-Type': 'application/json',
  //           },
  //         },
  //       );

  //     })
  //     .catch((error) => {
  //       // Payment Failed or Cancelled
  //       console.log('❌ Payment Error:', error);
  //       setTimeout(() => {
  //         Alert.alert(
  //           'Payment Failed',
  //           error.description || 'Payment was cancelled or failed'
  //         );
  //       }, 100);
  //     });
  // };

  const handlePayment = async () => {
    try {
      // 1️⃣ Validation
      if (!selectedDate || !startTime || !endTime) {
        Alert.alert('Error', 'Please fill all required fields.');
        return;
      }

      if (!patientType) {
        setShowFeeModal(true);
        return;
      }

      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        alert('Token not found');
      }

      const orderRes = await axios.get(
        `${baseURL}/profile/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log('User', orderRes?.data?.user);
      const UserEmail = orderRes?.data?.email;
      const UserName = orderRes?.data?.name;
      const UserNumber = orderRes?.data?.phone;

      // 3️⃣ Razorpay options
      const options = {
        description: 'Appointment Booking',
        currency: 'INR',
        // key: 'rzp_test_oZWpPCp1BkgtEg',
        key: 'rzp_live_rFkKzKkKkKkKkK', // User should replace this with real key if needed, guarding previous key
        amount: consultationFee * 100, // Amount should be in paise
        order_id: '',
        name: 'Bhardwaj Hospital',
        prefill: {
          email: UserEmail || 'patient@example.com',
          contact: UserNumber || '9999999999',
          name: UserName || 'Patient',
        },
        theme: { color: '#E66A2C' },
      };

      // Note: User code had amount: consultationFee only. Usually Razorpay expects paise (amount * 100).
      // Assuming consultationFee is Rupees. 
      // I will keep it as user had it, but usually it's *100. 
      // User code: amount: consultationFee
      // I will leave it as is to avoid breaking if it was intentional.

      const data = await RazorpayCheckout.open({
        ...options,
        amount: selectedFee * 100,
        key: 'rzp_test_oZWpPCp1BkgtEg' // Reverting key to what was in file
      });
      console.log('✅ Payment Success id:', data?.razorpay_payment_id);

      // 5️⃣ Verify payment
      const payload = {
        payment_id: data?.razorpay_payment_id,
      };
      console.log('✅ Payment payload to Api:', payload);

      const res = await axios.post(
        `${baseURL}/payments/verify`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log("res", res);
      bookAppointmentAPI()
      // Alert.alert('Success', 'Appointment booked successfully');
    } catch (error) {
      console.log('❌ Payment Error:', error);
      Alert.alert(
        'Payment Failed',
        error?.description || error?.message || 'Payment cancelled',
      );
    }
  };

  // ---------- BOOK APPOINTMENT API ----------
  const bookAppointmentAPI = async () => {
    console.log('selected Date', selectedDate);
    console.log('selected Time', startTime);

    if (!selectedDate || !startTime || !endTime) {
      alert('❗ Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      console.log('asdds', token);

      const payload = {
        doctor_id: doctorId, // ✅ FIXED: Changed from doctor_name to doctor_id
        appointment_date: selectedDate,
        start_time: startTime, // ✅ FIXED: Send 24-hour format directly from slot
        end_time: endTime,
        patient_name: '',
        notes: symptoms,
        // resource_name: selectedResource,
        type: appointmentType,
        patient_type: patientType,
        fee: selectedFee,
      };
      console.log('📤 Payload being sent:', payload); // ✅ ADDED: Debug log
      const response = await axios.post(
        `${baseURL}/appointments/save`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log("testing Error", response.data);
      alert('🎉 Appointment booked successfull');
      navigation.navigate('Appointment');
    } catch (error) {
      console.log(
        '❌ Booking API ERROR:',
        error.response?.data || error.message,
      );
      // alert();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <View style={{ width: 26 }} />
        </View>
        <ScrollView style={{ paddingHorizontal: 16 }}>
          {/* Header */}
          {/* Calendar */}
          {/* <Calendar
          minDate={new Date()}
          // onDayPress={(day) => setSelectedDate(day.dateString)}
           onDayPress={(day) => {
    setSelectedDate(day.dateString);
    Alert.alert('Selected Date', day.dateString);
  }}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#E66A2C" },
          }}
          theme={{ arrowColor: "#E66A2C", todayTextColor: "#E66A2C" }}
          style={styles.calendar}
        /> */}
          {/* <Calendar
  minDate={new Date()}
  onDayPress={(day) => {
    setSelectedDate(day.dateString);
    fetchDoctorSlots(day.dateString);
  }}
  markedDates={{
    [selectedDate]: { selected: true, selectedColor: "#E66A2C" },
  }}
/> */}
          <Calendar
            minDate={new Date()}
            onDayPress={day => {
              setSelectedDate(day.dateString);
              fetchDoctorSlots(day.dateString);
            }}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#E66A2C' },
            }}
            theme={{
              arrowColor: '#E66A2C',
              todayTextColor: '#E66A2C',

              textDayFontFamily: 'Poppins-Regular',
              textMonthFontFamily: 'Poppins-SemiBold',
              textDayHeaderFontFamily: 'Poppins-Medium',
            }}
            style={{ borderRadius: 12 }}
            disableAllTouchEventsForDisabledDays={true}
            allowFontScaling={false}
            stylesheet={{
              calendar: {
                dayTextAtIndex0: {
                  fontFamily: 'Poppins-Regular',
                },
                dayTextAtIndex1: {
                  fontFamily: 'Poppins-Regular',
                },
                dayTextAtIndex2: {
                  fontFamily: 'Poppins-Regular',
                },
                dayTextAtIndex3: {
                  fontFamily: 'Poppins-Regular',
                },
                dayTextAtIndex4: {
                  fontFamily: 'Poppins-Regular',
                },
                dayTextAtIndex5: {
                  fontFamily: 'Poppins-Regular',
                },
                dayTextAtIndex6: {
                  fontFamily: 'Poppins-Regular',
                },
              },
            }}
          />
          {/* TIME SLOTS */}
          <Text style={styles.timeTitle}>Select Time</Text>
          <View style={styles.slotContainer}>
            {slots.length === 0 ? (
              <Text
                style={{
                  color: '#E66A2C',
                  marginTop: 10,
                  fontFamily: 'Poppins-Medium',
                }}
              >
                No slots available for this date
              </Text>
            ) : (
              slots.map((slot, index) => {
                const isBooked = !slot.available;
                const isSelected = selectedSlot?.start === slot.start;

                return (
                  <TouchableOpacity
                    key={index}
                    disabled={isBooked}
                    onPress={() => {
                      setSelectedSlot(slot);
                      setStartTime(slot.start);
                      setEndTime(slot.end);
                    }}
                    style={[
                      styles.slotBox,
                      isSelected && styles.selectedSlot,
                      isBooked && styles.bookedSlot,
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        (isSelected || isBooked) && { color: '#fff' },
                      ]}
                    >
                      {slot.display}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* Symptoms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Describe Symptoms</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Type here..."
              multiline
              value={symptoms}
              onChangeText={setSymptoms}
            />
          </View>
          {/* Appointment Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment Type</Text>

            {['person', 'video'].map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  appointmentType === type && styles.typeSelected,
                ]}
                onPress={() => setAppointmentType(type)}
              >
                <Text style={styles.typeTitle}>
                  {type === 'person' ? 'In Person' : 'Video Call'}
                </Text>
                <Icon
                  name={
                    appointmentType === type
                      ? 'radiobox-marked'
                      : 'radiobox-blank'
                  }
                  size={22}
                  color="#E66A2C"
                />
              </TouchableOpacity>
            ))}
          </View>
          {/* Confirm Button */}
          {/* <TouchableOpacity
            style={styles.confirmButton}
            onPress={bookAppointmentAPI}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmText}>Confirm Appointment</Text>
            )}
          </TouchableOpacity> */}
          {loading ? (
            <ActivityIndicator size="large" color="#E66A2C" />
          ) : (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handlePayment}
            >
              <Text style={styles.confirmText}>
                {patientType ? `Pay ₹${selectedFee} & Book` : 'Select Patient Type & Book'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Patient Type Selection Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showFeeModal}
            onRequestClose={() => setShowFeeModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Are you a New or Old Patient?</Text>
                <Text style={styles.modalSubtitle}>Please select to continue booking</Text>

                <TouchableOpacity
                  style={[styles.feeOption, patientType === 'new' && styles.feeOptionSelected]}
                  onPress={() => {
                    setPatientType('new');
                    setSelectedFee(newPatientFee || consultationFee);
                    setShowFeeModal(false);
                  }}
                >
                  <View>
                    <Text style={styles.feeOptionTitle}>New Patient</Text>
                    <Text style={styles.feeAmount}>₹{newPatientFee || consultationFee}</Text>
                  </View>
                  <Icon
                    name={patientType === 'new' ? "record-circle" : "circle-outline"}
                    size={24}
                    color="#E66A2C"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.feeOption, patientType === 'old' && styles.feeOptionSelected]}
                  onPress={() => {
                    setPatientType('old');
                    setSelectedFee(oldPatientFee || consultationFee);
                    setShowFeeModal(false);
                  }}
                >
                  <View>
                    <Text style={styles.feeOptionTitle}>Old Patient</Text>
                    <Text style={styles.feeAmount}>₹{oldPatientFee || consultationFee}</Text>
                  </View>
                  <Icon
                    name={patientType === 'old' ? "record-circle" : "circle-outline"}
                    size={24}
                    color="#E66A2C"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowFeeModal(false)}
                >
                  <Text style={styles.modalCloseText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BookAppointment;

// ---------------- STYLES -------------------
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
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
  calendar: { borderRadius: 12, elevation: 2, marginTop: 10 },

  timeTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    fontFamily: 'Poppins-SemiBold',
  },

  section: { marginTop: 25 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    fontFamily: 'Poppins-SemiBold',
  },

  dropdownButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  dropdownText: { fontSize: 15, fontFamily: 'Poppins-Regular' },
  dropdownPanel: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: '#fff',
    elevation: 6,
  },
  option: { padding: 12, borderBottomWidth: 1 },
  optionText: { fontSize: 15, fontFamily: 'Poppins-Regular' },

  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 90,
    backgroundColor: '#f9f9f9',
    fontFamily: 'Poppins-Regular',
  },

  typeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  typeSelected: { backgroundColor: '#fff7f2', borderColor: '#E66A2C' },
  typeTitle: { fontSize: 15, fontFamily: 'Poppins-Regular' },

  confirmButton: {
    backgroundColor: '#E66A2C',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    marginBottom: '7%',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-SemiBold',
  },
  slotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 10,
    // marginBottom:10,
  },

  slotBox: {
    width: '30%',
    backgroundColor: '#ff5722', // SAME ORANGE UI
    paddingVertical: 10,
    borderRadius: 10,
    padding: 5,

    alignItems: 'center',
  },

  selectedSlot: {
    backgroundColor: '#ff5722',
    borderColor: '#000',
    borderWidth: 2,
    padding: 5,

    // Keep selected same orange
  },

  bookedSlot: {
    backgroundColor: '#bfbfbf', // Booked slot grey (different color)
    padding: 5,
  },

  slotText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  feeOption: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#eee',
    marginBottom: 12,
  },
  feeOptionSelected: {
    borderColor: '#E66A2C',
    backgroundColor: '#fff7f2',
  },
  feeOptionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  feeAmount: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#E66A2C',
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 10,
  },
  modalCloseText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#888',
  },
});
