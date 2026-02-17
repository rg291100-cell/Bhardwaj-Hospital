import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { date, time, doctorId, type, symptoms } = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState('card');

  const consultationFee = 50;
  const tax = 5;
  const total = consultationFee + tax;

  const handlePayment = () => {
    alert(`Payment Successful! Booking confirmed 🎉`);
    navigation.navigate('Appointment', {
      message: 'Appointment Confirmed',
      date,
      time,
      type,
      symptoms,
      doctorId,
      status: 'Paid',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Payment Method */}
      <Text style={styles.sectionTitle}>Payment Method</Text>

      <TouchableOpacity
        style={[styles.option, selectedMethod === 'card' && styles.selected]}
        onPress={() => setSelectedMethod('card')}>
        <Text style={styles.optionText}>Credit Card</Text>
        <Icon
          name={selectedMethod === 'card' ? 'radiobox-marked' : 'radiobox-blank'}
          size={22}
          color="#E66A2C"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, selectedMethod === 'wallet' && styles.selected]}
        onPress={() => setSelectedMethod('wallet')}>
        <Text style={styles.optionText}>Digital Wallet</Text>
        <Icon
          name={
            selectedMethod === 'wallet'
              ? 'radiobox-marked'
              : 'radiobox-blank'
          }
          size={22}
          color="#E66A2C"
        />
      </TouchableOpacity>

      {/* Summary */}
      <Text style={styles.sectionTitle}>Consultation Summary</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Consultation Fee</Text>
        <Text style={styles.summaryValue}>${consultationFee.toFixed(2)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Taxes</Text>
        <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
      </View>

      <View style={styles.line} />

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { fontWeight: '700' }]}>Total</Text>
        <Text style={[styles.summaryValue, { fontWeight: '700' }]}>
          ${total.toFixed(2)}
        </Text>
      </View>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
        <Text style={styles.payText}>Complete Payment</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 10,
    color: '#000',
  },
  option: {
    borderWidth: 1,
    borderColor: '#E66A2C',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selected: {
    backgroundColor: '#fff5ef',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    color: '#555',
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    color: '#000',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
  },
  payBtn: {
    backgroundColor: '#E66A2C',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  payText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
