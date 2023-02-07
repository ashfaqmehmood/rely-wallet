import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Switch } from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/Hooks';
import { changeTheme, setDefaultTheme } from '@/Store/Theme';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { resetState, setBiometrics } from '@/Store/web3';
import { useSelector } from 'react-redux';
import { persistor, RootState } from '@/Store';
import { AlertHelper } from '@/Utils/alertHelper';

const StartupContainer = () => {
  const { Layout, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const initialized = useSelector((state: RootState) => state.wallet.initialized);
  const onboarding = useSelector((state: RootState) => state.wallet.onboarding);
  const biometrics = useSelector((state: RootState) => state.wallet.biometrics);
  const _password = useSelector((state: RootState) => state.wallet.password);

  const [biometricsEnabled, setBiometricsEnabled] = React.useState(biometrics);
  const [biometricsAvailable, setBiometricsAvailable] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(true);
  const [password, setPassword] = React.useState('12345678');
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // clear();
    // dispatch(setActiveWallet(0))
    setDefaultTheme({ theme: 'default', darkMode: false });
    dispatch(changeTheme({ theme: 'default', darkMode: false }));

    if (!onboarding) {
      setDefaultTheme({ theme: 'default', darkMode: false });
      dispatch(changeTheme({ theme: 'default', darkMode: false }));
      // @ts-ignore
      navigation.navigate('Onboarding' as never);
      return;
    }
    if (!initialized) {
      setDefaultTheme({ theme: 'default', darkMode: false });
      dispatch(changeTheme({ theme: 'default', darkMode: false }));
      // @ts-ignore
      navigation.navigate('Welcome' as never);
      return;
    }
    FingerprintScanner.isSensorAvailable()
      .then(isAvailable => {
        console.log('isAvailable' + isAvailable);
        if (isAvailable === 'Biometrics' || isAvailable === 'Touch ID' || isAvailable === 'Face ID') {
          setBiometricsAvailable(true);
        }
      })
      .catch(err => {
        console.log('FingerprintScanner.isSensorAvailable error');
        console.log(err);
        setBiometricsAvailable(false);
      });
  }, [dispatch, initialized, navigation, onboarding]);

  const signInWithBiometrics = () => {
    setLoading(true);
    FingerprintScanner.authenticate({
      title: 'Authenticate to access your wallet',
      // subTitle: 'Use your fingerprint to access your wallet',
      description: 'Use your fingerprint to access your wallet',
      fallbackEnabled: true,
      cancelButton: 'Cancel',
      onAttempt: e => {
        console.log('onAttempt');
        console.log(e);
      },
    })
      .then(e => {
        console.log('FingerprintScanner.authenticate success');
        console.log(e);
        setLoading(false);
        // navigateAndSimpleReset('Tabs');
        navigation.navigate('Tabs' as never);
      })
      .catch(err => {
        console.log('FingerprintScanner.authenticate error');
        console.log(err);
        setLoading(false);
      });
  };

  const signInWithPassword = () => {
    console.log('signInWithPassword');
    console.log(password);
    console.log(_password);
    if (password.length === 0) {
      AlertHelper.show('error', 'Error', 'Please enter your password');
      return;
    }
    if (password === _password) {
      // navigateAndSimpleReset('Tabs');
      navigation.navigate('Tabs' as never);
    } else {
      AlertHelper.show('error', 'Error', 'Wrong password!');
    }
  };

  const resetWallet = () => {
    // TODO: Ask are you sure?
    Alert.alert('Reset Wallet', 'Are you sure you want to reset your wallet? This will delete all your wallets on this device. We cannot recover your wallet if you reset it.', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Reset',
        onPress: async () => {
          await persistor.flush();
          await persistor.purge();
          dispatch(resetState());
          navigation.navigate('Onboarding' as never);
          // React native restart
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={Layout.fill}>
      <SafeAreaView style={[Layout.fill, Layout.colCenter, { backgroundColor: colors.ui_background }]}>
        <Image style={styles.lock} source={require('@/Assets/Images/ethereum-locker.png')} />
        <View style={[Layout.row, Layout.justifyContentCenter, Layout.alignItemsCenter]}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.text_02}
            style={[
              styles.input,
              {
                borderColor: colors.border_01,
                backgroundColor: colors.ui_01,
                color: colors.text_01,
              },
            ]}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={passwordVisible}
          />
          {biometricsAvailable && biometricsEnabled ? (
            <TouchableOpacity onPress={() => signInWithBiometrics()} style={styles.inputButton}>
              <Ionicons name="md-finger-print" size={24} color={colors.text_01} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.inputButton}>
              <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color={colors.text_01} />
            </TouchableOpacity>
          )}
        </View>
        {biometricsAvailable && (
          <View style={[Layout.row, styles.biometricsContainer]}>
            <Text style={[styles.biometricsText, { color: colors.text_01 }]}>Unlock with Biomertics?</Text>
            <Switch
              value={biometricsEnabled}
              onValueChange={(value: any) => {
                setBiometricsEnabled(value);
                dispatch(setBiometrics(value));
              }}
            />
          </View>
        )}
        <TouchableOpacity onPress={() => signInWithPassword()} style={[styles.submitButton, { backgroundColor: colors.ui_01 }]}>
          {loading ? <ActivityIndicator size="small" color={colors.text_01} /> : <Text style={[styles.buttonText, { color: colors.text_01 }]}>Unlock Wallet</Text>}
        </TouchableOpacity>
        <Text style={[styles.forgetText, { color: colors.text_01 }]}>Forgot Password? You can REMOVE your current wallet and create a new one.</Text>
        <TouchableOpacity onPress={() => resetWallet()}>
          <Text style={[styles.resetWallet, { color: colors.text_04 }]}>Reset Wallet</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    width: '88%',
    borderRadius: 10,
    paddingLeft: 12,
    paddingRight: '15%',
    fontSize: 16,
  },
  lock: {
    width: 180,
    height: 180,
    marginBottom: 36,
  },
  inputButton: {
    position: 'absolute',
    right: '10%',
  },
  biometricsContainer: {
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: '8%',
    alignItems: 'center',
    marginTop: 10,
  },
  biometricsText: {
    textAlignVertical: 'center',
  },
  submitButton: {
    width: '80%',
    height: 50,
    marginTop: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 16,
  },
  forgetText: {
    textAlign: 'center',
    paddingHorizontal: 60,
    marginVertical: 30,
  },
  resetWallet: {
    fontWeight: '500',
    fontSize: 16,
  },
});

export default StartupContainer;
