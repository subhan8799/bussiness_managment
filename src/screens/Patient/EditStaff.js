import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';

const EditStaff = ({route, navigation}) => {
  const staffId = route?.params?.staffId ?? null;
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [available, setAvailable] = useState(true);
  const [shifts, setShifts] = useState('');

  useEffect(() => {
    if (staffId) {
      firestore()
        .collection('staff')
        .doc(staffId)
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            setName(data.name || '');
            setRole(data.role || '');
            setAvailable(data.available ?? true);
            setShifts((data.shifts || []).join(', '));
          }
        })
        .catch(() => Alert.alert('Error', 'Failed to fetch staff data'));
    }
  }, [staffId]);

  const handleSave = () => {
    if (!name || !role || !shifts) {
      Alert.alert('Missing Fields', 'Please fill all fields');
      return;
    }

    const staffData = {
      name,
      role,
      available,
      shifts: shifts.split(',').map(s => s.trim()),
    };

    const collectionRef = firestore().collection('staff');

    const promise = staffId
      ? collectionRef.doc(staffId).update(staffData)
      : collectionRef.add(staffData);

    promise
      .then(() => {
        Alert.alert('Success', staffId ? 'Staff updated!' : 'Staff added!');
        navigation.goBack();
      })
      .catch(() => Alert.alert('Error', 'Failed to save staff'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Staff Name</Text>
        <TextInput
          placeholder="Staff Name"
          placeholderTextColor="#90ee90aa"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Role</Text>
        <Picker
          selectedValue={role}
          onValueChange={setRole}
          style={styles.picker}
          dropdownIconColor="#90ee90">
          <Picker.Item label="Select Role" value="" color="#90ee90aa" />
          <Picker.Item label="Doctor" value="doctor" color="#90ee90" />
          <Picker.Item label="Nurse" value="nurse" color="#90ee90" />
          <Picker.Item label="Admin" value="admin" color="#90ee90" />
        </Picker>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Shifts</Text>
        <TextInput
          placeholder="Shifts (e.g., Mon 9-12, Tue 1-5)"
          placeholderTextColor="#90ee90aa"
          value={shifts}
          onChangeText={setShifts}
          style={styles.input}
        />
      </View>

      <View style={[styles.card, styles.switchRow]}>
        <Text style={styles.label}>Available</Text>
        <Switch
          value={available}
          onValueChange={setAvailable}
          trackColor={{false: '#555', true: '#90ee90'}}
          thumbColor={available ? '#4caf50' : '#222'}
        />
      </View>

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save Staff</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    // Shadows for iOS
    shadowColor: '#90ee90',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#90ee90cc',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  input: {
    fontSize: 16,
    color: '#90ee90',
    borderBottomWidth: 1,
    borderBottomColor: '#90ee9040',
    paddingVertical: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  picker: {
    color: '#90ee90',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    // Shadow for button
    shadowColor: '#4caf50',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default EditStaff;
