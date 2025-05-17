import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PatientRecord = ({route, navigation}) => {
  const patientId = route?.params?.patientId ?? null;

  const [name, setName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [followUp, setFollowUp] = useState('');

  useEffect(() => {
    if (patientId) {
      firestore()
        .collection('patientRecords')
        .doc(patientId)
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            setName(data.name || '');
            setDiagnosis(data.diagnosis || '');
            setTreatment(data.treatment || '');
            setFollowUp(data.followUp || '');
          }
        })
        .catch(error => {
          console.error('Failed to fetch patient record:', error);
          Alert.alert('Error', 'Could not fetch patient data');
        });
    }
  }, [patientId]);

  const handleSave = () => {
    if (!name || !diagnosis || !treatment) {
      Alert.alert('Missing Fields', 'Please fill all fields');
      return;
    }

    const patientData = {
      name,
      diagnosis,
      treatment,
      followUp: followUp || 'Not scheduled',
    };

    const ref = firestore().collection('patientRecords');

    const operation = patientId
      ? ref.doc(patientId).update(patientData)
      : ref.add(patientData);

    operation
      .then(() => {
        Alert.alert('Success', patientId ? 'Record updated!' : 'Record saved!');
        navigation.goBack();
      })
      .catch(() => Alert.alert('Error', 'Failed to save record'));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {patientId ? 'Edit Patient Record' : 'New Patient Record'}
      </Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Diagnosis"
          placeholderTextColor="#888"
          value={diagnosis}
          onChangeText={setDiagnosis}
          style={styles.input}
        />
        <TextInput
          placeholder="Treatment"
          placeholderTextColor="#888"
          value={treatment}
          onChangeText={setTreatment}
          style={styles.input}
        />
        <TextInput
          placeholder="Follow-up (optional)"
          placeholderTextColor="#888"
          value={followUp}
          onChangeText={setFollowUp}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save Record</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: '#90ee90',
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  card: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#90ee90',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#90ee90',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  button: {
    backgroundColor: '#90ee90',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#90ee90',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PatientRecord;
