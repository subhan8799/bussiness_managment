import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import banner from '../../images/Banner.png';
import TimeModal from '../../common/TimeModal';

let emailId = '', userId = '';
let attendanceList = [];

const Home = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [checkInEnable, setCheckInEnable] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkOutEnable, setCheckOutEnable] = useState(false);
  const [attendanceListData, setAttendanceListData] = useState([]);

  useEffect(() => {
    setCurrentDate(
      new Date().getDate() +
      '/' +
      (new Date().getMonth() + 1) +
      '/' +
      new Date().getFullYear()
    );

    getSavedDate();
  }, []);

  const saveDate = async () => {
    await AsyncStorage.setItem(
      'DATE',
      new Date().getDate() +
      '/' +
      (new Date().getMonth() + 1) +
      '/' +
      new Date().getFullYear()
    );
  };

  const getSavedDate = async () => {
    const date = await AsyncStorage.getItem('DATE');
    const status = await AsyncStorage.getItem('STATUS');
    emailId = await AsyncStorage.getItem('EMAIL');
    userId = await AsyncStorage.getItem('USERID');

    if (
      date ===
        new Date().getDate() +
        '/' +
        (new Date().getMonth() + 1) +
        '/' +
        new Date().getFullYear() &&
      status === 'CIN'
    ) {
      setCheckInEnable(false);
      setCheckOutEnable(true);
    } else if (
      date ===
        new Date().getDate() +
        '/' +
        (new Date().getMonth() + 1) +
        '/' +
        new Date().getFullYear() &&
      status === 'COUT'
    ) {
      setCheckInEnable(false);
      setCheckOutEnable(false);
    }

    attendanceList = [];
    firestore()
      .collection('employees')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        const data = documentSnapshot.data();
        if (data?.attendance) {
          const filtered = data.attendance.filter(item => item.checkIn && item.checkOut);
          attendanceList = filtered;
          setAttendanceListData(filtered);
        }
      });
  };

  const saveCheckin = async () => {
    await AsyncStorage.setItem('STATUS', 'CIN');
  };

  const saveCheckout = async () => {
    await AsyncStorage.setItem('STATUS', 'COUT');
  };

  const uploadCheckIn = () => {
    const currentTime = new Date().getHours() + ':' + new Date().getMinutes();
    attendanceList.push({
      checkIn: currentTime,
      checkOut: '',
      date: currentDate,
    });
    firestore()
      .collection('employees')
      .doc(userId)
      .update({ attendance: attendanceList });
  };

  const uploadCheckOut = () => {
    const currentTime = new Date().getHours() + ':' + new Date().getMinutes();
    if (attendanceList.length > 0) {
      attendanceList[attendanceList.length - 1].checkOut = currentTime;
      attendanceList[attendanceList.length - 1].date = currentDate;
      firestore()
        .collection('employees')
        .doc(userId)
        .update({ attendance: attendanceList });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View
        style={{
          width: '100%',
          height: 60,
          elevation: 4,
          backgroundColor: '#00BFFF',
          justifyContent: 'center',
          paddingLeft: 20,
        }}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
          Home
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        {/* <Image
          source={banner}
          style={{ height: 100, width: 380, margin: 15 }}
          resizeMode="contain"
        /> */}

        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16, padding: 10 }}>
          Employee Status
        </Text>

        <View
          style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 15,
            padding: 20,
            margin: 20,
            shadowColor: '#fff',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 6,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#fff',
              marginBottom: 20,
            }}>
            {'Today Date: ' + currentDate}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              disabled={!checkInEnable}
              style={{
                flex: 1,
                height: 50,
                backgroundColor: checkInEnable ? '#00BFFF' : '#333',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                marginRight: 10,
              }}
              onPress={() => {
                saveDate();
                saveCheckin();
                setCheckInEnable(false);
                setCheckOutEnable(true);
                uploadCheckIn();
              }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Check In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!checkOutEnable}
              style={{
                flex: 1,
                height: 50,
                backgroundColor: checkOutEnable ? '#00BFFF' : '#333',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                marginLeft: 10,
              }}
              onPress={() => {
                saveCheckout();
                setCheckInEnable(false);
                setCheckOutEnable(false);
                uploadCheckOut();
              }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Check Out</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              height: 40,
              backgroundColor: '#00BFFF',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              marginTop: 20,
            }}
            onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>See Record</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TimeModal
        data={attendanceListData}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default Home;
