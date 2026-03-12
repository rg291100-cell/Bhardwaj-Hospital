import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import Share from 'react-native-share';
import { baseURL } from '../utils/api';

const ReportView = ({ route }) => {
  const navigation = useNavigation();
  const { reportId } = route.params;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Fetch report data
  const getReport = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await axios.get(
        `${baseURL}/medical-reports/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );
      setReport(res.data?.data);
    } catch (error) {
      console.log('Report API Error:', error.response?.data || error);
      Alert.alert('Error', 'Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReport();
  }, []);

  // Generate HTML content for PDF
  const generateHTMLContent = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.report_title || 'Medical Report'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Helvetica', 'Arial', sans-serif;
      padding: 40px;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    h1 { 
      color: #1a202c; 
      font-size: 28px;
      margin-bottom: 4px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .address {
      font-size: 12px;
      color: #4a5568;
      margin-bottom: 20px;
      text-align: center;
    }
    hr {
      border: 0;
      border-top: 2px dashed #000;
      margin-bottom: 20px;
    }
    .report-title-box {
      text-align: center;
      margin-bottom: 20px;
    }
    .report-title-text {
      font-size: 18px;
      font-weight: bold;
      text-decoration: underline;
    }
    .info-grid {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .info-col {
      width: 48%;
    }
    .info-field {
      font-size: 14px;
      margin-bottom: 4px;
    }
    .info-field strong {
      display: inline-block;
      width: 100px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
      font-weight: bold;
    }
    .value {
      color: #555;
      line-height: 1.8;
    }
    .footer {
      margin-top: 50px;
      text-align: right;
      color: #000;
      font-weight: bold;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>BHARDWAJ HOSPITAL</h1>
    <div class="address">
      D 65/336,<br>
      LAHARTARA, BAULIYA LAHARTARA VARANASI<br>
      UTTAR PRADESH 221002
    </div>
  </div>
  
  <hr>

  <div class="report-title-box">
    <span class="report-title-text">Medical Report</span>
  </div>

  <div class="info-grid">
    <div class="info-col">
      <div class="info-field"><strong>Report ID:</strong> INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${report.id}</div>
      <div class="info-field"><strong>Patient Name:</strong> ${report.patient?.name || 'N/A'}</div>
      <div class="info-field"><strong>Patient Id:</strong> ${report.patient?.id ? 'PID' + String(report.patient.id).padStart(6, '0') : 'N/A'}</div>
    </div>
    <div class="info-col">
      <div class="info-field"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
      <div class="info-field"><strong>Gender:</strong> ${report.patient?.gender || 'N/A'}</div>
      <div class="info-field"><strong>Phone:</strong> ${report.patient?.phone || 'N/A'}</div>
    </div>
  </div>

  <hr>

  <table>
    <thead>
      <tr>
        <th style="width: 30%">Report Details</th>
        <th style="width: 70%">Information</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Title</strong></td>
        <td>${report.report_title || 'N/A'}</td>
      </tr>
      <tr>
        <td><strong>Type</strong></td>
        <td>${report.report_type || 'N/A'}</td>
      </tr>
      <tr>
        <td><strong>Doctor</strong></td>
        <td>${report.doctor?.name || 'Hospital Staff'}</td>
      </tr>
      <tr>
        <td><strong>Notes</strong></td>
        <td>${report.notes || 'N/A'}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p>Sign / Stamp</p>
  </div>
</body>
</html>`;
  };

  // Simple Download PDF function
  const downloadPDF = async () => {
    if (!report) {
      Alert.alert('Error', 'No report data available');
      return;
    }

    try {
      setDownloading(true);

      // Generate HTML
      const html = generateHTMLContent();

      // Create PDF file
      const options = {
        html: html,
        fileName: `Medical_Report_${Date.now()}`,
        directory: Platform.OS === 'ios' ? 'Documents' : 'Downloads',
      };

      const file = await RNHTMLtoPDF.convert(options);

      if (file.filePath) {
        // Show success alert
        Alert.alert(
          '✅ PDF Downloaded Successfully!',
          'Your medical report has been saved to your device.',
          [
            {
              text: 'Open PDF',
              onPress: () => {
                // Try to open the PDF
                Linking.openURL(`file://${file.filePath}`).catch(() => {
                  Alert.alert(
                    'Info',
                    'PDF saved. You can find it in your Downloads folder.',
                  );
                });
              },
            },
            {
              text: 'OK',
              style: 'cancel',
            },
          ],
        );
      } else {
        Alert.alert('Error', 'Failed to save PDF');
      }
    } catch (error) {
      console.log('PDF Download error:', error);

      // Fallback: Use RNPrint if HTMLtoPDF fails
      try {
        const html = generateHTMLContent();
        await RNPrint.print({
          html: html,
        });

        Alert.alert('Success', 'PDF Downloaded successfully', [{ text: 'OK' }]);
      } catch (printError) {
        Alert.alert('Error', 'Failed to generate PDF. Please try again.', [
          { text: 'OK' },
        ]);
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#ff5722"
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Report not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Report</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Status Header */}
        <View style={styles.topBanner}>
          <Icon name="file-document-outline" size={40} color="#fff" />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.topBannerTitle}>{report.report_title}</Text>
            <Text style={styles.topBannerSubTitle}>{report.report_type}</Text>
          </View>
        </View>

        {/* Patient Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="account-outline" size={22} color="#ff5722" />
            <Text style={styles.sectionTitle}>Patient Information</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{report.patient?.name || 'N/A'}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Patient ID</Text>
              <Text style={styles.value}>{report.patient?.id ? 'PID' + String(report.patient.id).padStart(6, '0') : 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>{report.patient?.gender || 'N/A'}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{report.patient?.phone || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Consult Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="stethoscope" size={22} color="#ff5722" />
            <Text style={styles.sectionTitle}>Consultation Details</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.fullCol}>
              <Text style={styles.label}>Consulting Doctor</Text>
              <Text style={[styles.value, { color: '#000', fontSize: 16, fontFamily: 'Poppins-Medium' }]}>
                {report.doctor?.name ? 'Dr. ' + report.doctor.name : 'Hospital Staff'}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="text-box-outline" size={22} color="#ff5722" />
            <Text style={styles.sectionTitle}>Clinical Notes / Remarks</Text>
          </View>
          <View style={styles.divider} />

          <Text style={[styles.value, { lineHeight: 22, color: '#444' }]}>
            {report.notes || 'No remarks provided by the doctor for this report.'}
          </Text>
        </View>

        {/* Download Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.downloadButton,
              downloading && styles.buttonDisabled,
            ]}
            onPress={downloadPDF}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Icon
                  name="file-pdf-box"
                  size={22}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.downloadText}>Download PDF</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>
          Tap above to download this report as PDF
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  topBanner: {
    backgroundColor: '#ff5722',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#ff5722',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  topBannerTitle: {
    fontSize: 22,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  topBannerSubTitle: {
    fontSize: 14,
    color: '#ffe0d4',
    fontFamily: 'Poppins-Medium',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  col: {
    width: '48%',
  },
  fullCol: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#222',
    fontFamily: 'Poppins-SemiBold',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 16,
  },
  downloadButton: {
    backgroundColor: '#ff5722',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  infoText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
});
