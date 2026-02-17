import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE_URL = 'https://argosmob.uk/bhardwaj-hospital/public/api/auth';

const Otp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(600);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveToStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log(`✅ Saved ${key} to storage`);
    } catch (error) {
      console.error('❌ Storage error:', error);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/verify-otp`,
        { email, otp },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // FIX: Handle malformed response with 'z' prefix
      let data = response.data;
      if (typeof data === 'string' && data.startsWith('z')) {
        data = JSON.parse(data.substring(1));
      }

      console.log('Cleaned Response:', data);

      if (data?.status === 'true' || data?.status === true) {
        if (data.access_token) {
          await saveToStorage('access_token', data.access_token);
        }
        if (data.user) {
          await saveToStorage('user_data', JSON.stringify(data.user));
        }

        Alert.alert('Success', 'Email verified successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('TabNavigation') },
        ]);
      } else {
        throw new Error(data?.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verification Error:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Verification failed';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;

    setResending(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/request-otp`, { email });

      // Handle malformed response
      let data = response.data;
      if (typeof data === 'string' && data.startsWith('z')) {
        data = JSON.parse(data.substring(1));
      }

      if (data?.status === 'true' || data?.status === true) {
        Alert.alert('Success', data?.message || 'OTP sent successfully!');
        setTimer(600);
        setCanResend(false);
        setOtp('');
      } else {
        throw new Error(data?.message || 'Failed to send OTP');
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to send OTP';
      Alert.alert('Error', message);
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify OTP</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <Icon
          name="email-check-outline"
          size={80}
          color="#FF3D00"
          style={styles.icon}
        />

        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        <TextInput
          placeholder="Enter 6-digit OTP"
          style={styles.input}
          keyboardType="number-pad"
          value={otp}
          maxLength={6}
          editable={!loading}
          onChangeText={text => {
            setOtp(text.replace(/[^0-9]/g, ''));
            setError('');
          }}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {timer > 0 && (
          <Text style={styles.timer}>Expires in {formatTime(timer)}</Text>
        )}

        <TouchableOpacity
          onPress={handleVerify}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={!canResend || resending}>
            <Text
              style={[
                styles.resendLink,
                (!canResend || resending) && styles.resendDisabled,
              ]}>
              {resending ? 'Sending...' : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 18, color: '#000', marginLeft: 10, fontFamily: 'Poppins-SemiBold' },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  icon: { alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#000', textAlign: 'center', marginBottom: 10, fontFamily: 'Poppins-SemiBold' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30, fontFamily: 'Poppins-Regular', lineHeight: 22 },
  emailText: { color: '#FF3D00', fontWeight: '600', fontFamily: 'Poppins-Medium' },
  input: { borderWidth: 1, borderColor: '#E8F0F2', borderRadius: 8, padding: 15, marginBottom: 10, backgroundColor: '#E8F0F2', height: 55, fontSize: 18, color: '#000', fontFamily: 'Poppins-Regular', letterSpacing: 8, textAlign: 'center' },
  error: { color: '#FF3D00', fontSize: 14, marginBottom: 10, fontFamily: 'Poppins-Regular', textAlign: 'center' },
  timer: { fontSize: 14, color: '#FF3D00', textAlign: 'center', marginBottom: 20, fontFamily: 'Poppins-Medium' },
  button: { backgroundColor: '#FF3D00', height: 55, alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginBottom: 20 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 18, fontFamily: 'Poppins-SemiBold' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resendText: { fontSize: 14, color: '#666', fontFamily: 'Poppins-Regular' },
  resendLink: { fontSize: 14, color: '#FF3D00', fontWeight: '600', fontFamily: 'Poppins-SemiBold' },
  resendDisabled: { color: '#ccc' },
});

export default Otp;