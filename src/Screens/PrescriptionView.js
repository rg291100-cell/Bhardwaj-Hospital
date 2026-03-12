import React, { useState } from 'react';
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
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

const PrescriptionView = ({ route }) => {
    const navigation = useNavigation();
    const { prescription } = route.params;

    const [downloading, setDownloading] = useState(false);

    // Safely parse medicines
    let parsedMedicines = [];
    if (prescription?.medicines) {
        parsedMedicines =
            typeof prescription.medicines === 'string'
                ? JSON.parse(prescription.medicines)
                : prescription.medicines;
    }

    // Generate HTML content for PDF
    const generateHTMLContent = () => {
        let medicinesHTML = parsedMedicines.map(med => `
      <tr>
        <td><strong>${med.medicine}</strong></td>
        <td>${med.dosage}</td>
        <td>${med.frequency}</td>
        <td>${med.duration}</td>
      </tr>
    `).join('');

        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prescription #${prescription.id}</title>
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
      margin-bottom: 20px;
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
    .footer {
      margin-top: 50px;
      text-align: right;
      color: #000;
      font-weight: bold;
      font-size: 14px;
    }
    .notes-box {
      background-color: #f9f9f9;
      padding: 15px;
      border-left: 4px solid #ff5722;
      margin-bottom: 10px;
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
    <span class="report-title-text">Medical Prescription</span>
  </div>

  <div class="info-grid">
    <div class="info-col">
      <div class="info-field"><strong>Patient Name:</strong> ${prescription.patient?.name || 'N/A'}</div>
      <div class="info-field"><strong>Age / Gender:</strong> ${prescription.patient?.age || 'N/A'} Y / ${prescription.patient?.gender || 'N/A'}</div>
      <div class="info-field"><strong>Phone:</strong> ${prescription.patient?.phone || 'N/A'}</div>
    </div>
    <div class="info-col">
      <div class="info-field"><strong>Date:</strong> ${prescription.prescription_date ? prescription.prescription_date.split('T')[0] : 'N/A'}</div>
      <div class="info-field"><strong>Prescription ID:</strong> PRSC-${prescription.id}</div>
      <div class="info-field"><strong>Doctor:</strong> ${prescription.doctor?.name ? 'Dr. ' + prescription.doctor.name : 'Hospital Staff'}</div>
    </div>
  </div>

  <hr>
  
  <h3 style="margin-bottom: 10px; color: #ff5722;">Rx Medicines List</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 40%">Medicine Name</th>
        <th style="width: 20%">Dosage</th>
        <th style="width: 20%">Frequency</th>
        <th style="width: 20%">Duration</th>
      </tr>
    </thead>
    <tbody>
      ${medicinesHTML || '<tr><td colspan="4" style="text-align: center;">No medicines prescribed</td></tr>'}
    </tbody>
  </table>

  ${prescription.instructions ? `
  <div class="notes-box">
    <h4>Instructions / Directions of Use</h4>
    <p style="margin-top: 5px;">${prescription.instructions}</p>
  </div>` : ''}

  ${prescription.follow_up_advice ? `
  <div class="notes-box" style="border-left-color: #ff9800;">
    <h4>Follow-Up Advice</h4>
    <p style="margin-top: 5px;">${prescription.follow_up_advice}</p>
  </div>` : ''}

  <div class="footer">
    <p>Doctor's Sign / Stamp</p>
  </div>
</body>
</html>`;
    };

    // Download PDF
    const downloadPDF = async () => {
        try {
            setDownloading(true);
            const html = generateHTMLContent();

            const options = {
                html: html,
                fileName: `Prescription_${prescription.id}_${Date.now()}`,
                directory: Platform.OS === 'ios' ? 'Documents' : 'Downloads',
            };

            const file = await RNHTMLtoPDF.convert(options);

            if (file.filePath) {
                Alert.alert(
                    '✅ PDF Downloaded Successfully!',
                    'Your prescription has been saved to your device.',
                    [
                        {
                            text: 'Open PDF',
                            onPress: () => {
                                Linking.openURL(`file://${file.filePath}`).catch(() => {
                                    Alert.alert('Info', 'PDF saved in your Downloads folder.');
                                });
                            },
                        },
                        { text: 'OK', style: 'cancel' },
                    ],
                );
            } else {
                Alert.alert('Error', 'Failed to save PDF');
            }
        } catch (error) {
            console.log('PDF Download error:', error);
            try {
                const html = generateHTMLContent();
                await RNPrint.print({ html });
            } catch (printError) {
                Alert.alert('Error', 'Failed to generate PDF. Please try again.');
            }
        } finally {
            setDownloading(false);
        }
    };

    if (!prescription) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Error</Text>
                </View>
                <Text style={styles.errorText}>Prescription details not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Prescription Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Top Overview Card */}
                <View style={styles.topBanner}>
                    <Icon name="file-document-outline" size={40} color="#fff" />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={styles.topBannerTitle}>Prescription #{prescription.id}</Text>
                        <Text style={styles.topBannerSubTitle}>
                            {prescription.prescription_date ? prescription.prescription_date.split('T')[0] : 'N/A'}
                        </Text>
                    </View>
                </View>

                {/* Doctor Info Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Icon name="stethoscope" size={22} color="#ff5722" />
                        <Text style={styles.sectionTitle}>Prescribing Doctor</Text>
                    </View>
                    <View style={styles.divider} />

                    <Text style={[styles.value, { color: '#000', fontSize: 16 }]}>
                        {prescription.doctor?.name ? 'Dr. ' + prescription.doctor.name : 'N/A'}
                    </Text>
                    {prescription.doctor?.specialization && (
                        <Text style={styles.subText}>{prescription.doctor.specialization}</Text>
                    )}
                </View>

                {/* Medicines Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Icon name="pill" size={22} color="#ff5722" />
                        <Text style={styles.sectionTitle}>Medicines (Rx)</Text>
                    </View>
                    <View style={styles.divider} />

                    {parsedMedicines.length > 0 ? (
                        parsedMedicines.map((med, index) => (
                            <View key={index} style={styles.medItem}>
                                <View style={styles.medRow}>
                                    <Text style={styles.medName}>{index + 1}. {med.medicine}</Text>
                                    <View style={styles.medBadge}>
                                        <Text style={styles.medBadgeText}>{med.duration}</Text>
                                    </View>
                                </View>
                                <View style={[styles.medRow, { marginTop: 4, paddingLeft: 18 }]}>
                                    <Text style={styles.medDose}>{med.dosage}</Text>
                                    <Text style={styles.medFreq}>{med.frequency}</Text>
                                </View>
                                {index < parsedMedicines.length - 1 && <View style={styles.innerDivider} />}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.value}>No medicines found in this prescription.</Text>
                    )}
                </View>

                {/* Instructions Card */}
                {(prescription.instructions || prescription.follow_up_advice) && (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Icon name="information-outline" size={22} color="#ff5722" />
                            <Text style={styles.sectionTitle}>Additional Information</Text>
                        </View>
                        <View style={styles.divider} />

                        {prescription.instructions && (
                            <View style={styles.infoBlock}>
                                <Text style={styles.infoLabel}>Instructions:</Text>
                                <Text style={styles.value}>{prescription.instructions}</Text>
                            </View>
                        )}

                        {prescription.follow_up_advice && (
                            <View style={[styles.infoBlock, prescription.instructions && { marginTop: 15 }]}>
                                <Text style={styles.infoLabel}>Follow-up Advice:</Text>
                                <Text style={styles.value}>{prescription.follow_up_advice}</Text>
                            </View>
                        )}
                    </View>
                )}



            </ScrollView>
        </SafeAreaView>
    );
};

export default PrescriptionView;

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
        color: '#f0f0f0',
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
    innerDivider: {
        height: 1,
        backgroundColor: '#f9f9f9',
        marginVertical: 10,
    },
    value: {
        fontSize: 14,
        color: '#444',
        fontFamily: 'Poppins-Regular',
        lineHeight: 22,
    },
    subText: {
        fontSize: 13,
        color: '#888',
        fontFamily: 'Poppins-Regular',
        marginTop: 2,
    },
    medItem: {
        marginBottom: 5,
    },
    medRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    medName: {
        fontSize: 15,
        color: '#111',
        fontFamily: 'Poppins-SemiBold',
        flex: 1,
    },
    medBadge: {
        backgroundColor: '#fff0eb',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    medBadgeText: {
        color: '#ff5722',
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
    },
    medDose: {
        fontSize: 13,
        color: '#666',
        fontFamily: 'Poppins-Medium',
    },
    medFreq: {
        fontSize: 13,
        color: '#888',
        fontFamily: 'Poppins-Regular',
    },
    infoBlock: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#ff5722',
    },
    infoLabel: {
        fontSize: 13,
        color: '#111',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 4,
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
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    col: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Poppins-Regular',
        marginBottom: 2,
    },
});
