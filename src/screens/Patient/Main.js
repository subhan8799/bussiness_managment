import React from 'react';
import {View, Text, TouchableOpacity, FlatList, Platform} from 'react-native';

const BUTTONS = [
  {key: 'book', label: 'Book Appointment', screen: 'BookAppointment'},
  {key: 'myAppts', label: 'My Appointments', screen: 'MyAppointments'},
  {key: 'profile', label: 'Profile', screen: 'PatientProfile'},
  {key: 'patients', label: 'All Patients (Doctor View)', screen: 'PatientList'},
  {key: 'record', label: 'Patient Record', screen: 'PatientRecord'},
  {key: 'staff', label: 'Medical Staff', screen: 'StaffList'},
  {key: 'editStaff', label: 'Edit Staff', screen: 'EditStaff'},
];

const PatientMain = ({navigation}) => {
  const renderButton = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.screen)}
      style={styles.button}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Dashboard</Text>

      <FlatList
        data={BUTTONS}
        renderItem={renderButton}
        keyExtractor={item => item.key}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{paddingBottom: 80}}
      />

      {/* Custom Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate('PatientMain')}
        >
          <Text style={styles.bottomButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate('MyAppointments')}
        >
          <Text style={styles.bottomButtonText}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate('PatientProfile')}
        >
          <Text style={styles.bottomButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#90ee90',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#90ee90',
    marginHorizontal: 6,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    shadowColor: '#90ee90',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopColor: '#90ee90',
    borderTopWidth: 1,
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomButtonText: {
    color: '#90ee90',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
};

export default PatientMain;
