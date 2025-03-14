import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { auth, db, collection, query, where, getDocs, updateDoc, doc } from './firebase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userQuery = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(userQuery);
        querySnapshot.forEach((doc) => {
          if (doc.data().username) {
            setUsername(doc.data().username);
          }
        });
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      setError('Username cannot be empty!');
      return;
    }
    try {
      if (auth.currentUser) {
        const userQuery = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(userQuery);
        querySnapshot.forEach(async (document) => {
          await updateDoc(doc(db, 'users', document.id), {
            username: username,
          });
        });
        setError('Username updated successfully!');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleUpdateUsername}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Update Username
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Back to Home
      </Button>
      {error && <Text style={styles.error}>{error}</Text>}
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
  input: {
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#FFFFFF',
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
  error: {
    color: '#FF4444',
    marginTop: 10,
    textAlign: 'center',
  },
});