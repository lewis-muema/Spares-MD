import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Ionicons, FontAwesome5, MaterialIcons, Feather, AntDesign,
} from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { navigationRef } from './src/RootNavigation';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import PasswordReset from './src/screens/PasswordReset';
import Products from './src/screens/Products';
import Orders from './src/screens/Orders';
import Account from './src/screens/Account';
import { Provider as PaletteProvider, Context as PaletteContext } from './src/context/paletteContext';


const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();

function Home() {
  const { state: { palette } } = useContext(PaletteContext);
  return (
    <Bottom.Navigator initialRouteName="Products" screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: palette.background,
      tabBarInactiveTintColor: palette.buttonsInactive,
      tabBarStyle: {
        backgroundColor: palette.text,
        borderTopWidth: 0,
        justifyContent: 'center',
        height: Platform.OS === 'ios' ? 70 : 60,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
      },
    }}>
      <Bottom.Screen name="Products" component={Products} options={{
        title: 'Products',
        tabBarIcon: ({ color, size }) => (
          <Feather name="box" color={color} size={size} />
        ),
      }} />
      <Bottom.Screen name="Orders" component={Orders} options={{
        title: 'Orders',
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="shoppingcart" color={color} size={size} />
        ),
      }} />
      <Bottom.Screen name="Account" component={Account} options={{
        title: 'Account',
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="user" color={color} size={size} />
        ),
      }} />
    </Bottom.Navigator>
  );
}

function Auth() {
  return (
    <Stack.Navigator initialRouteName="Signin" screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="Signin" component={SignIn} options={{ title: 'Sign in' }} />
      <Stack.Screen name="Signup" component={SignUp} options={{ title: 'Sign up' }} />
      <Stack.Screen name="Passwordreset" component={PasswordReset} options={{ title: 'Password reset' }} />
    </Stack.Navigator>
  );
}

function App() {
  const { changeBG, changeTheme, fontsLoadedStatus } = useContext(PaletteContext);
  const loadTheme = async () => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
    try {
      const theme = await AsyncStorage.getItem('theme');
      const bg = await AsyncStorage.getItem('bg');
      if (theme !== null) {
        changeTheme(JSON.parse(theme));
      }
      if (bg !== null) {
        changeBG(JSON.parse(bg));
      }
    } catch (e) {
      // error reading value
    } finally {
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return <PaletteProvider>
    <App />
  </PaletteProvider>;
};
