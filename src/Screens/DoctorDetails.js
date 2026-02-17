import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const DoctorDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const [selectedDay, setSelectedDay] = useState(null);
const [consultationFee, setConsultationFee] = useState(null);

  const getDoctorById = async () => {
    console.log('dfnsdfnksdjfk');

    try {
      const response = await axios.get(
        `https://argosmob.uk/bhardwaj-hospital/public/api/doctors/${doctorId}`,
      );
      setDoctor(response.data?.data);
      console.log('Doctor ID 123', response.data?.data);
setConsultationFee(response.data?.data?.consultation_fee);


      console.log();
    } catch (error) {
      console.log('GET BY ID ERROR', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      getDoctorById();
    }
  }, [doctorId]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {doctor ? doctor.first_name + ' ' + doctor.last_name : 'Loading'}
        </Text>
        <View style={{ width: 26 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}

        {/* Doctor Info */}
        <View style={styles.profileSection}>
          {/* <Image
            source={  doctor?.profile_image ?{uri:doctor.profile_image}:require('../assets/Images/Doctor.png')}
            style={styles.profileImage}
          /> */}
          <Image
            source={
              doctor?.profile_image
                ? {
                    uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/${doctor.profile_image}`,
                  }
                : require('../assets/Images/Doctor.png')
            }
            style={styles.profileImage}
          />

          <Text style={styles.doctorName}>
            {doctor ? doctor.first_name + ' ' + doctor.last_name : 'Loading'}{' '}
          </Text>
          <Text style={styles.specialization}>
            {doctor?.specialty?.name || 'N/A'}
          </Text>
          <Text style={styles.experience}>
            {doctor?.experience
              ? `${doctor.experience} years experience`
              : 'Experience not available'}
          </Text>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {doctor?.bio ||
              'Experienced General Physician with over 10 years of clinical practice. He specializes in preventive healthcare, diagnosis, and treatment of common medical conditions, ensuring compassionate and patient-focused care.'}
          </Text>
        </View>

        {/* Specialization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialization</Text>
          <Text style={styles.infoText}>{doctor?.specialty?.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Days</Text>

          <FlatList
            data={days}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dayButton,
                  selectedDay === item && styles.dayButtonSelected,
                ]}
                onPress={() => setSelectedDay(item)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDay === item.working_days && styles.dayTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

   

        {/* <View style={styles.reviewCard}>
            <Image
              source={require('../assets/Images/Doctor.png')}
              style={styles.reviewerImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewerName}>Sophia Bennett</Text>
              <View style={styles.starRow}>
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={16} color="#E66A2C" />
                ))}
              </View>
              <Text style={styles.reviewText}>
                Dr. Harper was incredibly thorough and explained everything clearly. 
                I felt very comfortable and confident in her care.
              </Text>
              <View style={styles.reactionRow}>
                <Icon name="thumb-up-outline" size={18} color="#888" />
                <Text style={styles.reactionText}>12</Text>
                <Icon name="comment-outline" size={18} color="#888" style={{ marginLeft: 10 }} />
                <Text style={styles.reactionText}>1</Text>
              </View>
            </View>
          </View> */}

        {/* <View style={styles.reviewCard}>
            <Image
              source={require('../assets/Images/Doctor.png')}
              style={styles.reviewerImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewerName}>Olivia Carter</Text>
              <View style={styles.starRow}>
                {[...Array(4)].map((_, i) => (
                  <Icon key={i} name="star" size={16} color="#E66A2C" />
                ))}
              </View>
              <Text style={styles.reviewText}>
                Dr. Harper was knowledgeable and helpful, but the wait time was a bit long.
              </Text>
              <View style={styles.reactionRow}>
                <Icon name="thumb-up-outline" size={18} color="#888" />
                <Text style={styles.reactionText}>8</Text>
                <Icon name="comment-outline" size={18} color="#888" style={{ marginLeft: 10 }} />
                <Text style={styles.reactionText}>2</Text>
              </View>
            </View>
          </View> */}
        {/* </View> */}

        {/* Book Button */}
        <View style={{ marginTop: 60 }}>
          <TouchableOpacity
onPress={() =>
  navigation.navigate('BookAppointment', {
    doctorId: doctorId,
    consultationFee: consultationFee,
  })
}            style={styles.bookButton}
          >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor:"red"
  },
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
  profileSection: {
    alignItems: 'center',
    marginTop: 25,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  doctorName: {
    fontSize: 20,
    color: '#000',
    marginTop: 10,
        fontFamily: 'Poppins-SemiBold',

  },
  specialization: {
    fontSize: 15,
    color: '#777',
        fontFamily: 'Poppins-Medium',

  },
  experience: {
    fontSize: 14,
    color: '#999',
        fontFamily: 'Poppins-Regular',

  },
  section: {
    marginTop: 25,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    // fontWeight: '700',
    color: '#000',
    marginBottom: 8,
            fontFamily: 'Poppins-Medium',

  },
  aboutText: {
    color: '#555',
    lineHeight: 20,
            fontFamily: 'Poppins-Regular',

  },
  infoText: {
    color: '#444',
    fontSize: 12,
    fontWeight: '500',
            fontFamily: 'Poppins-Regular',

  },
  slotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slotButton: {
    backgroundColor: '#E66A2C',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  slotButtonSecondary: {
    backgroundColor: '#E66A2C',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  slotText: {
    color: '#fff',
    // fontWeight: '600',
            fontFamily: 'Poppins-Regular',

  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginRight: 10,
  },
  starRow: {
    flexDirection: 'row',
  },
  reviewCount: {
    color: '#777',
    marginBottom: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  barLabel: {
    width: 15,
  },
  barContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 8,
  },
  barFill: {
    height: 6,
    backgroundColor: '#E66A2C',
    borderRadius: 5,
  },
  barPercent: {
    width: 35,
    textAlign: 'right',
    color: '#555',
    fontSize: 13,
  },
  reviewCard: {
    flexDirection: 'row',
    marginTop: 20,
  },
  reviewerImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  reviewText: {
    color: '#555',
    marginTop: 5,
    lineHeight: 18,
  },
  reactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  reactionText: {
    color: '#666',
    fontSize: 13,
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#E66A2C',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 30,
    width: '92%',
    alignSelf: 'center',
  },
  bookButtonText: {
    color: '#fff',
    // fontWeight: '700',
    fontSize: 16,
            fontFamily: 'Poppins-Regular',

  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dayButtonSelected: {
    backgroundColor: '#E66A2C',
    borderColor: '#E66A2C',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
            fontFamily: 'Poppins-Regular',

  },
  dayTextSelected: {
    color: '#fff',
            fontFamily: 'Poppins-Regular',

  },
});
