import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email) {
      setError('Please enter email');
      return false;
    }

    if (!emailRegex.test(email)) {
      setError('Enter a valid email address');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    setError('');

    if (!validateEmail()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'https://argosmob.uk/bhardwaj-hospital/public/api/auth/request-otp',
        { email: email },
      );

      console.log('OTP API Response:', response.data);
      // if (response.data.status == 'true') {
      //   Alert.alert('Success', `OTP sent to: ${email}`);

        navigation.navigate('Otp', {
          email: email,
        });
      // } else {
      //   console.log("Error",response.data.message);
        
      //   setError(response.data.message || 'Something went wrong');
      // }
    } catch (err) {
      console.log('Error:', err);
      setError('Server error, try again later');
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.innerView}>
        <Text style={styles.title}>Login with Email</Text>

        <View style={styles.innerView2}>
          <Text style={styles.title2}>Email Address</Text>

          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            keyboardType="email-address"
            onChangeText={text => {
              setEmail(text);
              setError('');
            }}
            value={email}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.butview}>
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.btn, loading && { opacity: 0.6 }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Get OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('From')}
              style={{
                marginTop: 20,
                alignContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18, fontFamily: 'Poppins-Regular' }}>
                If You have Not Signup{' '}
              </Text>
              <Icon
                name="arrow-right"
                size={25}
                marginHorizontal={10}
                color="#092aeaff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerView: {
    marginTop: 150,
    marginHorizontal: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  innerView2: {
    marginTop: 20,
  },
  title2: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8F0F2',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#E8F0F2',
    height: 50,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  butview: {
    height: 60,
    marginTop: 20,
  },
  btn: {
    backgroundColor: '#FF3D00',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
});
