import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Loader from '../../../common/Loader';
import profilePic from '../../../images/Profile.png';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const darkTheme = {
  colors: {
    primary: '#00BFFF',        // light blue accent
    background: '#000000',     // pure black bg
    cardBackground: '#121212', // dark gray cards
    textPrimary: '#ffffff',    // white text
    textSecondary: '#aaaaaa',  // light gray text
    white: '#ffffff',
    error: '#ff5555',          // bright red for errors
  },
  spacing: {
    small: 10,
    medium: 20,
    large: 30,
  },
  borderRadius: 10,
};

const Settings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [address, setAddress] = useState('');

  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    let tries = 0;
    let data = null;
    while (tries < 3 && !data) {
      const stored = await AsyncStorage.getItem('USERDATA');
      if (stored) {
        data = JSON.parse(stored);
        setUserData(data);
      } else {
        tries++;
        await new Promise(res => setTimeout(res, 300));
      }
    }
    if (!data) console.warn('USERDATA still null after retry');
  };

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
      setPassword(userData.password || '');
      setBusinessType(userData.businessType || '');
      setContactInfo(userData.contactInfo || '');
      setAddress(userData.address || '');
    }
  }, [userData]);

  const handleLogout = () => {
    AsyncStorage.clear();
    navigation.navigate('Option');
  };

  return (
    <View style={{flex: 1, backgroundColor: darkTheme.colors.background}}>
      {/* Header */}
      <View
        style={{
          width: '100%',
          height: 60,
          elevation: 4,
          backgroundColor: darkTheme.colors.primary,
          justifyContent: 'center',
          paddingLeft: darkTheme.spacing.medium,
        }}>
        <Text
          style={{
            color: darkTheme.colors.white,
            fontWeight: '700',
            fontSize: 16,
          }}>
          Settings
        </Text>
      </View>

      <ScrollView style={{width: '90%'}}>
        <Image
          source={profilePic}
          style={{
            height: 100,
            width: 100,
            marginLeft: '38%',
            marginTop: darkTheme.spacing.large,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: darkTheme.colors.primary,
          }}
        />
        <View style={{marginLeft: 30}}>
          <TextInput
            placeholder="Business Name"
            placeholderTextColor={darkTheme.colors.textSecondary}
            value={name}
            onChangeText={setName}
            style={{
              ...styles.input,
              borderColor: darkTheme.colors.textSecondary,
              color: darkTheme.colors.textPrimary,
            }}
          />
          <TextInput
            placeholder="Business Type"
            placeholderTextColor={darkTheme.colors.textSecondary}
            value={businessType}
            onChangeText={setBusinessType}
            style={{
              ...styles.input,
              borderColor: darkTheme.colors.textSecondary,
              color: darkTheme.colors.textPrimary,
            }}
          />
          <TextInput
            placeholder="Contact Info"
            placeholderTextColor={darkTheme.colors.textSecondary}
            value={contactInfo}
            onChangeText={setContactInfo}
            style={{
              ...styles.input,
              borderColor: darkTheme.colors.textSecondary,
              color: darkTheme.colors.textPrimary,
            }}
          />
          <TextInput
            placeholder="Address Location"
            placeholderTextColor={darkTheme.colors.textSecondary}
            value={address}
            onChangeText={setAddress}
            style={{
              ...styles.input,
              borderColor: darkTheme.colors.textSecondary,
              color: darkTheme.colors.textPrimary,
            }}
            multiline
            numberOfLines={3}
          />
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor={darkTheme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            style={{
              ...styles.input,
              borderColor: darkTheme.colors.textSecondary,
              color: darkTheme.colors.textPrimary,
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {/* Password field, optional to keep */}
          <TextInput
            placeholder="Enter Password"
            placeholderTextColor={darkTheme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            style={{
              ...styles.input,
              borderColor: darkTheme.colors.textSecondary,
              color: darkTheme.colors.textPrimary,
            }}
            secureTextEntry
          />

          <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: darkTheme.colors.primary,
              borderRadius: darkTheme.borderRadius,
              marginTop: darkTheme.spacing.large,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleLogout}>
            <Text style={{color: darkTheme.colors.white, fontSize: 20}}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

const styles = {
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderRadius: 10,
    paddingLeft: 20,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
};

export default Settings;
