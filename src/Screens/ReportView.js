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
        `https://argosmob.uk/bhardwaj-hospital/public/api/medical-reports/${reportId}`,
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
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 4px solid #ff5722;
    }
    h1 { 
      color: #ff5722; 
      font-size: 32px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .report-type {
      color: #666;
      font-size: 18px;
      font-style: italic;
      margin-top: 8px;
    }
    .section {
      margin: 30px 0;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 10px;
      border-left: 6px solid #ff5722;
    }
    .section-title {
      color: #ff5722;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .field {
      margin: 12px 0;
      font-size: 15px;
    }
    .field strong {
      color: #000;
      font-weight: 600;
      min-width: 150px;
      display: inline-block;
    }
    .value {
      color: #555;
      line-height: 1.8;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      text-align: center;
      color: #999;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${report.report_title || 'Medical Report'}</h1>
    <div class="report-type">${report.report_type || 'General Report'}</div>
  </div>

  <div class="section">
    <div class="section-title">Patient Details</div>
    <div class="field"><strong>Name:</strong> <span class="value">${
      report.patient?.name || 'N/A'
    }</span></div>
    <div class="field"><strong>Gender:</strong> <span class="value">${
      report.patient?.gender || 'N/A'
    }</span></div>
    <div class="field"><strong>Phone:</strong> <span class="value">${
      report.patient?.phone || 'N/A'
    }</span></div>
  </div>

  <div class="section">
    <div class="section-title">Doctor</div>
    <div class="field"><strong>Name:</strong> <span class="value">${
      report.doctor?.name || 'N/A'
    }</span></div>
  </div>

  <div class="section">
    <div class="section-title">Diagnosis</div>
    <div class="field"><span class="value">${
      report.diagnosis || 'N/A'
    }</span></div>
  </div>

  <div class="section">
    <div class="section-title">Treatment Plan</div>
    <div class="field"><span class="value">${
      report.treatment_plan || 'N/A'
    }</span></div>
  </div>

  <div class="footer">
    <p><strong>Bhardwaj Hospital</strong></p>
    <p>Generated on ${new Date().toLocaleDateString('en-IN')}</p>
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
        {/* Report Info */}
        <View style={styles.card}>
          <Text style={styles.title}>{report.report_title}</Text>
          <Text style={styles.subTitle}>{report.report_type}</Text>
        </View>

        {/* Patient Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Patient Details</Text>
          <Text style={styles.value}>
            Name: {report.patient?.name || 'N/A'}
          </Text>
          <Text style={styles.value}>
            Gender: {report.patient?.gender || 'N/A'}
          </Text>
          <Text style={styles.value}>
            Phone: {report.patient?.phone || 'N/A'}
          </Text>
        </View>

        {/* Doctor */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Doctor</Text>
          <Text style={styles.value}>{report.doctor?.name || 'N/A'}</Text>
        </View>

        {/* Diagnosis */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <Text style={styles.value}>{report.diagnosis || 'N/A'}</Text>
        </View>

        {/* Treatment */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Treatment Plan</Text>
          <Text style={styles.value}>{report.treatment_plan || 'N/A'}</Text>
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
  card: {
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  subTitle: {
    fontSize: 14,
    color: '#ff5722',
    marginTop: 6,
    fontFamily: 'Poppins-SemiBold',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  value: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  buttonContainer: {
    marginTop: 24,
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
