import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Text, Input, Button } from 'react-native-elements';
import {
  MaterialCommunityIcons, FontAwesome5, AntDesign, Entypo,
} from '@expo/vector-icons';
import { addError } from '../reducers/Auth';
import { signin } from '../actions/Auth';
import Spacer from '../components/Spacer';
import Banner from '../components/banner';
import Loader from '../components/loader';

const emailRef = React.createRef();
const passRef = React.createRef();

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePass, setSecurePass] = useState(true);
  const [emailErr, setEmailErr] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useSelector(state => state.auth.value);
  const palettes = useSelector(state => state.palette.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);
  const dispatch = useDispatch();
  const emailValidator = () => {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailErr('Invalid email');
      emailRef.current.shake();
      return true;
    }
    setEmailErr('');
    return false;
  };

  const signinCTA = () => {
    if (emailValidator()) {
      emailValidator();
    } else {
      setLoading(true);
      dispatch(signin({ email, password }, val => setLoading(val)));
    }
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      dispatch(addError(''));
      setEmail('');
      setPassword('');
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
    <View style={styles.inputContainer}>
      <Input
      ref={emailRef}
      label='Email'
      value={email}
      onChangeText={val => setEmail(val.replaceAll(' ', ''))}
      onBlur={emailValidator}
      errorMessage={emailErr}
      labelStyle={styles.label}
      inputStyle={styles.inputTextSytle}
      placeholderTextColor={palettes.palette.text}
      inputContainerStyle={{ borderColor: palettes.palette.text }}
      autoCapitalize='none'
      autoCorrect={false}
      leftIcon={
        <FontAwesome5 name="user" size={18} color={palettes.palette.text} />
      } />
    </View>
    <View style={styles.inputContainer}>
      <Input
      ref={passRef}
      label='Password'
      value={password}
      onChangeText={val => setPassword(val.replaceAll(' ', ''))}
      labelStyle={styles.label}
      inputStyle={styles.inputTextSytle}
      placeholderTextColor={palettes.palette.text}
      inputContainerStyle={{ borderColor: palettes.palette.text }}
      secureTextEntry={securePass}
      autoCapitalize='none'
      autoCorrect={false}
      leftIcon={
        <MaterialCommunityIcons name="form-textbox-password" size={18} color={palettes.palette.text} />
      }
      rightIcon={
        securePass
          ? <TouchableOpacity onPress={() => setSecurePass(!securePass)}>
          <Entypo name="eye-with-line" size={18} color={palettes.palette.text} />
          </TouchableOpacity>
          : <TouchableOpacity onPress={() => setSecurePass(!securePass)}>
          <AntDesign name="eye" size={18} color={palettes.palette.text} />
          </TouchableOpacity>
      }
    />
    </View>
    { auth.errorMessage ? <Spacer>
      <Banner message={auth.errorMessage} type='error'></Banner>
      </Spacer> : null
    }
    <Spacer>
      <View style={styles.signupButtonContainer}>
        <Button
          title='Sign In'
          buttonStyle={styles.signupButton}
          titleStyle={styles.signupButtonText}
          loading={loading}
          onPress={() => signinCTA()}
        />
      </View>
    </Spacer>
    </KeyboardAvoidingView>
      <TouchableOpacity style={styles.signinText} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signin}>Don't have an account?  </Text>
        <Text style={{ ...styles.signin, textDecorationLine: 'underline' }}>Sign up here</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Passwordreset')}>
        <Text style={styles.reset}>Forgot password? Reset it here</Text>
      </TouchableOpacity>
    <Spacer />
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
    marginTop: 20,
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

export default SignInScreen;
