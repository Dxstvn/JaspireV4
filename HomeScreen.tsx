import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { auth, db, collection, query, where, getDocs } from './firebase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userQuery = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(userQuery);
        querySnapshot.forEach((doc) => {
          setUserEmail(doc.data().email);
        });
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userEmail || 'User'}!</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Profile')}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Go to Profile
      </Button>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#1DA1F2',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});