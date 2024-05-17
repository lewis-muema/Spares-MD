import React, { useContext, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Ionicons, FontAwesome5, MaterialIcons, Feather, AntDesign,
} from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReactReduxProvider, useSelector, useDispatch } from 'react-redux';
import { navigationRef } from './src/RootNavigation';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import PasswordReset from './src/screens/PasswordReset';
import Products from './src/screens/Products';
import AddProduct from './src/screens/addProduct';
import ViewProduct from './src/screens/viewProduct';
import Orders from './src/screens/Orders';
import Account from './src/screens/Account';
import userReducer from './src/reducers/Users';
import authReducer from './src/reducers/Auth';
import configReducer from './src/reducers/Config';
import productReducer from './src/reducers/Product';
import cartReducer from './src/reducers/Cart';
import paletteReducer, { changeBG, changeTheme, fontsLoadedStatus } from './src/reducers/Palette';


const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    palette: paletteReducer,
    config: configReducer,
    product: productReducer,
    cart: cartReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    immutableCheck: { warnAfter: 128 },
    serializableCheck: { warnAfter: 128 },
  }),
});

function Logo() {
  return (
    <Image
      style={{
        width: 250,
        height: 80,
        resizeMode: 'cover',
        marginVertical: 10,
      }}
      source={require('./assets/logo.png')} />
  );
}

function Product() {
  const palettes = useSelector(state => state.palette.value);
  return (
    <Stack.Navigator initialRouteName="Products" screenOptions={{
      headerShown: false,
      headerStyle: {
        backgroundColor: palettes.palette.background,
        height: 80,
      },
      tabBarActiveTintColor: palettes.palette.background,
      tabBarInactiveTintColor: palettes.palette.buttonsInactive,
      tabBarStyle: {
        backgroundColor: palettes.palette.text,
        borderTopWidth: 0,
        justifyContent: 'center',
        height: Platform.OS === 'ios' ? 70 : 60,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
      },
    }}>
      <Stack.Screen name="Products" component={Products} options={{
        title: 'Products',
        headerTitle: () => <Logo />,
        headerShadowVisible: false,
        headerShown: true,
        headerBackVisible: false,
      }} />
      <Stack.Screen name="AddProduct" component={AddProduct} options={{
        title: 'Add a product',
        headerTitle: () => <Logo />,
        headerShadowVisible: false,
        headerShown: true,
        headerBackVisible: false,
      }} />
      <Stack.Screen name="ViewProduct" component={ViewProduct} options={{ title: 'View product' }} />
    </Stack.Navigator>
  );
}

function Home() {
  const palettes = useSelector(state => state.palette.value);
  return (
    <Bottom.Navigator initialRouteName="Product" screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: palettes.palette.background,
        height: 80,
      },
      tabBarActiveTintColor: palettes.palette.background,
      tabBarInactiveTintColor: palettes.palette.buttonsInactive,
      tabBarStyle: {
        backgroundColor: palettes.palette.text,
        borderTopWidth: 0,
        justifyContent: 'center',
        height: Platform.OS === 'ios' ? 70 : 60,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
      },
    }}>
      <Bottom.Screen name="Product" component={Product} options={{
        title: 'Products',
        tabBarIcon: ({ color, size }) => (
          <Feather name="box" color={color} size={size} />
        ),
        headerShown: false,
      }} />
      <Bottom.Screen name="Orders" component={Orders} options={{
        title: 'Orders',
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="shoppingcart" color={color} size={size} />
        ),
        headerTitle: () => <Logo />,
        headerShadowVisible: false,
      }} />
      <Bottom.Screen name="Account" component={Account} options={{
        title: 'Account',
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="user" color={color} size={size} />
        ),
        headerTitle: () => <Logo />,
        headerShadowVisible: false,
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
  const dispatch = useDispatch();
  const palettes = useSelector(state => state.palette.value);
  const loadTheme = async () => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
    try {
      const theme = await AsyncStorage.getItem('theme');
      const bg = await AsyncStorage.getItem('bg');
      if (theme !== null) {
        dispatch(changeTheme(JSON.parse(theme)));
      }
      if (bg !== null) {
        dispatch(changeBG(JSON.parse(bg)));
      }
      await Font.loadAsync({
        'manuscript-font': require('./assets/fonts/Manuscript.ttf'),
      });
      dispatch(fontsLoadedStatus(true));
    } catch (e) {
      // error reading value
    } finally {
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: palettes.palette.background,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={MyTheme}>
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
  return <ReactReduxProvider store={store}>
      <App />
  </ReactReduxProvider>;
};
