import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Consultations = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultations</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* -------------------- PAST CONSULTATIONS -------------------- */}
        <Text style={styles.sectionTitle}>Past Consultations</Text>

        {/* Item 1 */}
       <TouchableOpacity onPress={()=>navigation.navigate('Prescriptions')}>
         <View style={styles.consultationItem}>
          <Image
            source={require('../assets/Images/Doctor.png')}
            style={styles.doctorImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.date}>October 26, 2023</Text>
            <Text style={styles.summary}>
              Summary: Discussed symptoms of fatigue and prescribed blood tests.
            </Text>
            <Text style={styles.doctor}>Dr. Emily Carter</Text>
          </View>
        </View>
       </TouchableOpacity>
        {/* Item 2 */}
        <TouchableOpacity onPress={()=>navigation.navigate('Prescriptions')} >
          <View style={styles.consultationItem}>
          <Image
            source={require('../assets/Images/Doctormen.png')}
            style={styles.doctorImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.date}>September 15, 2023</Text>
            <Text style={styles.summary}>
              Summary: Reviewed previous test results and adjusted medication dosage.
            </Text>
            <Text style={styles.doctor}>Dr. Michael Chen</Text>
          </View>
        </View>
        </TouchableOpacity>

        {/* Item 3 */}
       <TouchableOpacity onPress={()=>navigation.navigate('Prescriptions')}>
         <View style={styles.consultationItem}>
          <Image
            source={require('../assets/Images/Doctor.png')}
            style={styles.doctorImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.date}>August 5, 2023</Text>
            <Text style={styles.summary}>
              Summary: Initial consultation for back pain, recommended physical therapy.
            </Text>
            <Text style={styles.doctor}>Dr. Sarah Jones</Text>
          </View>
        </View>

       </TouchableOpacity>
        {/* -------------------- UPCOMING CONSULTATIONS -------------------- */}
        <Text style={styles.sectionTitle}>Upcoming Consultations</Text>

        {/* Item 4 */}
       <TouchableOpacity 
       onPress={()=>navigation.navigate('MessageDoctor')}
       >
         <View style={styles.consultationItem}>
          <Image
            source={require('../assets/Images/Doctormen.png')}
            style={styles.doctorImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.date}>November 10, 2023</Text>
            <Text style={styles.summary}>
              Follow-up appointment to discuss test results.
            </Text>
            <Text style={styles.doctor}>Dr. David Lee</Text>
          </View>
        </View>
       </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* -------------------- BOTTOM NAV BAR -------------------- */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home-outline" size={26} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="account-multiple-outline" size={26} color="#fff" />
          <Text style={styles.navText}>Doctor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemCenter}>
          <Icon name="calendar-clock" size={30} color="#fff" />
          <Text style={styles.navText}>Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="account-outline" size={26} color="#fff" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default Consultations;

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

  /* SECTION TITLE */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 16,
  },

  /* CONSULTATION ITEM */
  consultationItem: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
  },

  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  date: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },

  summary: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },

  doctor: {
    fontSize: 14,
    color: '#FF5A00',
    fontWeight: '600',
  },

  /* BOTTOM NAV */
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FF5A00',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  navItem: {
    alignItems: 'center',
  },

  navItemCenter: {
    alignItems: 'center',
    marginTop: -10,
  },

  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});
