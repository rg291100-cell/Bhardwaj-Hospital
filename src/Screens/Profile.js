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

const Profile = () => {
  const fileName = user?.profile_picture?.split('/').pop();

  const navigation = useNavigation();
  const [localImage, setLocalImage] = useState(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 26 }} />
      </View>
      <ScrollView
        style={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image + Name */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={openGallery} activeOpacity={0.8}>
            <View style={{ position: 'relative' }}>
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

              {/* Camera icon overlay */}
              <View style={styles.cameraIcon}>
                <Image
                  source={require('../assets/camera.png')}
                  style={{ width: 22, height: 22 }}
                />
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.profileName}>{user?.name || 'Unknown'}</Text>
          <Text style={styles.profileRole}>Patient</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.info}>{user?.email}</Text>

          <Text style={styles.label}>Phone</Text>
          <Text style={styles.info}>{user?.phone || 'Not Provided'}</Text>

          <Text style={styles.label}>Address</Text>
          <Text style={styles.info}>{user?.address || 'No Address Added'}</Text>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('UpdateProfile', { user })}
            style={styles.settingRow}
          >
            <Text style={styles.settingText}>Edit Profile</Text>
            <Icon name="pencil-outline" size={22} color="#E66A2C" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.settingRow}>
            <Text style={styles.settingText}>Logout</Text>
            <Icon name="arrow-right" size={22} color="#E66A2C" />
          </TouchableOpacity>
          <TouchableOpacity

            style={styles.settingRow}
          >
            <Text style={[styles.settingText]}>Rate Our App</Text>
            <Icon name="star-outline" size={22} color="#E66A2C" />
          </TouchableOpacity>
          <Text
            style={[
              styles.settingText,
              {
                paddingVertical: 12,
                textAlign: 'center',
                fontFamily: 'Poppins-SemiBold',
                marginTop: 10
              },
            ]}
          >
            Happy with the service, Kindly update your review.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              marginVertical: 20,
              justifyContent: 'center',
              backgroundColor: '',
              alignItems: 'center',
              gap: 50,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                openExternalLink('https://g.page/r/CTVasghVlFBqEBM/review')
              }
              activeOpacity={0.8}
            >
              <Image
                source={require('../assets/google.png')}
                style={{ width: 50, height: 50 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                openExternalLink('https://jsdl.in/RSL-PZK1769154268')
              }
              activeOpacity={0.8}
            >
              <Image
                source={require('../assets/star-rating.png')}
                style={{ width: 50, height: 50 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://prac.to/IPRCTO/7JZjUBNu').catch(err =>
                  console.error('Failed to open URL:', err),
                )
              }
              activeOpacity={0.8}
            >
              <Image
                source={require('../assets/practo_logo.png')}
                style={{ width: 120, height: 120, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
        </View>
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
    marginTop: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 20,
    marginTop: 10,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  profileRole: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 16,
    // fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  label: {
    color: '#777',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  info: {
    fontSize: 15,
    color: '#000',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  chatText: {
    fontSize: 15,
    color: '#000',
    marginRight: 205,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.4,
    borderColor: '#ddd',
  },
  settingText: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 4,
  },
});
