import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView,
} from 'react-native';
import {
  MaterialCommunityIcons, FontAwesome5, AntDesign, Entypo,
} from '@expo/vector-icons';
import { Text, Input, Button } from 'react-native-elements';
import {
  setEmail, setPassword,
  setSecurePass, setConfirm,
  setSecureConfirm, setEmailErr, setPassErr,
  changeStage,
} from '../reducers/Auth';
import Spacer from './Spacer';
import Banner from './banner';

const emailRef = React.createRef();
const passRef = React.createRef();

const Credentials = () => {
  const auth = useSelector(state => state.auth.value);
  const palettes = useSelector(state => state.palette.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);
  const dispatch = useDispatch();

  const emailValidator = () => {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(auth.email)) {
      dispatch(setEmailErr('Invalid email'));
      emailRef.current.shake();
      return true;
    }
    dispatch(setEmailErr(''));
    return false;
  };

  const passwordValidator = () => {
    if (auth.password !== auth.confirm) {
      dispatch(setPassErr('This password doesnt match the one above'));
      passRef.current.shake();
      return true;
    }
    dispatch(setPassErr(''));
    return false;
  };
  const proceed = () => {
    if (emailValidator() || passwordValidator()) {
      emailValidator();
      passwordValidator();
    } else {
      dispatch(changeStage(1));
    }
  };

  return <View style={styles.spacer}>
      <View style={styles.inputContainer}>
        <Input
        ref={emailRef}
        label='Email'
        value={auth.email}
        onChangeText={val => dispatch(setEmail(val.replaceAll(' ', '')))}
        onBlur={emailValidator}
        errorMessage={auth.emailErr}
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
        value={auth.password}
        onChangeText={val => dispatch(setPassword(val.replaceAll(' ', '')))}
        labelStyle={styles.label}
        inputStyle={styles.inputTextSytle}
        placeholderTextColor={palettes.palette.text}
        inputContainerStyle={{ borderColor: palettes.palette.text }}
        secureTextEntry={auth.securePass}
        autoCapitalize='none'
        autoCorrect={false}
        leftIcon={
          <MaterialCommunityIcons name="form-textbox-password" size={18} color={palettes.palette.text} />
        }
        rightIcon={
          auth.securePass
            ? <TouchableOpacity onPress={() => dispatch(setSecurePass(!auth.securePass))}>
            <Entypo name="eye-with-line" size={18} color={palettes.palette.text} />
            </TouchableOpacity>
            : <TouchableOpacity onPress={() => dispatch(setSecurePass(!auth.securePass))}>
            <AntDesign name="eye" size={18} color={palettes.palette.text} />
            </TouchableOpacity>
        }
      />
      </View>
      <View style={styles.inputContainer}>
        <Input
        ref={passRef}
        label='Confirm password'
        value={auth.confirm}
        onChangeText={val => dispatch(setConfirm(val.replaceAll(' ', '')))}
        onBlur={passwordValidator}
        errorMessage={auth.passErr}
        labelStyle={styles.label}
        inputStyle={styles.inputTextSytle}
        placeholderTextColor={palettes.palette.text}
        inputContainerStyle={{ borderColor: palettes.palette.text }}
        secureTextEntry={auth.secureConfirm}
        autoCapitalize='none'
        autoCorrect={false}
        leftIcon={
          <MaterialCommunityIcons name="form-textbox-password" size={18} color={palettes.palette.text} />
        }
        rightIcon={
          auth.secureConfirm
            ? <TouchableOpacity onPress={() => dispatch(setSecureConfirm(!auth.secureConfirm))}>
              <Entypo name="eye-with-line" size={18} color={palettes.palette.text} />
              </TouchableOpacity>
            : <TouchableOpacity onPress={() => dispatch(setSecureConfirm(!auth.secureConfirm))}>
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
            title='Proceeed'
            buttonStyle={styles.signupButton}
            titleStyle={styles.signupButtonText}
            loading={auth.loading}
            onPress={() => proceed()}
          />
        </View>
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

export default Credentials;
