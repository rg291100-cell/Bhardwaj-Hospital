import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MessageDoctor = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Consultation</Text>
      </View>

      {/* Doctor Video Placeholder */}
      <Image
        source={require('../assets/Images/Video.png')}
        style={styles.videoBox}
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        <View style={styles.tabItem}>
          <Text style={styles.tabActive}>Chat</Text>
          <View style={styles.activeDot} />
        </View>

        <View style={styles.tabItem}>
          <Text style={styles.tabInactive}>Files</Text>
        </View>
      </View>

      <ScrollView style={styles.chatArea}>

        {/* Doctor Message */}
        <Text style={styles.nameDoctor}>Dr. Amelia Chen</Text>

        <View style={styles.doctorMessage}>
          <Image
            source={require('../assets/Images/Video.png')}
            style={styles.avatarSmall}
          />

          <View style={styles.messageBubbleDoctor}>
            <Text style={styles.messageText}>
              Hello, I'm ready to start the consultation. How are you feeling today?
            </Text>
          </View>
        </View>

        {/* User Message */}
        <Text style={styles.nameUser}>Ethan Harper</Text>

        <View style={styles.userMessage}>
          <View style={styles.messageBubbleUser}>
            <Text style={styles.messageTextUser}>
              Hi Dr. Chen, I'm feeling a bit anxious about my symptoms,
              but otherwise okay.
            </Text>
          </View>

          <Image
            source={require('../assets/Images/Video.png')}
            style={styles.avatarSmall}
          />
        </View>

        {/* Buttons */}
        <TouchableOpacity  
        onPress={()=> navigation.navigate('MedicalNotes')}
        style={styles.whiteBtn}>
          <Text style={styles.whiteBtnText}>Get Your Medical Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.orangeBtn}>
          <Text style={styles.orangeBtnText}>Consultation Details</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default MessageDoctor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop:20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
  },

  videoBox: {
    height: 180,
    width: '92%',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 10,
  },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 15,
  },

  tabItem: {
    marginRight: 30,
    alignItems: 'center',
  },

  tabActive: {
    fontSize: 16,
    fontWeight: '700',
  },

  tabInactive: {
    fontSize: 16,
    color: '#777',
  },

  activeDot: {
    width: 25,
    height: 3,
    backgroundColor: 'black',
    marginTop: 2,
    borderRadius: 10,
  },

  chatArea: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  nameDoctor: {
    fontSize: 13,
    color: '#888',
    marginBottom: 5,
    marginLeft: 5,
  },

  nameUser: {
    fontSize: 13,
    color: '#888',
    marginBottom: 5,
    alignSelf: 'flex-end',
    marginRight: 5,
  },

  doctorMessage: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  userMessage: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },

  avatarSmall: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 8,
  },

  messageBubbleDoctor: {
    maxWidth: '75%',
    backgroundColor: '#e8f4ff',
    padding: 12,
    borderRadius: 12,
    marginLeft: -5,
  },

  messageBubbleUser: {
    maxWidth: '75%',
    backgroundColor: '#ff5a2d',
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
  },

  messageText: {
    fontSize: 14,
    color: '#000',
  },

  messageTextUser: {
    fontSize: 14,
    color: '#fff',
  },

  whiteBtn: {
    borderWidth: 1,
    borderColor: '#ff5a2d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  whiteBtnText: {
    color: '#ff5a2d',
    fontWeight: '600',
  },

  orangeBtn: {
    backgroundColor: '#ff5a2d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  orangeBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
