import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View, StyleSheet,
} from 'react-native';
import {
  FontAwesome5,
} from '@expo/vector-icons';
import {
  Text, Input, Button, ButtonGroup,
} from 'react-native-elements';
import {
  setFirstName,
  setLastName,
  setUserType,
  setFirstNameErr,
  setLastNameErr,
  setLoading,
  changeStage,
} from '../reducers/Auth';
import { signup } from '../actions/Auth';
import Spacer from './Spacer';
import Banner from './banner';

const firstNameRef = React.createRef();
const lastNameRef = React.createRef();
const typeRef = React.createRef();

const UserDetails = () => {
  const auth = useSelector(state => state.auth.value);
  const palettes = useSelector(state => state.palette.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);
  const dispatch = useDispatch();

  const firstNameValidator = () => {
    if (!/^([a-zA-Z]{2,})$/.test(auth.firstName)) {
      dispatch(setFirstNameErr('Please enter a valid first name'));
      firstNameRef.current.shake();
      return true;
    }
    dispatch(setFirstNameErr(''));
    return false;
  };

  const lastNameValidator = () => {
    if (!/^([a-zA-Z]{2,})$/.test(auth.lastName)) {
      dispatch(setLastNameErr('Please enter a valid last name'));
      lastNameRef.current.shake();
      return true;
    }
    dispatch(setLastNameErr(''));
    return false;
  };

  const signupCTA = () => {
    if (firstNameValidator() || firstNameValidator()) {
      firstNameValidator();
      lastNameValidator();
    } else {
      dispatch(setLoading(true));
      dispatch(signup(auth));
      firstNameRef.current.blur();
      lastNameRef.current.blur();
    }
  };

  return <View style={styles.spacer}>
      <View style={styles.inputContainer}>
        <Input
        ref={firstNameRef}
        label='First name'
        value={auth.firstName}
        onChangeText={val => dispatch(setFirstName(val.replaceAll(' ', '')))}
        onBlur={firstNameValidator}
        errorMessage={auth.firstNameErr}
        labelStyle={styles.label}
        inputStyle={styles.inputTextSytle}
        placeholderTextColor={palettes.palette.text}
        inputContainerStyle={{ borderColor: palettes.palette.text }}
        autoCapitalize='words'
        autoCorrect={false}
        leftIcon={
          <FontAwesome5 name="user" size={18} color={palettes.palette.text} />
        } />
      </View>
      <View style={styles.inputContainer}>
        <Input
        ref={lastNameRef}
        label='Last name'
        value={auth.lastName}
        onChangeText={val => dispatch(setLastName(val.replaceAll(' ', '')))}
        onBlur={lastNameValidator}
        errorMessage={auth.lastNameErr}
        labelStyle={styles.label}
        inputStyle={styles.inputTextSytle}
        placeholderTextColor={palettes.palette.text}
        inputContainerStyle={{ borderColor: palettes.palette.text }}
        autoCapitalize='words'
        autoCorrect={false}
        leftIcon={
          <FontAwesome5 name="user" size={18} color={palettes.palette.text} />
        }
      />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.userTypeLabel}>I want to be a</Text>
      <ButtonGroup
        buttons={auth.userTypes}
        selectedIndex={auth.userType}
        onPress={(value) => {
          dispatch(setUserType(value));
        }}
        buttonStyle={{
          margin: 5,
          borderRadius: 5,
          borderWidth: 2,
          borderColor: palettes.palette.text,
        }}
        textStyle={{
          fontWeight: '700',
          fontSize: 16,
        }}
        selectedButtonStyle={{ backgroundColor: palettes.palette.text }}
        innerBorderStyle={{ width: 0 }}
        containerStyle={{
          borderWidth: 0,
          backgroundColor: palettes.palette.background,
          height: 50,
          marginBottom: 20,
        }}
      />
      </View>
      { auth.errorMessage ? <Spacer>
        <Banner message={auth.errorMessage} type='error'></Banner>
        </Spacer> : null
      }
      <Spacer>
        <View style={styles.signupButtonContainer}>
          <Button
            title='Sign Up'
            buttonStyle={styles.signupButton}
            titleStyle={styles.signupButtonText}
            loading={auth.loading}
            onPress={() => signupCTA()}
          />
        </View>
        <View style={styles.signupButtonContainer}>
          <Button
            title='Back'
            buttonStyle={styles.signupButtonInverse}
            titleStyle={styles.signupButtonTextInverse}
            onPress={() => dispatch(changeStage(0))}
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
  userTypeLabel: {
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 5,
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
  signupButtonInverse: {
    backgroundColor: palette.background,
    borderRadius: 10,
    width: '100%',
    fontSize: 14,
  },
  signupButtonTextInverse: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
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

export default UserDetails;
