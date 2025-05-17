import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Switch } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const lightTheme = {
  colors: {
    primary: '#5B2ED4',
    background: '#f0f0f0',
    cardBackground: '#fff',
    textPrimary: '#000',
    textSecondary: '#666',
    white: '#fff',
    error: 'red',
  },
  spacing: {
    small: 10,
    medium: 20,
    large: 30,
  },
  borderRadius: 10,
};

const darkTheme = {
  colors: {
    primary: '#00BFFF',
    background: '#000000',       // dark background
    cardBackground: '#121212',   // card bg dark gray
    textPrimary: '#ffffff',
    textSecondary: '#aaaaaa',
    white: '#fff',
    error: '#ff5555',
  },
  spacing: {
    small: 10,
    medium: 20,
    large: 30,
  },
  borderRadius: 10,
};

const PayrollList = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigation = useNavigation();

  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('payroll')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPayrolls(list);
      });

    return () => unsubscribe();
  }, []);

  const confirmDelete = (payrollId) => {
    Alert.alert('Delete Payroll', 'Are you sure you want to delete this payroll record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          firestore().collection('payroll').doc(payrollId).delete()
            .then(() => console.log('Deleted'))
            .catch(() => Alert.alert('Error', 'Failed to delete payroll'));
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EditPayroll', { payrollId: item.id })}
      style={{
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius,
        backgroundColor: theme.colors.cardBackground,
        marginBottom: theme.spacing.medium,
        marginHorizontal: theme.spacing.medium,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View>
        <Text style={{ fontWeight: 'bold', color: theme.colors.textPrimary }}>{item.name}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>Month: {item.month}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>Net Pay: ${item.netPay}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Status: {item.paid ? '✅ Paid' : '❌ Unpaid'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => confirmDelete(item.id)}>
        <Text style={{ color: theme.colors.error, fontSize: 18 }}>{'❌'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header with toggle switch */}
      <View
        style={{
          width: '100%',
          height: 60,
          elevation: 4,
          backgroundColor: theme.colors.primary,
          justifyContent: 'space-between',
          paddingLeft: theme.spacing.medium,
          paddingRight: theme.spacing.medium,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: theme.colors.white, fontWeight: '700', fontSize: 16 }}>
          Payroll Records
        </Text>
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.white, marginRight: 8 }}>
            {isDarkMode ? 'Dark' : 'Light'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            thumbColor={isDarkMode ? theme.colors.primary : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View> */}
      </View>

      <View style={{ margin: theme.spacing.medium }}>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: theme.spacing.small,
            paddingVertical: theme.spacing.small,
            borderRadius: theme.borderRadius,
          }}
          onPress={() => navigation.navigate('EditPayroll')} // no ID = create mode
        >
          <Text style={{ color: theme.colors.white, textAlign: 'center' }}>+ Add Payroll</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={payrolls}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
              marginTop: theme.spacing.large,
              color: theme.colors.textSecondary,
            }}
          >
            No payroll records
          </Text>
        }
      />
    </View>
  );
};

export default PayrollList;
