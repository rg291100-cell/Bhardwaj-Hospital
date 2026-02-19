import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  FlatList,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseURL } from '../utils/api';

const Home = () => {
  const navigation = useNavigation();
  const [doctor, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [favourites, setFavourites] = useState([]);
  const [imageKey, setImageKey] = useState(Date.now());
  const FAV_KEY = 'FAV_DOCTORS';
  const [banner, setBanner] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp(); // minimize / close app
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove(); // ✅ correct cleanup
    }, []),
  );

  const loadFavourites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(FAV_KEY);
      const storedFavs = jsonValue ? JSON.parse(jsonValue) : [];
      setFavourites(storedFavs);
    } catch (e) {
      console.log('Error loading favourites', e);
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log('Token from AsyncStorage:', token);
      return token;
    } catch (e) {
      console.error('Failed to get token:', e);
    }
  };

  const getuserinfo = async () => {
    console.log('Fetching user info...');

    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log('Token:', token);

      if (!token) {
        console.log('Token not found');
        return;
      }

      const response = await axios.get(
        `${baseURL}/profile/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Full user data Response:', response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.log('API ERROR:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDoctors = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/doctors/get-doctor`,
      );
      // setDoctors(response?.data?.data);
      setDoctors(response?.data?.data || []);

      console.log('DOCTOR DATA', response?.data?.data);
    } catch (error) {
      console.log('API ERROR', error);
    } finally {
      setLoading(false);
    }
  };

  const getBanner = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/banners`,
      );
      console.log('Bannner DATA', response?.data?.data);
      console.log('Bannner image', response?.data?.data[0]?.image);
      const bannerData = response?.data?.data[0]?.image;
      setBanner(bannerData);
      //   if (bannerData && bannerData.length > 0) {
      //   setBanner(bannerData[0]);
      // }
    } catch (error) {
      console.log('API ERROR Banner', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavourite = async doctorId => {
    try {
      doctorId = Number(doctorId);
      let updatedFavs = favourites.map(Number);

      if (updatedFavs.includes(doctorId)) {
        updatedFavs = updatedFavs.filter(id => id !== doctorId);
      } else {
        updatedFavs.push(doctorId);
      }

      setFavourites(updatedFavs);
      await AsyncStorage.setItem(FAV_KEY, JSON.stringify(updatedFavs));
    } catch (e) {
      console.log('Error updating favourite', e);
    }
  };

  // Initial load
  useEffect(() => {
    getDoctors();
    getuserinfo();
    getToken();
    loadFavourites();
    getBanner();
  }, []);

  // ✅ REFRESH USER DATA WHEN SCREEN COMES INTO FOCUS
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Screen focused - refreshing user data');
      setImageKey(Date.now());
      getuserinfo();
      loadFavourites();
    }, []),
  );
  const actionButtons = [
    {
      id: '1',
      title: 'Events',
      onPress: () => navigation.navigate('Evants'),
    },
    {
      id: '2',
      title: 'Order Medicine',
      onPress: () =>
        Linking.openURL('https://whatsform.com/D926-T'),
    },
    {
      id: '3',
      title: 'Speciality',
      onPress: () => navigation.navigate('Specialty'),
    },
    {
      id: '4',
      title: 'Reports',
      onPress: () => navigation.navigate('ReportsScreen'),
    },
  ];


  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#fff"
          translucent={false}
        />
        <FlatList
          data={loading ? [] : doctor.data}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          ListHeaderComponent={
            <>
              {/* Header */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.greeting}>Hello</Text>
                  <Text style={styles.username}>{user.name}</Text>
                </View>

                <View style={styles.headerRight}>
                  <TouchableOpacity
                    style={styles.bellIcon}
                    onPress={() => navigation.navigate('Notifications')}
                  >
                    <Icon name="bell-outline" size={28} color="#E66A2C" />
                  </TouchableOpacity>

                  <Image
                    source={
                      user?.profile_picture
                        ? {
                          uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/profiles/${user.profile_picture}`,
                        }
                        : require('../assets/Images/Splash.png')
                    }
                    style={styles.profileImage}
                  />
                </View>
              </View>

              {/* Hospital Image */}
              <Image
                source={
                  banner
                    ? {
                      uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/banners/${banner}`,
                    }
                    : require('../assets/Images/Hospital.png')
                }
                style={styles.hospitalImage}
                resizeMode="cover"
              />

              {/* Quick Action Buttons */}
              <View style={styles.actionRow}>
                <FlatList
                  data={actionButtons}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.id}
                  contentContainerStyle={{ marginTop: 15 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={item.onPress}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionText}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Top Doctors Header */}
              <View style={styles.topDoctorsHeader}>
                <Text style={styles.topDoctorsText}>Top Doctors</Text>
              </View>

              {loading && (
                <Text style={{ textAlign: 'center', marginTop: 30 }}>
                  Loading...
                </Text>
              )}
            </>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DoctorDetails', { doctorId: item.id })
              }
            >
              <View style={styles.doctorCard}>
                <Image
                  source={
                    item.profile_image
                      ? {
                        uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/${item.profile_image}`,
                      }
                      : require('../assets/Images/Doctor.png')
                  }
                  style={styles.doctorImage}
                />

                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>
                    {`${item.first_name} ${item.last_name}`}
                  </Text>
                  <Text style={styles.specialization}>
                    {item.specialty?.name}
                  </Text>
                  <Text style={styles.price}>{item.consultation_fee}</Text>
                  <Text style={styles.rating}>
                    {item.qualifications.length >= 20
                      ? item.qualifications.slice(0, 20) + '...'
                      : item.qualifications}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => toggleFavourite(item.id)}>
                  <Icon
                    name={
                      favourites.includes(Number(item.id))
                        ? 'heart'
                        : 'heart-outline'
                    }
                    size={24}
                    color={
                      favourites.includes(Number(item.id)) ? 'red' : '#999'
                    }
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !loading && (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                No doctors found
              </Text>
            )
          }
        />
      </SafeAreaView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Poppins-Regular',
  },
  username: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  bellIcon: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 10,
    height: 45,
    borderColor: '#000',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 5,
    color: '#000',
  },
  hospitalImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginTop: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#E66A2C',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  topDoctorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
  topDoctorsText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#000',
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    padding: 10,
    marginVertical: 8,
    height: 140,
  },
  doctorImage: {
    width: 70,
    height: 100,
    borderRadius: 10,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  specialization: {
    color: '#777',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  price: {
    fontWeight: '600',
    marginTop: 3,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  rating: {
    color: '#ff8800',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
});
