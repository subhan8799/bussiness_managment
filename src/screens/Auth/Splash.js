import {View, Text, ImageBackground, Image} from 'react-native';
import React, {useEffect} from 'react';
import Logo from '../../images/Logo.png'; // Make sure this is a valid image path
import AsyncStorage from '@react-native-async-storage/async-storage';


const Splash = ({navigation}) => {
  useEffect(() => {
    checkAuth()
  }, []);

  const checkAuth = async () => {
    const authState = await AsyncStorage.getItem('USERID');
    const appState = await AsyncStorage.getItem('AppType');
    setTimeout(() => {
      if(authState) {
        if(appState == 'Business'){
          navigation.navigate('Business', {
            screen: 'BusinessMain'
          });
        } else if(appState == 'Patient') {
          navigation.navigate('Patient', {
            screen: 'PatientMain'
          });
        }
      } else {
        navigation.navigate('Option');
      }
    }, 3000);
  }

  return (
    <View
    style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000'}}
    >
    <View style={{width: '90%'}}>
    <Image
          source={Logo}
          style={{
            height: 150,
            width: 150,
            alignSelf: 'center',
            resizeMode: 'contain',
          }}
        />
              <Text
        style={{
          alignSelf: 'center',
          marginTop: 0,
          fontSize: 22,
          fontWeight: 'bold',
          color: 'white',
        }}
        onPress={() => navigation.navigate('Signup')}>
          
        Management
      </Text>
    </View>
  </View>
  );
};

export default Splash;
