import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import Loader from '../../../common/Loader';
import uuid from 'react-native-uuid';

const AddEmployee = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  const saveDataOnFirestore = async () => {
    let userId = uuid.v4();
    const newUser = {
      name,
      email,
      password,
      designation,
      phone,
      role,
      userId,
    };

    setModalVisible(true);

    try {
      await firestore()
        .collection('employees')
        .doc('users')
        .update({
          employeeList: firestore.FieldValue.arrayUnion(newUser),
        })
        .then(() => {
          alert('Employee Added Successfully');
        })
        .catch(() => {
          alert('Something went wrong!');
        });

      setModalVisible(false);
      navigation.goBack();
    } catch (e) {
      if (e.code === 'firestore/not-found') {
        await firestore()
          .collection('employees')
          .doc('users')
          .set({
            employeeList: [newUser],
          });

        setModalVisible(false);
        navigation.goBack();
      } else {
        console.log('User add error', e);
        setModalVisible(false);
      }
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#000' }}>
      <View
        style={{
          width: '100%',
          height: 60,
          elevation: 4,
          backgroundColor: '#00BFFF',
          justifyContent: 'center',
          paddingLeft: 20,
        }}>
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
          Add Employee
        </Text>
      </View>

      <View style={{ width: '90%', marginTop: 20 }}>
        <TextInput
          placeholder="Enter Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter Designation"
          placeholderTextColor="#888"
          value={designation}
          onChangeText={setDesignation}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter Number"
          placeholderTextColor="#888"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter Role"
          placeholderTextColor="#888"
          value={role}
          onChangeText={setRole}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            if (name && email && password) {
              saveDataOnFirestore();
            } else {
              alert('Please Enter All Data');
            }
          }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Save</Text>
        </TouchableOpacity>
      </View>

      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

const styles = {
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#00BFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 20,
    color: '#fff',
    backgroundColor: '#111',
  },
  saveButton: {
    height: 50,
    backgroundColor: '#00BFFF',
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default AddEmployee;
