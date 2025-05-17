import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import bgImage from '../../images/background.png'; // Ensure the image path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';

const Option = ({navigation}) => {
  return (
    <View
      style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000'}}
      >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '90%',
          gap: 20,
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 150,
            backgroundColor: '#28a745',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            marginRight: 20,
          }}
          onPress={() => {navigation.navigate('Patient', {
            screen: 'PatientLogin'
          }); AsyncStorage.setItem('AppType', 'Patient');}}>
          <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 5}}>
            Hospital Management System
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            height: 150,
            backgroundColor: '#00BFFF',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={() => {navigation.navigate('Business', {
            screen: 'BusinessLogin'
          }); AsyncStorage.setItem('AppType', 'Business');}}>
          <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
            Business Management System
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Option;
