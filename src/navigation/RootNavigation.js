import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../Screens/Login';
import From from '../Screens/From ';
// import TabNavigation from '../navigation/TabNavigation';
import DoctorDetails from '../Screens/DoctorDetails';
import BookAppointment from '../Screens/BookAppointment';
import Appointment from '../Screens/Appointment';
import BookBed from '../Screens/BookBed';
import AvailableBeds from '../Screens/AvailableBeds';
import AppointmentDetails from '../Screens/AppointmentDetails';
import RescheduleAppointment from '../Screens/RescheduleAppointment';
import EventsDetail from '../Screens/EventsDetail';
import Notifications from '../Screens/Notifications';
import OPD from '../Screens/OPD';
import BedBookingStatus from '../Screens/BedBookingStatus';
import AdmissionDetails from '../Screens/AdmissionDetails';
import PaymentScreen from '../Screens/PaymentScreen';
import Consultations from '../Screens/Consultations';
import Prescriptions from '../Screens/Prescriptions';
import MessageDoctor from '../Screens/MessageDoctor';
import MedicalNotes from '../Screens/MedicalNotes';
import Emergency from '../Screens/Emergency';
import EmergencyStatus from '../Screens/EmergencyStatus';
import ReportsScreen from '../Screens/ReportsScreen';
import MedicalHistory from '../Screens/MedicalHistory';
import ReportView from '../Screens/ReportView';
import Splash from '../Screens/Splash';
import Otp from '../Screens/Otp';
import Chat from '../Screens/Chat';
import Evants from '../Screens/Evants';
import Services from '../Screens/Services';
import UpdateProfile from'../Screens/UpdateProfile';
import TabNavigation from '../navigation/TabNavigation';
import Doctor from "../Screens/Doctor"
import VideoCall from "../Component/VideoCall"
import Specialty from '../Screens/Specialty';
import PDFViewer from '../Component/PDFViewer';

const Stack = createNativeStackNavigator();

 const RootNavigation =()=> {
  return (
  
    <NavigationContainer>
      <Stack.Navigator>
         {/* <Stack.Screen
          name="Login"
          component={}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="From"
          component={From}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
  name="VideoCall" 
  component={VideoCall}
  options={{ headerShown: false }}
/>
         <Stack.Screen
          name="TabNavigation"
          component={TabNavigation}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="DoctorDetails"
          component={DoctorDetails}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Doctor"
          component={Doctor}
          options={{ headerShown: false }}
        />

    <Stack.Screen
          name="PDFViewer"
          component={PDFViewer}
          options={{ headerShown: false }}
        />

        
      <Stack.Screen
          name="Specialty"
          component={Specialty}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="BookAppointment"
          component={BookAppointment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="Appointment"
          component={Appointment}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="EventsDetail"
          component={EventsDetail}
          options={{ headerShown: false }}
        />
           <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookBed"
          component={BookBed}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="AvailableBeds"
          component={AvailableBeds}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="AppointmentDetails"
          component={AppointmentDetails}
          options={{ headerShown: false }}
        />
        
             <Stack.Screen
          name="RescheduleAppointment"
          component={RescheduleAppointment}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="OPD"
          component={OPD}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="BedBookingStatus"
          component={BedBookingStatus}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdmissionDetails"
          component={AdmissionDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Consultations"
          component={Consultations}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Prescriptions"
          component={Prescriptions}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="MessageDoctor"
          component={MessageDoctor}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="MedicalNotes"
          component={MedicalNotes}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Emergency"
          component={Emergency}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="Evants"
          component={Evants}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="Services"
          component={Services}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="EmergencyStatus"
          component={EmergencyStatus}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="ReportsScreen"
          component={ReportsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MedicalHistory"
          component={MedicalHistory}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="ReportView"
          component={ReportView}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Otp"
          component={Otp}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfile}
          options={{ headerShown: false }}
        />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigation;


