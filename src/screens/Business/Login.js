import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Loader from '../../common/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bgImage from '../../images/background.png';

const BusinessLogin = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const checkLogin = () => {
    setModalVisible(true);
    firestore()
      .collection('employees')
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        setModalVisible(false);
        if (querySnapshot.empty) {
          alert('No user found');
          return;
        }
        const userData = querySnapshot.docs[0].data();
        if (password === userData.password) {
          goToNextScreen(userData);
        } else {
          alert('Wrong Password');
        }
      })
      .catch(error => {
        setModalVisible(false);
        alert('Login failed');
        console.error(error);
      });
  };

  const goToNextScreen = async data => {
    try {
      await AsyncStorage.setItem('USERDATA', JSON.stringify(data));
      await AsyncStorage.setItem('EMAIL', email);
      await AsyncStorage.setItem('USERID', data.userId);
      const check = await AsyncStorage.getItem('USERDATA');
      if (check !== null) {
        navigation.navigate('BusinessMain');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error saving to AsyncStorage:', err);
    }
  };

  return (
    <View
      style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000'}}
      >
      <View style={{width: '90%'}}>
        <Text
          style={{
            alignSelf: 'flex-start',
            marginBottom: '30%',
            fontSize: 38,
            fontWeight: '600',
            color: '#4FC3F7',
          }}
          onPress={() => navigation.navigate('Signup')}>
          Login
        </Text>
        <TextInput
          placeholder="Enter Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          style={{
            height: 50,
            borderBottomWidth: 1,
            borderRadius: 10,
            paddingLeft: 20,
            marginTop: 20,
            borderColor: '#4FC3F7',
            backgroundColor: 'transparent',
            color: '#fff',
          }}
        />
        <TextInput
          placeholder="Enter Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            height: 50,
            borderBottomWidth: 1,
            borderRadius: 10,
            paddingLeft: 20,
            marginTop: 20,
            borderColor: '#4FC3F7',
            backgroundColor: 'transparent',
            color: '#fff',
          }}
        />
        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: '#4FC3F7',
            borderRadius: 10,
            marginTop: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (email && password) {
              checkLogin();
            } else {
              alert('Please Enter Data');
            }
          }}>
          <Text style={{color: '#000', fontSize: 20}}>Login</Text>
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: 'center',
            marginTop: 30,
            textDecorationLine: 'underline',
            fontSize: 18,
            fontWeight: '600',
            color: '#4FC3F7',
          }}
          onPress={() => navigation.navigate('Business', {
            screen: 'BusinessSignup'
          })}>
          Create New Account
        </Text>
      </View>
      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

export default BusinessLogin;
