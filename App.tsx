import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth, db, collection, addDoc } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithCredential, User } from 'firebase/auth';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin'; // Added isSuccessResponse
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('Logged in successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        email: email,
        createdAt: new Date().toISOString(),
      });
      setError('Account created successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '960491714548-sooev7omd8s6tsemuecjccol8bj49aqc.apps.googleusercontent.com', // From Firebase Console
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const userInfo = response.data;
        const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
        await signInWithCredential(auth, googleCredential);
        setError('Logged in with Google successfully!');
      } else {
        setError('Google Sign-In was cancelled or failed');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/MeshGridBackground.jpg')} // Adjusted path for local assets
      style={styles.background}
    >
      <Surface style={styles.surface}>
        <Text style={styles.title}>JaspireV4</Text>
        <Text style={styles.subtitle}>Unlock your potential</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Login
        </Button>
        <Button
          mode="contained"
          onPress={handleSignup}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Sign Up
        </Button>
        <Button
          mode="contained"
          onPress={handleGoogleSignIn}
          style={styles.button}
          labelStyle={styles.buttonText}
          icon="google"
        >
          Continue with Google
        </Button>
        {error && <Text style={styles.error}>{error}</Text>}
      </Surface>
    </ImageBackground>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: '80%',
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
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