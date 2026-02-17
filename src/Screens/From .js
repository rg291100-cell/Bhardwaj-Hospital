import React, { useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const Form = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '123456',
    gender: '',
    age: '',
    address: '',
    emergencyContact: '',
    alternateContact: '',
    history: '',
  });

  const [photo, setPhoto] = useState(null);

  const handleImagePick = () => {
    launchImageLibrary(    {
      mediaType: 'photo',
      quality: 0.5,          // 👈 compress image (50%)
      maxWidth: 1024,        // 👈 resize width
      maxHeight: 1024,       // 👈 resize height
    }, response => {
      if (response?.assets?.length > 0) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

const handleRegister = async () => {
  // Validate required fields
  if (
    !form.fullName ||
    !form.email ||
    !form.phone ||
    !form.password ||
    !form.gender ||
    !form.age ||
    !form.address ||
    !form.emergencyContact ||
    !form.alternateContact
  ) {
    Alert.alert('Missing Information', 'Please fill all required fields.');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    Alert.alert('Invalid Email', 'Please enter a valid email address.');
    return;
  }

  // Validate phone number length
  if (form.phone.length !== 10) {
    Alert.alert('Invalid Number', 'Phone number must be 10 digits.');
    return;
  }

  if (form.emergencyContact.length !== 10) {
    Alert.alert('Invalid Number', 'Emergency contact must be 10 digits.');
    return;
  }

  if (form.alternateContact.length !== 10) {
    Alert.alert('Invalid Number', 'Alternate contact must be 10 digits.');
    return;
  }

  // Validate age
  const ageNum = parseInt(form.age, 10);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
    Alert.alert('Invalid Age', 'Please enter a valid age (1-120).');
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();

    formData.append('name', form.fullName.trim());
    formData.append('email', form.email.trim().toLowerCase());
    formData.append('phone', form.phone);
    formData.append('password', '123456');
    formData.append('gender', form.gender);
    formData.append('age', form.age);
    formData.append('address', form.address.trim());
    formData.append('emergency_contact_number', form.emergencyContact);
    formData.append('alternate_contact_number', form.alternateContact);
    formData.append('basic_medical_history', form.history.trim() || 'None');

    if (photo) {
      formData.append('profile_image', {
        uri: photo,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }

    // Debug logging
    console.log('=== Sending Registration Data ===');
    console.log('Name:', form.fullName.trim());
    console.log('Email:', form.email.trim().toLowerCase());
    console.log('Phone:', form.phone);
    console.log('Gender:', form.gender);
    console.log('Age:', form.age);
    console.log('Address:', form.address.trim());
    console.log('Emergency Contact:', form.emergencyContact);
    console.log('Alternate Contact:', form.alternateContact);
    console.log('Medical History:', form.history.trim() || 'None');
    console.log('Photo:', photo ? 'Attached' : 'Not attached');

    const response = await axios.post(
      'https://argosmob.uk/bhardwaj-hospital/public/api/auth/register',
      formData,
      { 
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, 
      },
    );

    console.log('API Response:', response.data);

    if (response.data?.status === 'true' || response.data?.status === true) {
      Alert.alert('Success', 'Registration Complete!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Login', {
              userData: form,
              photo: photo,
            });
          },
        },
      ]);
    } else {
      Alert.alert('Error', response.data?.error || response.data?.message || 'Failed to register.');
    }
  } catch (error) {
    console.log('=== Error Details ===');
    console.log('Error:', error);
    console.log('Error Message:', error?.message);
    console.log('Response Status:', error?.response?.status);
    console.log('Response Data:', error?.response?.data);
    console.log('Response Headers:', error?.response?.headers);

    // Handle 422 validation errors specifically
    if (error?.response?.status === 422) {
      const errorData = error?.response?.data;
      
      // Laravel validation errors are usually in 'errors' or 'message' field
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors)
          .flat()
          .join('\n');
        Alert.alert('Validation Error', errorMessages);
      } else if (errorData?.message) {
        Alert.alert('Validation Error', errorData.message);
      } else if (errorData?.error) {
        Alert.alert('Validation Error', errorData.error);
      } else {
        Alert.alert(
          'Validation Error',
          'Please check all fields and try again.\n\n' + JSON.stringify(errorData),
        );
      }
    } else {
      Alert.alert(
        'Error',
        error?.response?.data?.error || 
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong, try again.',
      );
    }
  } finally {
    setLoading(false);
  }
};
  const handleNumberChange = (key, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 10) {
      setForm({ ...form, [key]: numericValue });
    }
  };

  const handleAgeChange = value => {
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue === '') {
      setForm({ ...form, age: '' });
      return;
    }

    const ageNumber = parseInt(numericValue, 10);

    if (ageNumber <= 120) {
      setForm({ ...form, age: numericValue });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient Registration</Text>
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
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={val => setForm({ ...form, email: val })}
        />

        {/* Phone Number */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          maxLength={10}
          value={form.phone}
          onChangeText={val => handleNumberChange('phone', val)}
        />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.gender}
            onValueChange={val => setForm({ ...form, gender: val })}
          >
            <Picker.Item label="Select gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter age"
          keyboardType="numeric"
          maxLength={3}
          value={form.age}
          onChangeText={handleAgeChange}
        />

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Enter address"
          multiline
          textAlignVertical="top"
          value={form.address}
          onChangeText={val => setForm({ ...form, address: val })}
        />

        {/* Emergency Contact */}
        <Text style={styles.label}>Emergency Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          maxLength={10}
          value={form.emergencyContact}
          onChangeText={val => handleNumberChange('emergencyContact', val)}
        />

        {/* Alternate Contact */}
        <Text style={styles.label}>Alternate Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          maxLength={10}
          value={form.alternateContact}
          onChangeText={val => handleNumberChange('alternateContact', val)}
        />

        {/* History */}
        <Text style={styles.label}>Basic Medical History</Text>
        <TextInput
          style={[styles.input, { height: 90 }]}
          multiline
          textAlignVertical="top"
          placeholder="Enter medical history"
          value={form.history}
          onChangeText={val => setForm({ ...form, history: val })}
        />

        {/* Upload */}
        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBox} onPress={handleImagePick}>
            <Icon name="image-plus" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.uploadTextRight}>Upload Profile Photo</Text>
        </View>

        {photo && (
          <Image source={{ uri: photo }} style={styles.uploadedImage} />
        )}

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.registerButton, loading && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerText}>
            {loading ? 'Please wait...' : 'Register'}
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
    alignItems: 'center',
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
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Poppins-Regular',
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
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});