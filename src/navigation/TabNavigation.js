import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import Home from '../Screens/Home';
import Doctor from '../Screens/Doctor';
import Appointment from '../Screens/Appointment';
import Profile from '../Screens/Profile';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 80,
        },
        tabBarActiveTintColor: '#007BFF', 
        tabBarInactiveTintColor: '#999',   
            tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium', 
          fontSize: 10,                 
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/home.png')}
              style={{ width: 22, height: 22, tintColor: color }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={Doctor}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/compass.png')}
              style={{ width: 22, height: 22, tintColor: color }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Appointments"
        component={Appointment}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/calendar.png')}
              style={{ width: 22, height: 22, tintColor: color }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/users.png')}
              style={{ width: 22, height: 22, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
