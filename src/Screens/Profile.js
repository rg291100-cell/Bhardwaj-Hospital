import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useNavigation,
  useFocusEffect,
  CommonActions,
} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from '../utils/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import packageJson from '../../package.json';

const Profile = () => {
  const fileName = user?.profile_picture?.split('/').pop();

  const navigation = useNavigation();
  const [localImage, setLocalImage] = useState(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateInfo, setUpdateInfo] = useState(null);
  const APP_VERSION = packageJson.version; // Current Local Version from package.json
  console.log(user);

  // 👉 Fetch User Profile
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log('token', token);

      const res = await axios.get(
        `${baseURL}/profile/get`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log('res', res.data?.user);

      setUser(res.data?.user);
    } catch (error) {
      console.log(' Profile API Error:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const checkUpdate = async () => {
    try {
      const response = await axios.get(`${baseURL}/app-version`);
      if (response.data.status) {
        const { latest_version } = response.data.data;
        if (latest_version > APP_VERSION) {
          setUpdateInfo(response.data.data);
        }
      }
    } catch (error) {
      console.log('Update check failed', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      checkUpdate();
    }, []),
  );

  const uploadProfileImage = async image => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      const formData = new FormData();
      formData.append('profile_image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || 'profile.jpg',
      });

      const res = await axios.post(
        `${baseURL}/profile/update-profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('✅ Image upload success:', res.data);
      Alert.alert('Success', 'Profile image updated successfully');

      // refresh profile after upload
      await fetchProfile();
      setLocalImage(null);
    } catch (error) {
      console.log('❌ Upload error:', error.response?.data || error.message);
    }
  };

  const openGallery = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
    }
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.3,
      });

      if (res.didCancel) return;

      if (res.errorCode) {
        console.log('Gallery error:', res.errorMessage);
        return;
      }

      if (res.assets?.length > 0) {
        const image = res.assets[0];

        // show image instantly
        setLocalImage(image);

        // upload image
        uploadProfileImage(image);
      }
    } catch (error) {
      console.log('Gallery exception:', error);
    }
  };

  // useEffect(() => {
  //   if (Platform.OS === 'android' && Platform.Version >= 33) {
  //     PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  //     );
  //   }
  // }, []);

  // 👉 Logout Function
  // const handleLogout = async () => {
  //   await AsyncStorage.removeItem('access_token');
  //   navigation.replace('Login');
  // };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('access_token');

              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                }),
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };


  console.log(
    `https://argosmob.uk/bhardwaj-hospital/storage/app/public/${user?.profile_picture}`,
  );

  // 👉 Show Loader While Fetching Data
  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator size="large" color="#FF3D00" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const openExternalLink = async url => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      console.log('Open URL error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={openGallery} activeOpacity={0.9}>
            <View style={styles.imageWrapper}>
              <Image
                source={
                  localImage
                    ? { uri: localImage.uri }
                    : user?.profile_picture
                      ? {
                        uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/profiles/${user.profile_picture}`,
                      }
                      : require('../assets/Images/Splash.png')
                }
                style={styles.profileImage}
              />
              <View style={styles.cameraIconContainer}>
                <Icon name="camera-plus" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.userNameText}>{user?.name || 'User Name'}</Text>
          <View style={styles.patientIdBadge}>
            <Text style={styles.patientIdText}>ID: {user?.patient_id || 'PH-00000'}</Text>
          </View>
        </View>



        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionHeading}>Personal Details</Text>

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="email-outline" size={20} color="#1976D2" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="phone-outline" size={20} color="#388E3C" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{user?.phone || 'Add phone number'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
              <Icon name="map-marker-outline" size={20} color="#F57C00" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Residential Address</Text>
              <Text style={styles.infoValue}>{user?.address || 'No address added yet'}</Text>
            </View>
          </View>
        </View>

        {/* Settings Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionHeading}>Account Settings</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('UpdateProfile', { user })}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Icon name="account-edit-outline" size={22} color="#555" />
              <Text style={styles.menuText}>Edit Profile</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#BBB" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Icon name="star-outline" size={22} color="#555" />
              <Text style={styles.menuText}>Rate Our App</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#BBB" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuLeft}>
              <Icon name="logout" size={22} color="#D32F2F" />
              <Text style={[styles.menuText, { color: '#D32F2F' }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Review Section */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewFeedbackText}>Happy with our service? Leave a review!</Text>

          <View style={styles.reviewLogoRow}>
            <TouchableOpacity onPress={() => openExternalLink('https://g.page/r/CTVasghVlFBqEBM/review')}>
              <Image source={require('../assets/google.png')} style={styles.reviewIcon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openExternalLink('https://jsdl.in/RSL-PZK1769154268')}>
              <Image source={require('../assets/star-rating.png')} style={styles.reviewIcon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL('https://prac.to/IPRCTO/7JZjUBNu')}>
              <Image source={require('../assets/practo_logo.png')} style={styles.practoIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.versionTag}>App Release V{APP_VERSION}</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  scrollContent: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  imageWrapper: {
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 65,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#E66A2C',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userNameText: {
    fontSize: 22,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 12,
  },
  patientIdBadge: {
    backgroundColor: '#F3F4F9',
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 5,
  },
  patientIdText: {
    color: '#666',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },
  updateCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#E66A2C',
  },
  updateAlertIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#E66A2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateTitleText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  updateSubtitleText: {
    fontSize: 12,
    color: '#777',
    fontFamily: 'Poppins-Regular',
  },
  updateBtnSmall: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  updateBtnTextSmall: {
    color: '#E66A2C',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'Poppins-Regular',
  },
  infoValue: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Poppins-Medium',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Poppins-Medium',
    marginLeft: 12,
  },
  reviewSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  reviewFeedbackText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Medium',
    marginBottom: 15,
  },
  reviewLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  reviewIcon: {
    width: 44,
    height: 44,
  },
  practoIcon: {
    width: 90,
    height: 44,
    resizeMode: 'contain',
  },
  versionTag: {
    textAlign: 'center',
    fontSize: 11,
    color: '#BBB',
    fontFamily: 'Poppins-Regular',
    marginTop: 20,
  },
});
