import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const StaffList = ({navigation}) => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('staff')
      .onSnapshot(snapshot => {
        const staffList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStaff(staffList);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EditStaff', {staffId: item.id})}
      style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>Role: {item.role}</Text>
      <Text style={styles.detail}>
        Available: {item.available ? 'Yes' : 'No'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staff Management</Text>
      <FlatList
        data={staff}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 30}}
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
    fontSize: 22,
    color: '#90ee90',
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  card: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#90ee90',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  detail: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
  },
});

export default StaffList;
