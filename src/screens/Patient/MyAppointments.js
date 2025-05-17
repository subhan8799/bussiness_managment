import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setAppointments([]);
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!userId) return;

    const unsubscribeFirestore = firestore()
      .collection('appointments')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          if (!snapshot || !snapshot.docs) return;

          const list = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
          setAppointments(list);
          setLoading(false);
        },
        error => {
          console.error('Firestore error:', error);
          setLoading(false);
        }
      );

    return unsubscribeFirestore;
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#90ee90" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Appointments</Text>
      {appointments.length === 0 ? (
        <Text style={styles.noDataText}>No appointments found.</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingBottom: 20}}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{item.date}</Text>

              <Text style={styles.label}>Time:</Text>
              <Text style={styles.value}>{item.time}</Text>

              <Text style={styles.label}>Reason:</Text>
              <Text style={styles.value}>{item.reason}</Text>

              <Text style={styles.label}>Status:</Text>
              <Text
                style={[
                  styles.value,
                  item.status === 'pending' && {color: '#ffcc00'},
                  item.status === 'confirmed' && {color: '#4caf50'},
                  item.status === 'cancelled' && {color: '#f44336'},
                ]}>
                {item.status}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#90ee90',
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  noDataText: {
    color: '#90ee90aa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    // Shadow for iOS
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
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  value: {
    fontSize: 16,
    color: '#90ee90',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default MyAppointments;
