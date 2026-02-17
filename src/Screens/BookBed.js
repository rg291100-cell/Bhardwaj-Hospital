import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';

const BookBed = () => {
  const navigation = useNavigation();
  const [selectedRoom, setSelectedRoom] = useState('Private Room');
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleSubmit = () => {
    if (!patientName || !phone) {
      alert('Please fill all required fields.');
      return;
    }

    // ✅ Correct navigation syntax with params
    navigation.navigate('AvailableBeds', {
      message: 'Bed Booking Request Submitted!',
      room: selectedRoom,
      date: date.toDateString(),
      patient: patientName,
      phone: phone,
      requirements: requirements,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a Bed</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Room Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room Type</Text>
          <View style={styles.roomRow}>
            {['Private Room', 'Semi-Private Room', 'General Ward'].map(
              (room) => (
                <TouchableOpacity
                  key={room}
                  style={[
                    styles.roomButton,
                    selectedRoom === room && styles.roomSelected,
                  ]}
                  onPress={() => setSelectedRoom(room)}>
                  <Text
                    style={[
                      styles.roomText,
                      selectedRoom === room && styles.roomTextSelected,
                    ]}>
                    {room}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        {/* Date Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date Range</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setOpen(true)}>
            <Text style={styles.dateText}>Select Dates</Text>
            <Icon name="calendar" size={22} color="#E66A2C" />
          </TouchableOpacity>

          <DatePicker
            modal
            open={open}
            date={date}
            onConfirm={(selectedDate) => {
              setOpen(false);
              setDate(selectedDate);
            }}
            onCancel={() => setOpen(false)}
            mode="date"
          />

          <Text style={styles.selectedDate}>
            Selected: {date.toDateString()}
          </Text>
        </View>

        {/* Patient Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Details</Text>
          <TextInput
            placeholder="Patient Name"
            style={styles.input}
            value={patientName}
            onChangeText={setPatientName}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <TextInput
            placeholder="Contact Name"
            style={styles.input}
            value={contactName}
            onChangeText={setContactName}
          />
          <TextInput
            placeholder="Contact Phone"
            style={styles.input}
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Special Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Requirements</Text>
          <TextInput
            placeholder="Enter special requests"
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            value={requirements}
            onChangeText={setRequirements}
            multiline
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookBed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  roomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roomButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  roomSelected: {
    backgroundColor: '#E66A2C',
  },
  roomText: {
    color: '#000',
    fontWeight: '600',
  },
  roomTextSelected: {
    color: '#fff',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  dateText: {
    color: '#999',
  },
  selectedDate: {
    marginTop: 8,
    fontSize: 14,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#E66A2C',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 30,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
