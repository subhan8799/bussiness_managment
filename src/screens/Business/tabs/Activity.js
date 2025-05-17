import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import EditEmployee from '../../../common/EditEmployee';

const Activity = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [checkInEnable, setCheckInEnable] = useState(true);
  const [checkOutEnable, setCheckOutEnable] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const today = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    setCurrentDate(today);
    getSavedDate(today);

    const unsubscribe = firestore()
      .collection('employees')
      .doc('users')
      .onSnapshot(documentSnapshot => {
        const list = documentSnapshot.data()?.employeeList || [];
        setUsersList(list);
      });

    return () => unsubscribe();
  }, []);

  const getSavedDate = async (dateArg) => {
    const date = dateArg || await AsyncStorage.getItem('DATE');
    const status = await AsyncStorage.getItem('STATUS');
    const emailId = await AsyncStorage.getItem('EMAIL');
    const userId = await AsyncStorage.getItem('USERID');

    if (date === dateArg && status === 'CIN') {
      setCheckInEnable(false);
      setCheckOutEnable(true);
    } else if (date === dateArg && status === 'COUT') {
      setCheckInEnable(false);
      setCheckOutEnable(false);
    }
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
        <Text style={{ color: 'black', fontWeight: '700', fontSize: 16 }}>Activity</Text>
      </View>

      {/* Employee List */}
      <ScrollView style={{ padding: 10 }}>
        <Text style={{ fontWeight: '700', fontSize: 16, paddingVertical: 10, color: '#fff' }}>Activity List</Text>

        {usersList.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: '#121212',
              borderRadius: 10,
              padding: 20,
              marginBottom: 20,
              elevation: 6,
            }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#fff' }}>
              {'Name: ' + item?.name}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#aaa' }}>
              {'Role: Employee'}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#aaa' }}>
              {'Status: Working'}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {/* Uncomment below to enable Edit */}
              {/* <TouchableOpacity
                style={{
                  flex: 1,
                  height: 50,
                  backgroundColor: '#00BFFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  marginRight: 10,
                }}
                onPress={() => handleEdit(index)}
              >
                <Text style={{ color: 'black', fontWeight: '600' }}>Edit</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 50,
                  backgroundColor: 'red',
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

export default Activity;
