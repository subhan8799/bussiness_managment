import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PatientList = ({navigation}) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('patientRecords')
      .onSnapshot(snapshot => {
        const patientList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        setPatients(patientList);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Records</Text>
      <FlatList
        data={patients}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom: 20}}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('PatientRecord', {patientId: item.id})}
            style={styles.card}
            activeOpacity={0.7}>
            <Text style={styles.name}>Name: {item.name}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
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
    fontWeight: '700',
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    // Shadows iOS
    shadowColor: '#90ee90',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Elevation Android
    elevation: 6,
  },
  name: {
    color: '#90ee90',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  status: {
    color: '#a0dca0',
    fontSize: 14,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default PatientList;
