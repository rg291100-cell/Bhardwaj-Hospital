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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RescheduleAppointment = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    doctorId,
    appointmentId,
    appointmentDate,
    appointmentStartTime,
    appointmentEndTime,
    resourceName,
    notes,
  } = route.params || {};

  console.log('id ======>', doctorId);
  console.log('appointmentId ======>', appointmentId);

  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(appointmentDate || '');
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);

  // Time slot states
  const [selectedSlot, setSelectedSlot] = useState(null);
  // const [startTime, setStartTime] = useState('');
  // const [endTime, setEndTime] = useState('');
  const [appointmentDateD, setAppointmentDateD] = useState(
    appointmentDate || '',
  );
  const [startTime, setStartTime] = useState(appointmentStartTime || '');
  const [endTime, setEndTime] = useState(appointmentEndTime || '');
  const [notess, setNotess] = useState(notes || '');

  // Backend booked slots
  const [bookedSlots, setBookedSlots] = useState([]);

  // ---------- RESOURCES ----------
  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState(''); // ✅ Store ID
  const [selectedResourceName, setSelectedResourceName] = useState(''); // ✅ Store name for display
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  // In your useEffect for initializing from route params
  useEffect(() => {
    if (appointmentDate) setSelectedDate(appointmentDate);
    if (resourceName) {
      setSelectedResourceName(resourceName);
      setSelectedResourceId(route.params.resourceId || ''); // make sure you pass resourceId in params
    }
    if (notes) setSymptoms(notes);
    if (appointmentStartTime) setStartTime(appointmentStartTime);
    if (appointmentEndTime) setEndTime(appointmentEndTime);
    if (route.params.appointmentType)
      setAppointmentType(route.params.appointmentType);
  }, [
    appointmentDate,
    resourceName,
    route.params.resourceId,
    notes,
    appointmentStartTime,
    appointmentEndTime,
    route.params.appointmentType,
  ]);

  // Fetch Booked Slots from API
  const fetchBookedSlots = async date => {
    if (!doctorId || !date) {
      console.log(
        '⚠️ Cannot fetch booked slots. Missing:',
        !doctorId ? 'doctorId' : '',
        !date ? 'date' : '',
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');
      const url = `https://argosmob.uk/bhardwaj-hospital/public/api/appointments/doctor-slots?doctor_id=${doctorId}&date=${date}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      console.log('✅ Booked Slots API Response:', response.data);
      setSlots(response.data?.slots || []);
    } catch (err) {
      console.log('❌ Slot Fetch Error:', err.response?.data || err.message);
    }
  };

  // Get Resources from API
  const getResources = async () => {
    try {
      const response = await axios.get(
        'https://argosmob.uk/bhardwaj-hospital/public/api/get-resources',
      );
      console.log('✅ Resources fetched:', response.data?.data);
      setResources(response.data?.data || []);
    } catch (err) {
      console.log('❌ Resource API Error:', err.response?.data || err.message);
    }
  };

  // Convert 12-hour time to 24-hour format
  const convertTo24Hour = time12h => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  // ✅ Fetch resources on mount
  useEffect(() => {
    getResources();
  }, []);

  // Set default values from params
  useEffect(() => {
    if (appointmentDate) {
      setSelectedDate(appointmentDate);
    }

    if (resourceName) {
      setSelectedResourceName(resourceName);
    }

    if (notes) {
      setSymptoms(notes);
    }

    if (appointmentStartTime && appointmentEndTime) {
      setStartTime(appointmentStartTime);
      setEndTime(appointmentEndTime);
    }
  }, [
    appointmentDate,
    resourceName,
    notes,
    appointmentStartTime,
    appointmentEndTime,
  ]);

  // Auto-select slot when slots load
  useEffect(() => {
    if (slots.length > 0 && startTime && endTime) {
      const defaultSlot = slots.find(
        s => s.start === startTime && s.end === endTime,
      );
      if (defaultSlot) {
        setSelectedSlot(defaultSlot);
      }
    }
  }, [slots, startTime, endTime]);

  // Fetch slots when date changes
  useEffect(() => {
    if (appointmentDate) {
      fetchBookedSlots(appointmentDate);
    }
  }, [appointmentDate]);

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  // ---------- UPDATE APPOINTMENT API ----------
  const UpdateAppointmentAPI = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access_token');

      const payload = {
        doctor_id: doctorId,
        appointment_date: selectedDate || appointmentDate,
        start_time: startTime || appointmentStartTime,
        end_time: endTime || appointmentEndTime,
        notes: symptoms || notes,
        // resource_id: selectedResourceId || route.params.resourceId || null,
      };

      console.log('📤 Payload being sent:', payload);

      const response = await axios.post(
        `https://argosmob.uk/bhardwaj-hospital/public/api/appointments/${appointmentId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('✅ Update Response:', response.data);
      alert('🎉 Appointment updated successfully!');
      navigation.navigate('TabNavigation', {
        screen: 'Appointments',
        params: { refresh: true },
      });
    } catch (error) {
      console.log(
        '❌ Update API ERROR:',
        error.response?.data || error.message,
      );
      alert('Failed to update appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reschedule Appointment</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView style={{ paddingHorizontal: 16 }}>
        {/* Calendar */}
        <Calendar
          minDate={new Date()}
          onDayPress={day => {
            setSelectedDate(day.dateString);
            fetchBookedSlots(day.dateString);
          }}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: '#E66A2C',
            },
          }}
          theme={{ arrowColor: '#E66A2C', todayTextColor: '#E66A2C' }}
          style={styles.calendar}
        />

        {/* TIME SLOTS */}
        <Text style={styles.timeTitle}>Select Time</Text>
        <View style={styles.slotContainer}>
          {slots.length === 0 ? (
            <Text
              style={{
                fontSize: 16,
                color: '#E66A2C',
                marginTop: 10,
                fontFamily: 'Poppins-Medium',
              }}
            >
              No slots available for this date
            </Text>
          ) : (
            slots.map((slot, index) => {
              const isSelected = selectedSlot?.start === slot.start;
              const isBooked = !slot.available;

              return (
                <TouchableOpacity
                  key={index}
                  disabled={isBooked}
                  onPress={() => {
                    setSelectedSlot(slot);
                    setStartTime(slot.start);
                    setEndTime(slot.end);
                    console.log('🟢 Slot selected:', slot);
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

        {/* RESOURCE DROPDOWN */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Resource</Text>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowResourceDropdown(!showResourceDropdown)}
          >
            <Text style={styles.dropdownText}>
              {selectedResourceName || 'Select resource'}
            </Text>
            <Icon
              name={showResourceDropdown ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#000"
            />
          </TouchableOpacity>

          {showResourceDropdown && (
            <View style={styles.dropdownPanel}>
              <ScrollView style={{ maxHeight: 200 }}>
                {resources.length === 0 ? (
                  <Text style={{ padding: 12, color: '#999' }}>
                    No resources available
                  </Text>
                ) : (
                  resources.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.option}
                      onPress={() => {
                        setSelectedResourceId(item.id);
                        setSelectedResourceName(item.name);
                        setShowResourceDropdown(false);
                        console.log('✅ Selected Resource:', item);
                      }}
                    >
                      <Text style={styles.optionText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          )}
        </View> */}

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

          {['in-person', 'video'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeOption,
                appointmentType === type && styles.typeSelected,
              ]}
              onPress={() => setAppointmentType(type)}
            >
              <Text style={styles.typeTitle}>
                {type === 'in-person' ? 'In Person' : 'Video Call'}
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
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={UpdateAppointmentAPI}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Update Appointment</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RescheduleAppointment;

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
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  calendar: { borderRadius: 12, elevation: 2, marginTop: 10 },

  timeTitle: { fontSize: 18, fontWeight: '700', marginTop: 20 },

  slotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 10,
  },

  slotBox: {
    width: '30%',
    backgroundColor: '#ff5722',
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
  },

  bookedSlot: {
    backgroundColor: '#bfbfbf',
    padding: 5,
  },

  slotText: {
    color: '#fff',
    // fontWeight: '600',
    textAlign: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#ddd',
  },
  dropdownText: { fontSize: 15, color: '#000', fontFamily: 'Poppins-Medium' },
  dropdownPanel: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: '#fff',
    elevation: 6,
    borderColor: '#ddd',
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontFamily: 'Poppins-Medium',
  },
  optionText: { fontSize: 15, color: '#000', fontFamily: 'Poppins-Medium' },

  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 90,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    textAlignVertical: 'top',
    fontFamily: 'Poppins-Medium',
  },

  typeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderColor: '#ddd',
  },
  typeSelected: { backgroundColor: '#fff7f2', borderColor: '#E66A2C' },
  typeTitle: { fontSize: 15, fontFamily: 'Poppins-Medium' },

  confirmButton: {
    backgroundColor: '#E66A2C',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 30,
    fontFamily: 'Poppins-Medium',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
});
