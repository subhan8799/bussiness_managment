import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const PatientProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation()

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          setUserData(doc.data());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#90ee90" />
      </View>
    );
  }

  const handleLogout = () => {
    AsyncStorage.clear();
    navigation.navigate('Option')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userData?.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData?.email}</Text>

        <Text style={styles.label}>Age:</Text>
        <Text style={styles.value}>{userData?.age}</Text>
      </View>
       <TouchableOpacity
              onPress={handleLogout}
              style={[styles.button]}
              activeOpacity={0.7}
              disabled={loading}
            >
                <Text style={styles.buttonText}>Logout</Text>
              
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#90ee90',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#90ee90',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    color: '#90ee90',
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  value: {
    color: '#e0ffe0',
    fontSize: 16,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  infoText: {
    color: '#90ee90',
    fontSize: 16,
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
});

export default PatientProfile;
