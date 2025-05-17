import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Common Screens
import Splash from './screens/Auth/Splash';
import Option from './screens/Auth/Option';

// Auth Screens
import Login from './screens/Business/Login';
import Signup from './screens/Business/Signup';

// Business Screens
import BusinessLogin from './screens/Business/Login';
import BusinessSignup from './screens/Business/Signup';
import BusinessMain from './screens/Business/Main';
import Activity from './screens/Business/tabs/Activity';
import AddEmployee from './screens/Business/tabs/AddEmployee';
import Attendance from './screens/Business/tabs/Attendance';
import Home from './screens/Business/Home';
import Settings from './screens/Business/tabs/Settings';

// Patient Screens
import PatientLogin from './screens/Patient/Login';
import PatientSignup from './screens/Patient/Signup';
import PatientMain from './screens/Patient/Main';
import BookAppointment from './screens/Patient/BookAppointment';
import MyAppointments from './screens/Patient/MyAppointments';
import PatientProfile from './screens/Patient/PatientProfile';
import PatientList from './screens/Patient/PatientList';
import PatientRecord from './screens/Patient/PatientRecord';
import StaffList from './screens/Patient/StaffList';
import EditStaff from './screens/Patient/EditStaff';
import EditPayroll from './screens/Business/tabs/EditPayroll';
import PayrollList from './screens/Business/tabs/PayrollList';

// Stack Instances
const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const BusinessStack = createStackNavigator();
const PatientStack = createStackNavigator();

// Auth Stack
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Signup" component={Signup} />
    </AuthStack.Navigator>
  );
};

// Business Stack
const BusinessStackNavigator = () => {
  return (
    <BusinessStack.Navigator screenOptions={{headerShown: false}}>
      <BusinessStack.Screen name="BusinessLogin" component={BusinessLogin} />
      <BusinessStack.Screen name="BusinessSignup" component={BusinessSignup} />
      <BusinessStack.Screen name="BusinessMain" component={BusinessMain} />
      <BusinessStack.Screen name="EditPayroll" component={EditPayroll} />
      <BusinessStack.Screen name="PayrollList" component={PayrollList} />
      <BusinessStack.Screen name="Activity" component={Activity} />
      <BusinessStack.Screen name="AddEmployee" component={AddEmployee} />
      <BusinessStack.Screen name="Attendance" component={Attendance} />
      <BusinessStack.Screen name="Home" component={Home} />
      <BusinessStack.Screen name="Settings" component={Settings} />
    </BusinessStack.Navigator>
  );
};

// Patient Stack
const PatientStackNavigator = () => {
  return (
    <PatientStack.Navigator screenOptions={{headerShown: false}}>
      <PatientStack.Screen name="PatientLogin" component={PatientLogin} />
      <PatientStack.Screen name="PatientSignup" component={PatientSignup} />
      <PatientStack.Screen name="PatientMain" component={PatientMain} />
      <PatientStack.Screen name="BookAppointment" component={BookAppointment} />
      <PatientStack.Screen name="MyAppointments" component={MyAppointments} />
      <PatientStack.Screen name="PatientProfile" component={PatientProfile} />
      <PatientStack.Screen name="PatientList" component={PatientList} />
      <PatientStack.Screen name="PatientRecord" component={PatientRecord} />
      <PatientStack.Screen name="StaffList" component={StaffList} />
      <PatientStack.Screen name="EditStaff" component={EditStaff} />
    </PatientStack.Navigator>
  );
};

// Root App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen name="Splash" component={Splash} />
        <RootStack.Screen name="Option" component={Option} />
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        <RootStack.Screen name="Business" component={BusinessStackNavigator} />
        <RootStack.Screen name="Patient" component={PatientStackNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
