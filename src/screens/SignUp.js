import React, { useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Text, Input, Button } from 'react-native-elements';
import {
  addError, setEmail, setPassword, setConfirm, changeStage,
} from '../reducers/Auth';
import Spacer from '../components/Spacer';
import Loader from '../components/loader';
import Credentials from '../components/credentials';
import UserDetails from '../components/userDetails';
import StoreDetails from '../components/storeDetails';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth.value);
  const palettes = useSelector(state => state.palette.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.addListener('focus', () => {
      dispatch(addError(''));
      dispatch(setEmail(''));
      dispatch(setPassword(''));
      dispatch(setConfirm(''));
      dispatch(changeStage(0));
    });
  }, []);

  return <View style={styles.container}>
    <Spacer />
      <KeyboardAvoidingView
        style={styles.inputCont}
        keyboardVerticalOffset={-100}
        behavior={'position'}
      >
      <View>
        <Loader loading={true} screen={false} message='' centre={false} />
        <View style={styles.trailsLogoCont}>
          <Text style={styles.trailsLogoText}>SPARES</Text>
          <Text style={styles.trailsLogoMD}>MD</Text>
        </View>
      </View>
      {
        auth.signupStage === 0 ? <Credentials /> : null
      }
      {
        auth.signupStage === 1 ? <UserDetails /> : null
      }
      {
        auth.signupStage === 2 ? <StoreDetails /> : null
      }
      </KeyboardAvoidingView>
      <Spacer>
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Text style={styles.signin}>Sign in instead?</Text>
        </TouchableOpacity>
      </Spacer>
    </View>;
};

const paletteStyles = (palette, fontsLoaded) => StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  trailsLogo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: -50,
  },
  label: {
    color: palette.text,
    fontSize: 14,
  },
  inputContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  inputCont: {
    backgroundColor: palette.background,
  },
  inputTextSytle: {
    marginLeft: 10,
  },
  signin: {
    textAlign: 'center',
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  signinText: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  reset: {
    textAlign: 'center',
    color: palette.metricsBottom,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
  },
  signupButton: {
    backgroundColor: palette.text,
    borderRadius: 10,
    width: '100%',
    fontSize: 14,
  },
  guestButton: {
    backgroundColor: palette.metricsBottom,
    borderRadius: 10,
    width: '100%',
    fontSize: 14,
  },
  signupButtonContainer: {
    width: '60%',
    alignSelf: 'center',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  trailsLogoCont: {
    fontFamily: fontsLoaded ? 'manuscript-font' : '',
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'center',
    marginTop: -30,
  },
  trailsLogoText: {
    fontFamily: fontsLoaded ? 'manuscript-font' : '',
    fontSize: 80,
    color: palette.text,
  },
  trailsLogoMD: {
    fontFamily: fontsLoaded ? 'manuscript-font' : '',
    fontSize: 18,
    marginTop: 6,
    marginLeft: 2,
    letterSpacing: 1,
    color: palette.text,
  },
  trailsLogoBG: {
    position: 'absolute',
    top: -46,
    left: -19,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});

export default SignUpScreen;
