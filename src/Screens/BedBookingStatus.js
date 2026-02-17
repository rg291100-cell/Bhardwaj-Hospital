import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BedBookingStatus = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity  onPress={()=>navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Bed Booking</Text>

        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* -------------------- BOOKING STATUS -------------------- */}
        <Text style={styles.sectionTitle}>Booking Status</Text>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Icon name="calendar-clock" size={26} color="#FF5A00" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.statusLabel}>Booking Request</Text>
              <Text style={styles.statusPending}>Pending</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Icon name="credit-card-outline" size={26} color="#FF5A00" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.statusLabel}>Payment Status</Text>
              <Text style={styles.statusPending}>Pending</Text>
            </View>
          </View>
        </View>

        {/* -------------------- APPROVAL UPDATES -------------------- */}
        <Text style={styles.sectionTitle}>Approval Updates</Text>

        <View style={styles.timelineContainer}>

          {/* Step 1 */}
          <View style={styles.timelineRow}>
            <View style={styles.iconColumn}>
              <Icon name="check" size={22} color="#1FA000" />
              <View style={styles.connector} />
            </View>

            <View style={styles.textColumn}>
              <Text style={styles.timelineTitle}>Booking Request Submitted</Text>
              <Text style={styles.timelineTime}>10:00 AM</Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.timelineRow}>
            <View style={styles.iconColumn}>
              <Icon name="clock-time-four-outline" size={22} color="#FF5A00" />
              <View style={styles.connector} />
            </View>

            <View style={styles.textColumn}>
              <Text style={styles.timelineTitle}>Approval in Progress</Text>
              <Text style={styles.timelineTime}>10:15 AM</Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.timelineRow}>
            <View style={styles.iconColumn}>
              <Icon name="clock-alert-outline" size={22} color="#FF5A00" />
            </View>

            <View style={styles.textColumn}>
              <Text style={styles.timelineTitle}>Approval Status</Text>
              <Text style={styles.timelineTime}>Pending</Text>
            </View>
          </View>
        </View>

        {/* -------------------- ADMISSION INSTRUCTIONS -------------------- */}
        <Text style={styles.sectionTitle}>Admission Instructions</Text>

        <Text style={styles.paragraph}>
          Once your booking is approved, you will receive detailed admission 
          instructions, including the date, time, and location. Please ensure 
          you have all necessary documents ready.
        </Text>

        {/* -------------------- CONTACT INFORMATION -------------------- */}
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <Text style={styles.paragraph}>
          For any urgent inquiries, please contact our support team at 
          (555) 123-4567 or email us at support@healthconnect.com.
        </Text>

        {/* BUTTON */}
        <TouchableOpacity 
        onPress={()=>navigation.navigate('AdmissionDetails') }
        style={styles.button}>
          <Text style={styles.buttonText}>See Details</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default BedBookingStatus;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginTop:20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  /* SECTIONS */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 16,
  },

  /* STATUS CARDS */
  statusCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 0.7,
    borderColor: '#ddd',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusLabel: {
    fontSize: 15,
    fontWeight: '600',
  },

  statusPending: {
    color: '#FF5A00',
    marginTop: 2,
  },

  /* TIMELINES */
  timelineContainer: {
    marginHorizontal: 16,
  },

  timelineRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  iconColumn: {
    width: 30,
    alignItems: 'center',
  },

  connector: {
    width: 2,
    height: 35,
    backgroundColor: '#FF5A00',
    marginTop: 4,
  },

  textColumn: {
    marginLeft: 10,
  },

  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
  },

  timelineTime: {
    fontSize: 13,
    color: '#777',
  },

  /* TEXT SECTION */
  paragraph: {
    fontSize: 14,
    color: '#444',
    marginHorizontal: 16,
    marginTop: 4,
    lineHeight: 20,
  },

  /* BUTTON */
  button: {
    backgroundColor: '#FF5A00',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 30,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
