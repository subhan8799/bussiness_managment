import {
  View, Text, TouchableOpacity, ScrollView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import EditEmployee from '../../../common/EditEmployee';

let emailId = '', userId = '';
let attendanceList = [];

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [checkInEnable, setCheckInEnable] = useState(true);
  const [checkOutEnable, setCheckOutEnable] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: '', email: '' });

  useEffect(() => {
    setCurrentDate(`${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`);
    getSavedDate();
  }, []);

  const getSavedDate = async () => {
    const date = await AsyncStorage.getItem('DATE');
    const status = await AsyncStorage.getItem('STATUS');
    emailId = await AsyncStorage.getItem('EMAIL');
    userId = await AsyncStorage.getItem('USERID');

    if (date === currentDate && status === 'CIN') {
      setCheckInEnable(false);
      setCheckOutEnable(true);
    } else if (date === currentDate && status === 'COUT') {
      setCheckInEnable(false);
      setCheckOutEnable(false);
    }

    firestore()
      .collection('employees')
      .doc('users')
      .onSnapshot(documentSnapshot => {
        const list = documentSnapshot.data()?.employeeList || [];
        setUsersList(list);
        attendanceList = [...list];
      });
  };

  const updateUserList = async (updatedList) => {
    await firestore().collection('employees').doc('users').update({
      employeeList: updatedList,
    });
  };

  const handleEdit = (index) => {
    setSelectedUserIndex(index);
    setEditedUser(usersList[index]);
    setEditModalVisible(true);
  };

  const handleEditSave = () => {
    const updatedList = [...usersList];
    updatedList[selectedUserIndex] = editedUser;
    updateUserList(updatedList);
    setEditModalVisible(false);
  };

  const handleDelete = (index) => {
    const updatedList = usersList.filter((_, i) => i !== index);
    updateUserList(updatedList);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Header */}
      <View style={{ height: 60, backgroundColor: '#00BFFF', justifyContent: 'center', paddingLeft: 20 }}>
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Employees</Text>
      </View>

      {/* Employee List */}
      <ScrollView style={{ padding: 10 }}>
        <Text style={{ fontWeight: '700', fontSize: 16, paddingVertical: 10, color: '#fff' }}>
          Employee List
        </Text>

        {usersList.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: '#111',
              borderRadius: 10,
              padding: 20,
              marginBottom: 20,
              elevation: 6,
              borderColor: '#222',
              borderWidth: 1,
            }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#fff' }}>
              Name: <Text style={{ fontWeight: '400' }}>{item?.name}</Text>
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#fff' }}>
              Email: <Text style={{ fontWeight: '400' }}>{item?.email}</Text>
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 45,
                  backgroundColor: '#00BFFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  marginRight: 10,
                }}
                onPress={() => handleEdit(index)}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 45,
                  backgroundColor: '#ff4d4d',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}
                onPress={() => handleDelete(index)}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Edit Modal */}
      <EditEmployee
        editModalVisible={editModalVisible}
        setEditedUser={setEditedUser}
        editedUser={editedUser}
        handleEditSave={handleEditSave}
        setEditModalVisible={setEditModalVisible}
      />
    </View>
  );
};

export default Attendance;
