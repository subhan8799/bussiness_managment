import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Loader from '../../common/Loader';
import uuid from 'react-native-uuid';

const BusinessSignup = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [address, setAddress] = useState('');

  const saveDataOnFirestore = () => {
    let userId = uuid.v4();
    setModalVisible(true);
    firestore()
      .collection('employees')
      .doc(userId)
      .set({
        name,
        email,
        password,
        businessType,
        contactInfo,
        address,
        userId,
      })
      .then(() => {
        setModalVisible(false);
        navigation.goBack();
      })
      .catch(e => {
        console.log('User add error', e);
        setModalVisible(false);
      });
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#000'}}
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
      }}>
      <View style={{width: '90%'}}>
        <Text
          style={{
            alignSelf: 'flex-start',
            marginBottom: 30,
            fontSize: 38,
            fontWeight: '600',
            color: '#4FC3F7',
          }}>
          Register
        </Text>

        <TextInput
          placeholder="Business Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Business Type"
          placeholderTextColor="#aaa"
          value={businessType}
          onChangeText={setBusinessType}
          style={styles.input}
        />
        <TextInput
          placeholder="Contact Info"
          placeholderTextColor="#aaa"
          value={contactInfo}
          onChangeText={setContactInfo}
          style={styles.input}
        />
        <TextInput
          placeholder="Address Location"
          placeholderTextColor="#aaa"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (name && email && password) {
              saveDataOnFirestore();
            } else {
              alert('Please fill all required fields');
            }
          }}>
          <Text style={{color: '#000', fontSize: 20}}>Sign up</Text>
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
          onPress={() => navigation.goBack()}>
          Already have account
        </Text>
      </View>
      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </ScrollView>
  );
};

const styles = {
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderRadius: 10,
    paddingLeft: 20,
    marginTop: 20,
    borderColor: '#4FC3F7',
    backgroundColor: 'transparent',
    color: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#4FC3F7',
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default BusinessSignup;
