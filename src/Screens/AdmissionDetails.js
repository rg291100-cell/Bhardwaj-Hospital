import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AdmissionDetails = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Admission Details</Text>

        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ---------------- ROOM & BED ---------------- */}
        <Text style={styles.sectionTitle}>Room & Bed</Text>

        <View style={styles.itemRow}>
          <View style={styles.iconBox}>
            <Icon name="bed-outline" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.itemTitle}>Bed 12</Text>
            <Text style={styles.itemSub}>Room 302</Text>
          </View>
        </View>

        {/* ---------------- ADMISSION ---------------- */}
        <Text style={styles.sectionTitle}>Admission</Text>

        <View style={styles.itemRow}>
          <View style={styles.iconBox}>
            <Icon name="calendar" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.itemTitle}>Date</Text>
            <Text style={styles.itemSub}>Tue, Oct 15, 2024</Text>
          </View>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.iconBox}>
            <Icon name="clock-outline" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.itemTitle}>Time</Text>
            <Text style={styles.itemSub}>10:00 AM</Text>
          </View>
        </View>

        {/* ---------------- TREATMENT PLAN ---------------- */}
        <Text style={styles.sectionTitle}>Treatment Plan</Text>

        <View style={styles.itemRow}>
          <View style={styles.iconBox}>
            <Icon name="account-outline" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.itemTitle}>Physician</Text>
            <Text style={styles.itemSub}>Dr. Emily Carter</Text>
          </View>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.iconBox}>
            <Icon name="note-text-outline" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.itemTitle}>Purpose</Text>
            <Text style={styles.itemSub}>General Checkup</Text>
          </View>
        </View>

        {/* ---------------- DISCHARGE ---------------- */}
        <Text style={styles.sectionTitle}>Discharge</Text>

        <View style={styles.itemRow}>
          <View style={styles.iconBox}>
            <Icon name="calendar" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.itemTitle}>Date</Text>
            <Text style={styles.itemSub}>Tue, Oct 15, 2024</Text>
          </View>
        </View>

        <View style={{ ...styles.itemRow, marginBottom: 30 }}>
          <View style={styles.iconBox}>
            <Icon name="clock-outline" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.itemTitle}>Time</Text>
            <Text style={styles.itemSub}>12:00 PM</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AdmissionDetails;

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
    marginTop:30,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  /* SECTION TITLE */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 15,
  },

  /* ROWS WITH ICON + TEXT */
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
  },

  iconBox: {
    backgroundColor: '#FF5A00',
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },

  itemSub: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});
