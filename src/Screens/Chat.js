import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as DocumentPicker from '@react-native-documents/picker';

const baseURL = 'https://argosmob.uk/bhardwaj-hospital/public/api';

const Chat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentId, doctorName, doctorImage } = route.params || {};

  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  /* ===================== PERMISSIONS ===================== */
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  /* ===================== FETCH MESSAGES ===================== */
  const fetchMessages = async convId => {
    if (!convId) return;

    try {
      const token = await AsyncStorage.getItem('access_token');

      const res = await axios.get(`${baseURL}/chat/${convId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.messages?.data) {
        const formatted = res.data.messages.data.map(msg => {
          // Check if message has attachments
          let fileUrl = null;
          let messageType = msg.message_type || 'text';
          let fileName = null;
          let mimeType = null;
          
          if (msg.attachments && msg.attachments.length > 0) {
            fileUrl = msg.attachments[0].url;
            fileName = msg.attachments[0].original_name;
            mimeType = msg.attachments[0].mime_type;
            
            // Determine type based on mime type
            if (mimeType?.includes('image')) {
              messageType = 'image';
            } else if (mimeType?.includes('pdf')) {
              messageType = 'pdf';
            } else {
              messageType = 'file';
            }
          }

          return {
            id: msg.id.toString(),
            text: msg.message,
            type: messageType,
            file: fileUrl,
            fileName: fileName,
            mimeType: mimeType,
            sender: msg.sender_type === 'doctor' ? 'doctor' : 'user',
            time: msg.created_at
              ? new Date(msg.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '',
          };
        });
        setMessages(formatted);
      }
    } catch (err) {
      console.log('Fetch error:', err.response?.data || err.message);
    }
  };

  /* ===================== START CONVERSATION ===================== */
  const startConversation = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      const res = await axios.post(
        `${baseURL}/chat/conversation/start`,
        { appointment_id: appointmentId, type: 'chat' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const convId =
        res.data?.conversation_id || res.data?.data?.conversation_id;

      if (convId) {
        setConversationId(convId);
        fetchMessages(convId);
      }
    } catch (err) {
      console.log('Conversation error:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    startConversation();
  }, [appointmentId]);

  useEffect(() => {
    if (!conversationId) return;
    const interval = setInterval(() => fetchMessages(conversationId), 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  /* ===================== SEND TEXT ===================== */
  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;

    const tempMsg = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      type: 'text',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages(prev => [...prev, tempMsg]);
    setInput('');

    try {
      const token = await AsyncStorage.getItem('access_token');

      await axios.post(
        `${baseURL}/chat/${conversationId}/message/send`,
        { message: tempMsg.text, message_type: 'text' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log('Send error:', err.response?.data || err.message);
    }
  };

  /* ===================== SEND MEDIA ===================== */
  const sendMedia = async (file, type) => {
    if (!conversationId) return;

    try {
      const token = await AsyncStorage.getItem('access_token');

      const formData = new FormData();
      formData.append('message_type', type);
      const fileName = file.fileName || file.name || `file_${Date.now()}`;

      formData.append('attachment', {
        uri: file.uri,
        name: fileName,
        type: file.type || 'application/octet-stream',
      });

      console.log('Sending FormData:', {
        message_type: type,
        file: {
          uri: file.uri,
          name: fileName,
          type: file.type
        }
      });

      const res = await axios.post(
        `${baseURL}/chat/${conversationId}/message/send`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload success:', res.data);
      fetchMessages(conversationId);
    } catch (err) {
      console.log('Error sending media:', err.response?.data || err.message);
    }
  };

  /* ===================== OPEN PDF ===================== */
  // const handleOpenPDF = (fileUrl, fileName) => {
  //   Alert.alert(
  //     'Open PDF',
  //     fileName || 'Document.pdf',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Open in Browser',
  //         onPress: () => {
  //           Linking.openURL(fileUrl).catch(err =>
  //             console.error('Error opening PDF:', err)
  //           );
  //         },
  //       },
  //       {
  //         text: 'View PDF',
  //         onPress: () => {
  //           navigation.navigate('PDFViewer', { 
  //             pdfUrl: fileUrl, 
  //             fileName: fileName 
  //           });
  //         },
  //       },
  //     ]
  //   );
  // };
const handleOpenPDF = async (fileUrl, fileName) => {
  try {
    const supported = await Linking.canOpenURL(fileUrl);
    if (supported) {
      await Linking.openURL(fileUrl);
    } else {
      Alert.alert('Error', 'Cannot open this PDF file');
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to open PDF');
    console.error('Error opening PDF:', error);
  }
};
  /* ===================== CAMERA / GALLERY / DOCUMENT ===================== */
  const openCamera = async () => {
    const ok = await requestCameraPermission();
    if (!ok) return;

    const res = await launchCamera({ mediaType: 'photo', quality: 0.5 });
    if (res.assets?.length) sendMedia(res.assets[0], 'image');
  };

  const openGallery = async () => {
    const ok = await requestGalleryPermission();
    if (!ok) return;

    const res = await launchImageLibrary({ mediaType: 'mixed' });
    if (res.assets?.length) {
      const type = res.assets[0].type?.includes('image') ? 'image' : 'file';
      sendMedia(res.assets[0], type);
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });

      if (res && res.length > 0) {
        console.log('Document picked:', res[0]);
        sendMedia(res[0], 'file');
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err))
        console.log('Document picker error:', err);
    }
  };

  /* ===================== RENDER MESSAGE ===================== */
  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.doctorBubble,
        ]}
      >
        {item.type === 'image' && item.file ? (
          <Image 
            source={{ uri: item.file }} 
            style={styles.imageMsg}
            resizeMode="cover"
          />
        ) : item.type === 'pdf' && item.file ? (
          <TouchableOpacity 
            onPress={() => handleOpenPDF(item.file, item.fileName)}
            style={styles.pdfContainer}
          >
            <Icon name="file-pdf-box" size={40} color={isUser ? '#fff' : '#E66A2C'} />
            <View style={styles.pdfInfo}>
              <Text
                style={[
                  styles.pdfFileName,
                  isUser ? styles.userText : styles.doctorText,
                ]}
                numberOfLines={2}
              >
                {item.fileName || 'Document.pdf'}
              </Text>
              <Text
                style={[
                  styles.pdfAction,
                  isUser ? styles.userText : styles.doctorText,
                ]}
              >
                Tap to open
              </Text>
            </View>
          </TouchableOpacity>
        ) : item.type === 'file' && item.file ? (
          <TouchableOpacity 
            onPress={() => Linking.openURL(item.file)}
            style={styles.fileContainer}
          >
            <Icon name="file-document" size={24} color={isUser ? '#fff' : '#E66A2C'} />
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userText : styles.doctorText,
              ]}
            >
              {item.fileName || '📎 File'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.doctorText,
            ]}
          >
            {item.text || ''}
          </Text>
        )}
        <Text style={[styles.timeText, isUser && { color: 'rgba(255,255,255,0.7)' }]}>
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Image
              source={
                doctorImage
                  ? {
                      uri: `https://argosmob.uk/bhardwaj-hospital/storage/app/public/${doctorImage}`,
                    }
                  : require('../assets/Images/Doctor.png')
              }
              style={styles.avatar}
            />
            <Text style={styles.doctorName}>{doctorName}</Text>
          </View>
          <View/>
        </View>

        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContainer}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={openCamera}>
            <Icon name="camera" size={22} color="#E66A2C" />
          </TouchableOpacity>

          <TouchableOpacity onPress={openGallery}>
            <Icon name="image" size={22} color="#E66A2C" />
          </TouchableOpacity>

          <TouchableOpacity onPress={pickDocument}>
            <Icon name="paperclip" size={22} color="#E66A2C" />
          </TouchableOpacity>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', marginLeft: 12, flex: 1 },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 10, backgroundColor: '#eee' },
  doctorName: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#000' },
  chatContainer: { paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1 },
  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 14, marginBottom: 10 },
  userBubble: { backgroundColor: '#E66A2C', alignSelf: 'flex-end', borderTopRightRadius: 4 },
  doctorBubble: { backgroundColor: '#F2F2F2', alignSelf: 'flex-start', borderTopLeftRadius: 4 },
  messageText: { fontSize: 14, lineHeight: 20, fontFamily: 'Poppins-Regular' },
  userText: { color: '#fff' },
  doctorText: { color: '#000' },
  timeText: { fontSize: 10, marginTop: 6, alignSelf: 'flex-end', fontFamily: 'Poppins-Regular', color: '#777' },
  imageMsg: { width: 200, height: 200, borderRadius: 12, marginBottom: 6, resizeMode: 'cover', backgroundColor: '#eee' },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pdfContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  pdfInfo: {
    flex: 1,
  },
  pdfFileName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  pdfAction: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    opacity: 0.8,
  },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: Platform.OS === 'ios' ? 12 : 8, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  input: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 25, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 12 : 8, fontSize: 14, fontFamily: 'Poppins-Regular', color: '#000', marginHorizontal: 8 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E66A2C', alignItems: 'center', justifyContent: 'center' },
});