import { View, Text, SafeAreaView, StatusBar, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      // Wait for 2 seconds to show splash screen
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if token exists in AsyncStorage
      const token = await AsyncStorage.getItem('access_token');
      
      console.log('Token check:', token ? 'Token exists' : 'No token found');

      if (token && token.trim() !== '') {
        // Token exists, user is logged in - navigate to TabNavigation
        console.log('Navigating to TabNavigation');
        navigation.replace('TabNavigation');
      } else {
        // No token, user needs to login - navigate to Login
        console.log('Navigating to Login');
        navigation.replace('Login');
      }
    } catch (error) {
      console.log('Error checking token:', error);
      // On error, navigate to Login for safety
      navigation.replace('Login');
    }
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#FF3D00'}}>
      <StatusBar barStyle={'light-content'} backgroundColor="#FF3D00"/>

      <View style={{
        alignItems:'center',
        justifyContent:'center',
        flex:1
      }}>
        <Image 
          source={require('../assets/Images/Splash.png')}
          style={{width: 200, height: 200, resizeMode: 'contain'}}
        />
      </View>
    </SafeAreaView>
  )
}

export default Splash;
