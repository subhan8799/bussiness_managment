import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const EditPayroll = ({ route, navigation }) => {
  const payrollId = route?.params?.payrollId ?? null;

  const [name, setName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [month, setMonth] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [bonus, setBonus] = useState('');
  const [deductions, setDeductions] = useState('');
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (payrollId) {
      firestore().collection('payroll').doc(payrollId).get().then(doc => {
        if (doc.exists) {
          const data = doc.data();
          setName(data.name);
          setStaffId(data.staffId);
          setMonth(data.month);
          setBaseSalary(String(data.baseSalary));
          setBonus(String(data.bonus));
          setDeductions(String(data.deductions));
          setPaid(data.paid);
        }
      });
    }
  }, [payrollId]);

  const handleSave = async () => {
    const salary = parseFloat(baseSalary) || 0;
    const extra = parseFloat(bonus) || 0;
    const minus = parseFloat(deductions) || 0;
    const net = salary + extra - minus;

    const data = {
      staffId,
      name,
      month,
      baseSalary: salary,
      bonus: extra,
      deductions: minus,
      netPay: net,
      paid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    try {
      if (payrollId) {
        await firestore().collection('payroll').doc(payrollId).update(data);
      } else {
        await firestore().collection('payroll').add(data);
      }
      Alert.alert('Success', 'Payroll saved successfully');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save payroll');
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
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
          {payrollId ? 'Edit Payroll' : 'New Payroll'}
        </Text>
      </View>

      <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Staff Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Staff ID"
          placeholderTextColor="#aaa"
          value={staffId}
          onChangeText={setStaffId}
          style={styles.input}
        />
        <TextInput
          placeholder="Month (YYYY-MM)"
          placeholderTextColor="#aaa"
          value={month}
          onChangeText={setMonth}
          style={styles.input}
        />
        <TextInput
          placeholder="Base Salary"
          placeholderTextColor="#aaa"
          value={baseSalary}
          onChangeText={setBaseSalary}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Bonus"
          placeholderTextColor="#aaa"
          value={bonus}
          onChangeText={setBonus}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Deductions"
          placeholderTextColor="#aaa"
          value={deductions}
          onChangeText={setDeductions}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setPaid(!paid)} style={styles.statusBtn}>
          <Text style={{ color: '#fff' }}>{paid ? 'Mark as Unpaid' : 'Mark as Paid'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save Payroll</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    color: '#fff',
    marginBottom: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
  statusBtn: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00BFFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
};

export default EditPayroll;
