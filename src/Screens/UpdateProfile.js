import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const Form = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { user } = route.params || {};

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
    age: '',
    address: '',
    emergencyContact: '',
    alternateContact: '',
    history: '',
  });

  const [photo, setPhoto] = useState(null);

  //
  // const handleImagePick = async () => {
  //   try {
  //     const image = await ImagePicker.openPicker({
  //       width: 400,
  //       height: 400,
  //       cropping: true,
  //       compressImageQuality: 0.8,
  //       mediaType: 'photo',
  //     });

  //     setPhoto(image.path); // ✅ file:// path
  //   } catch (error) {
  //     if (error?.message !== 'User cancelled image selection') {
  //       Alert.alert('Error', 'Image selection failed');
  //     }
  //   }
  // };

  //  const pickerImage=async()=>{
  //   const res = await launchImageLibrary({ mediaType: 'photo', quality: 1 })
  //    console.log(res,"dhhdhdhdhd")

  //   };

  //   const pickerImage = async () => {
  //     console.log("ddjdjdjdjdjdjdddj")
  //     const res = await launchImageLibrary({
  //       mediaType: 'photo',
  //       quality: 0.30,
  //       selectionLimit: 1,
  //     });

  //     if (res.didCancel) return;

  // if (res.errorCode) {
  //   console.log('Image Picker Error:', res.errorMessage);
  //   setTimeout(() => {
  //     Alert.alert('Error', res.errorMessage || 'Image selection failed');
  //   }, 300);
  //   return;
  // }

  //     if (res.assets && res.assets.length > 0) {
  //       setPhoto(res.assets[0]); // ✅ SAVE FULL OBJECT
  //     }
  //   };

  const pickerImage = async () => {
    console.log('Opening image picker...');

    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.3,
        selectionLimit: 1,
      });

      // User cancelled
      if (res.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      // Error occurred
      if (res.errorCode) {
        console.log('Image Picker Error:', res.errorMessage);
        // DON'T show alert - just log the error
        return;
      }

      // Success - image selected
      if (res.assets && res.assets.length > 0) {
        setPhoto(res.assets[0]);
        console.log('Image selected successfully:', res.assets[0].fileName);
      }
    } catch (error) {
      console.log('Unexpected error:', error);
    }
  };

  //   const handleUpdateProfile = async () => {
  //     if (
  //       !form.fullName ||
  //       !form.phone ||
  //       !form.gender ||
  //       !form.age ||
  //       !form.address ||
  //       !form.emergencyContact ||
  //       !form.alternateContact
  //     ) {
  //       Alert.alert("Missing Information", "Please fill all required fields.");
  //       return;
  //     }

  //    if (form.phone.length !== 10){
  //       Alert.alert("Invalid Number", "Phone number must be 10 digits.");
  //       return;
  //     }
  //      if (form.emergencyContact.length !==10){
  //       Alert.alert("Invalid Number", "Phone number must be 10 digits.");
  //       return;
  //     }
  //      if (form.alternateContact.length !==10){
  //       Alert.alert("Invalid Number", "Phone number must be 10 digits.");
  //       return;
  //     }

  //     setLoading(true);

  //     try {
  //       const token = await AsyncStorage.getItem("access_token")

  //       const formData = new FormData();

  //       formData.append("name", form.fullName);
  //       formData.append("email", form.email);
  //       formData.append("phone", form.phone);
  //       formData.append("gender", form.gender);
  //       formData.append("age", form.age);
  //       formData.append("address", form.address);
  //       formData.append("emergency_contact_number", form.emergencyContact);
  //       formData.append("alternate_contact_number", form.alternateContact);
  //       formData.append("basic_medical_history", form.history);
  //       console.log(formData)

  //       // if (photo) {
  //       //   formData.append("profile_image", {
  //       //     uri: photo,
  //       //     type: "image/jpeg",
  //       //     name: "profile.jpg",
  //       //   });
  //       // }
  //       formData.append("profile_image", {
  //   uri: photo.startsWith("file://") ? photo : `file://${photo}`,
  //   type: "image/jpeg",
  //   name: "profile.jpg",
  // });
  // console.log("===== FORM DATA =====");
  // for (let pair of formData._parts) {
  //   console.log(pair[0], pair[1]);
  // }

  //       const response = await axios.post(
  //         "https://argosmob.uk/bhardwaj-hospital/public/api/profile/update",
  //         formData,
  //         {
  //           headers: { "Content-Type": "multipart/form-data" ,
  //           Authorization : `Bearer ${token}`,
  //         } }
  //       );

  //       console.log("API Update:", response.data.data);

  //       if (response.data?.status == "true") {
  //         Alert.alert("Success", "Profile Updated Successfully!");

  //         navigation.goBack();
  //       } else {
  //         Alert.alert("Error123", response.data.error || "Update register.");
  //       }
  //     } catch (error) {
  //       console.log("API Error:", error?.response?.data);
  //       Alert.alert(
  //         "Error",
  //         error?.response?.data || "Something went wrong, ."
  //       );
  //     }

  //     setLoading(false);
  //   };

  // const isNewImage = photo && photo.startsWith("file://");
  const isNewImage = photo && typeof photo === 'object' && photo.uri;

  // const handleUpdateProfile = async () => {
  //   setLoading(true);
  //   try {
  //     const token = await AsyncStorage.getItem("access_token");

  //     // payload without image
  //     const payload = {
  //       name: form.fullName,
  //       phone: form.phone,
  //       gender: form.gender,
  //       age: form.age,
  //       address: form.address,
  //       emergency_contact_number: form.emergencyContact,
  //       alternate_contact_number: form.alternateContact,
  //       basic_medical_history: form.history,
  //     };

  //     let response;

  //     const isNewImage = photo && typeof photo === "object" && photo.uri;

  //     if (!isNewImage) {
  //       // No new image → send JSON
  //       response = await axios.post(
  //         "https://argosmob.uk/bhardwaj-hospital/public/api/profile/update",
  //         payload,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             Accept: "application/json",
  //           },
  //         }
  //       );
  //     } else {
  //       // New image → send FormData
  //       if (photo.fileSize > 2 * 1024 * 1024) {
  //         Alert.alert("Error", "Image too large. Please select under 2 MB.");
  //         setLoading(false);
  //         return;
  //       }

  //       const formData = new FormData();
  //       Object.keys(payload).forEach(key => formData.append(key, payload[key]));

  //       formData.append("profile_image", {
  //         uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", ""),
  //         type: photo.type || "image/jpeg",
  //         name: photo.fileName || "profile.jpg",
  //       });

  //       response = await axios.post(
  //         "https://argosmob.uk/bhardwaj-hospital/public/api/profile/update",
  //         formData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             Accept: "application/json",
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //     }

  //     Alert.alert("Success", "Profile updated successfully");
  //     console.log("PROFILE UPDATE SUCCESS 👉", response.data);
  //     navigation.goBack();
  //   } catch (error) {
  //     console.log("PROFILE UPDATE ERROR 👉", error.response?.data || error.message);
  //     Alert.alert(
  //       "Error",
  //       error.response?.data?.message || "Profile update failed"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Add this to your handleUpdateProfile function in Form.js

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');

      const payload = {
        name: form.fullName,
        phone: form.phone,
        gender: form.gender,
        age: form.age,
        address: form.address,
        emergency_contact_number: form.emergencyContact,
        alternate_contact_number: form.alternateContact,
        basic_medical_history: form.history,
      };

      let response;
      const isNewImage = photo && typeof photo === 'object' && photo.uri;

      console.log('📸 Is new image?', isNewImage);
      console.log('📸 Photo object:', photo);

      if (!isNewImage) {
        response = await axios.post(
          'https://argosmob.uk/bhardwaj-hospital/public/api/profile/update',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        );
      } else {
        if (photo.fileSize > 2 * 1024 * 1024) {
          Alert.alert('Error', 'Image too large. Please select under 2 MB.');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        Object.keys(payload).forEach(key => formData.append(key, payload[key]));

        formData.append('profile_image', {
          uri:
            Platform.OS === 'android'
              ? photo.uri
              : photo.uri.replace('file://', ''),
          type: photo.type || 'image/jpeg',
          name: photo.fileName || 'profile.jpg',
        });

        console.log('📤 Sending FormData with image...');

        response = await axios.post(
          'https://argosmob.uk/bhardwaj-hospital/public/api/profile/update',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      }

      console.log('✅ API RESPONSE:', JSON.stringify(response.data, null, 2));
      console.log(
        '🖼️ Updated profile_image:',
        response.data?.user?.profile_image,
      );

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.log(
        '❌ PROFILE UPDATE ERROR:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Profile update failed',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('user', user);

    if (user) {
      setForm({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        age: String(user.age || ''),
        address: user.address || '',
        emergencyContact: user.emergency_contact_number || '',
        alternateContact: user.alternate_contact_number || '',
        history: user.basic_medical_history || '',
      });

      if (user.profile_image) {
        setPhoto(user.profile_image);
      }
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Update Profile</Text>
          <View />
        </View>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          value={form.fullName}
          onChangeText={val => setForm({ ...form, fullName: val })}
        />

        {/* Email */}
        {/* <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(val) => setForm({ ...form, email: val })}
          /> */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={val => setForm({ ...form, phone: val })}
        />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        {/* <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.gender}
              onValueChange={val => setForm({ ...form, gender: val })}
            >
              <Picker.Item label="Select gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View> */}

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter age"
          keyboardType="numeric"
          value={form.age}
          onChangeText={val => setForm({ ...form, age: val })}
        />

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          multiline
          value={form.address}
          onChangeText={val => setForm({ ...form, address: val })}
        />

        {/* Emergency Contact */}
        <Text style={styles.label}>Emergency Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={form.emergencyContact}
          onChangeText={val => setForm({ ...form, emergencyContact: val })}
        />

        {/* Alternate Contact */}
        <Text style={styles.label}>Alternate Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={form.alternateContact}
          onChangeText={val => setForm({ ...form, alternateContact: val })}
        />

        {/* History */}
        <Text style={styles.label}>Basic Medical History</Text>
        <TextInput
          style={[styles.input, { height: 90 }]}
          multiline
          placeholder="Enter medical history"
          value={form.history}
          onChangeText={val => setForm({ ...form, history: val })}
        />

        {/* Upload */}
        <View style={styles.uploadRow}>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={() => pickerImage()}
          >
            <Icon name="image-plus" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.uploadTextRight}>Upload Profile Photo</Text>
        </View>

        {/* {photo && (
            <Image source={{ uri: photo }} style={styles.uploadedImage} />
          )} */}
        {photo && (
          <Image
            source={{
              uri: typeof photo === 'string' ? photo : photo.uri,
            }}
            style={styles.uploadedImage}
          />
        )}

        {/* Register Button */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.registerText}>
            {loading ? 'Updateing' : 'Save'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Form;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    color: '#000',
    marginLeft: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
    marginTop: 12,
    marginBottom: 5,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    backgroundColor: '#f1f6f7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  pickerContainer: {
    backgroundColor: '#f1f6f7',
    borderRadius: 8,
  },
  uploadRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  uploadBox: {
    backgroundColor: '#ff5a00',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  uploadTextRight: {
    left: 30,
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },
  uploadedImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginTop: 15,
    alignSelf: 'center',
  },
  registerButton: {
    backgroundColor: '#ff4500',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 30,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
