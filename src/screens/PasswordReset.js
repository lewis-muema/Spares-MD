import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView,
} from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import {
  MaterialCommunityIcons, FontAwesome5, AntDesign, Entypo,
} from '@expo/vector-icons';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {
  setEmail, setPassword, setLoading,
  setSecurePass, setConfirm, addError,
  setSecureConfirm, setEmailErr, setPassErr,
} from '../reducers/Auth';
import { validateToken, sendResetEmail } from '../actions/Auth';
import Spacer from '../components/Spacer';
import Banner from '../components/banner';
import Loader from '../components/loader';

const emailRef = React.createRef();
const passRef = React.createRef();

const PasswordResetScreen = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const [stage, setStage] = useState(1);
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

  const sendEmail = () => {
    if (emailValidator()) {
      emailValidator();
    } else {
      dispatch(setLoading(true));
      dispatch(sendResetEmail(auth, val => setStage(val)));
    }
  };

  const resetPassword = () => {
    if (passwordValidator()) {
      passwordValidator();
    } else {
      setStage(3);
    }
  };

  const validate = () => {
    if (value && value.length === 6) {
      dispatch(setLoading(true));
      dispatch(validateToken(
        { id: auth.userId, token: value, password: auth.password },
        val => setStage(val),
      ));
    } else {
      dispatch(addError('Please enter the correct token'));
    }
  };

  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    navigation.addListener('focus', () => {
      dispatch(addError(''));
      dispatch(setEmail(''));
      dispatch(setConfirm(''));
      dispatch(setPassword(''));
      setStage(1);
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
      { stage === 1 ? <View>
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
        { auth.errorMessage ? <Spacer>
          <Banner message={auth.errorMessage} type='error'></Banner>
          </Spacer> : null
        }
        <Spacer>
          <View style={styles.signupButtonContainer}>
            <Button
              title='Reset Password'
              buttonStyle={styles.signupButton}
              titleStyle={styles.signupButtonText}
              loading={auth.loading}
              onPress={() => sendEmail()}
            />
          </View>
        </Spacer>
      </View> : null }
      { stage === 2 ? <View>
        <View style={styles.inputContainer}>
          <Input
          ref={passRef}
          label='New password'
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
          label='Confirm new password'
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
              ? <TouchableOpacity onPress={() => setSecureConfirm(!auth.secureConfirm)}>
                <Entypo name="eye-with-line" size={18} color={palettes.palette.text} />
                </TouchableOpacity>
              : <TouchableOpacity onPress={() => setSecureConfirm(!auth.secureConfirm)}>
                <AntDesign name="eye" size={18} color={palettes.palette.text} />
                </TouchableOpacity>
          }
        />
        </View>
        { auth.errorMessage ? <Spacer>
          <Banner message={auth.errorMessage} type='error'></Banner>
          </Spacer> : null
        }
        { auth.successMessage ? <Spacer>
          <Banner message={auth.successMessage} type='success'></Banner>
          </Spacer> : null
        }
        <Spacer>
          <View style={styles.signupButtonContainer}>
            <Button
              title='Reset Password'
              buttonStyle={styles.signupButton}
              titleStyle={styles.signupButtonText}
              loading={auth.loading}
              onPress={() => resetPassword()}
            />
          </View>
        </Spacer>
      </View> : null }
      { stage === 3 ? <View>
        <View style={styles.inputContainer}>
        <Text style={styles.tokenTitle}>Token</Text>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={6}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor/> : null)}
            </Text>
          )}
        />
        </View>
        { auth.errorMessage ? <Spacer>
          <Banner message={auth.errorMessage} type='error'></Banner>
          </Spacer> : null
        }
        { auth.successMessage ? <Spacer>
          <Banner message={auth.successMessage} type='success'></Banner>
          </Spacer> : null
        }
        <Spacer>
          <View style={styles.signupButtonContainer}>
            <Button
              title='Reset Password'
              buttonStyle={styles.signupButton}
              titleStyle={styles.signupButtonText}
              loading={auth.loading}
              onPress={() => validate()}
            />
          </View>
        </Spacer>
      </View> : null }
      </KeyboardAvoidingView>
      <Spacer>
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Text style={styles.signin}>Go back to sign in</Text>
        </TouchableOpacity>
      </Spacer>
      <Spacer />
      <Spacer />
    </View>;
};

const paletteStyles = (palette, fontsLoaded) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
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
  inputTextSytle: {
    marginLeft: 10,
  },
  signin: {
    textAlign: 'center',
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: palette.text,
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
  codeFieldRoot: {
    marginTop: 20,
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  cell: {
    width: 50,
    height: 50,
    lineHeight: 45,
    fontSize: 24,
    borderWidth: 2,
    borderColor: palette.text,
    borderRadius: 5,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
  tokenTitle: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  trailsLogoCont: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    display: fontsLoaded ? 'grid' : 'none',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: -20,
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

export default PasswordResetScreen;
