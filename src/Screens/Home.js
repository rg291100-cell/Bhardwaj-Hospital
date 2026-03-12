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
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseURL } from '../utils/api';
import packageJson from '../../package.json';
const APP_SESSION_ID = Date.now(); // Unique ID for this app run
let isUpdatePopupDismissed = false; // Session-level flag

const Home = () => {
  const APP_VERSION = packageJson.version;
  const navigation = useNavigation();
  const [doctor, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [favourites, setFavourites] = useState([]);
  const [imageKey, setImageKey] = useState(Date.now());
  const FAV_KEY = 'FAV_DOCTORS';
  const [banner, setBanner] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

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

  const openUpdateLink = async (url) => {
    if (!url) {
      Alert.alert('Error', 'Update link is not available');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback for some android versions where canOpenURL might fail for store links
        await Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert('Update Error', 'Could not open Play Store. Please update manually.');
      console.log('Linking Error:', error);
    }
  };

  const checkUpdate = async () => {
    if (isUpdatePopupDismissed) return; // Don't show again in this session

    try {
      const response = await axios.get(`${baseURL}/app-version`);
      if (response.data.status) {
        const { latest_version } = response.data.data;
        if (latest_version !== APP_VERSION) {
          setUpdateInfo(response.data.data);
          setShowUpdateModal(true);
        }
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;

      const response = await axios.get(`${baseURL}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.log('Error fetching unread count:', error);
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
    getuserinfo();
    getToken();
    loadFavourites();
    console.log('Current App Version:', APP_VERSION);
  }, []);

  // ✅ REFRESH USER DATA WHEN SCREEN COMES INTO FOCUS
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Screen focused - refreshing user data');
      setImageKey(Date.now());
      getDoctors();
      getBanner();
      checkUpdate();
      getuserinfo();
      loadFavourites();
      fetchUnreadCount();
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
                    {unreadCount > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
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
                  </TouchableOpacity>
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

        {/* Update Modal */}
        <Modal
          visible={showUpdateModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowUpdateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.updateModalContent}>
              <View style={styles.updateIconContainer}>
                <Icon name="rocket-launch" size={50} color="#E66A2C" />
              </View>
              <Text style={styles.updateModalTitle}>New Update Available!</Text>
              <Text style={styles.updateModalMessage}>
                {updateInfo?.update_message || 'A new version of the app is available. Please update to continue using the latest features.'}
              </Text>

              <View style={styles.versionInfoContainer}>
                <View style={styles.versionTagItem}>
                  <Text style={styles.versionLabel}>Current</Text>
                  <Text style={styles.versionText}>V{APP_VERSION}</Text>
                </View>
                <Icon name="arrow-right-thin" size={24} color="#DDD" />
                <View style={styles.versionTagItem}>
                  <Text style={styles.versionLabel}>Latest</Text>
                  <Text style={[styles.versionText, { color: '#E66A2C' }]}>V{updateInfo?.latest_version}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.updateNowBtn}
                onPress={() => openUpdateLink('https://play.google.com/store/apps/details?id=com.bhardwaj')}
              >
                <Text style={styles.updateNowBtnText}>Update Now</Text>
                <Icon name="arrow-right" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.maybeLaterBtn}
                onPress={() => {
                  setShowUpdateModal(false);
                  isUpdatePopupDismissed = true; // Set flag to not show again
                }}
              >
                <Text style={styles.maybeLaterBtnText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF3D00',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
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
  // Update Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  updateModalContent: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '100%',
    padding: 25,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  updateIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  updateModalTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  updateModalMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  versionInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 25,
    gap: 15,
  },
  versionTagItem: {
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'Poppins-Medium',
    textTransform: 'uppercase',
  },
  versionText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#444',
  },
  updateNowBtn: {
    backgroundColor: '#E66A2C',
    width: '100%',
    height: 55,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#E66A2C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  updateNowBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  maybeLaterBtn: {
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  maybeLaterBtnText: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
});
