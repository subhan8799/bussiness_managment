import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const BookAppointment = ({navigation}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('staff')
      .where('role', '==', 'doctor')
      .onSnapshot(snapshot => {
        const doctorList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        setDoctors(doctorList);
      });
    return () => unsubscribe();
  }, []);

  const handleDoctorChange = doctorId => {
    setSelectedDoctor(doctorId);
    const selectedDoctorData = doctors.find(doctor => doctor.id === doctorId);
    if (selectedDoctorData) {
      setAvailableSlots(selectedDoctorData.availability || []);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleBook = async () => {
    if (!date || !time || !reason || !selectedDoctor) {
      Alert.alert('Missing Fields', 'Please fill all fields');
      return;
    }

    const user = auth().currentUser;
    if (!user) return;

    setLoading(true);
    try {
      await firestore().collection('appointments').add({
        userId: user.uid,
        doctorId: selectedDoctor,
        date,
        time,
        reason,
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Success', 'Appointment requested!');
      setTimeout(() => navigation.goBack(), 500);
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
      <Text style={styles.label}>Choose a Doctor</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedDoctor}
          onValueChange={handleDoctorChange}
          style={styles.picker}
          dropdownIconColor="#90ee90"
        >
          <Picker.Item label="Select Doctor" value="" />
          {doctors.map(doctor => (
            <Picker.Item key={doctor.id} label={doctor.name} value={doctor.id} />
          ))}
        </Picker>
      </View>

      {selectedDoctor && availableSlots.length > 0 && (
        <>
          <Text style={styles.label}>Available Slots:</Text>
          {availableSlots.map((slot, index) => (
            <View key={index} style={styles.slotItem}>
              <Text style={styles.slotText}>
                {slot.day}: {slot.slots.join(', ')}
              </Text>
            </View>
          ))}
        </>
      )}

      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        placeholderTextColor="#90ee90aa"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Time (HH:MM)"
        placeholderTextColor="#90ee90aa"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />
      <TextInput
        placeholder="Reason"
        placeholderTextColor="#90ee90aa"
        value={reason}
        onChangeText={setReason}
        style={[styles.input, {height: 80}]}
        multiline
      />

      <TouchableOpacity
        onPress={handleBook}
        style={[styles.button, loading && {backgroundColor: '#76c776'}]}
        activeOpacity={0.7}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.buttonText}>Book Appointment</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#90ee90',
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#90ee90',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    color: '#90ee90',
    backgroundColor: '#111',
  },
  slotItem: {
    marginBottom: 6,
  },
  slotText: {
    color: '#90ee90',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#90ee90',
    color: '#90ee90',
    marginBottom: 20,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    paddingVertical: 6,
  },
  button: {
    backgroundColor: '#90ee90',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
};

export default BookAppointment;
