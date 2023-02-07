import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, ActivityIndicator, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as bip39 from 'bip39';

import { RootState } from '@/Store';
import { AlertHelper } from '@/Utils/alertHelper';
import { setActiveWallet, setMnemonic as _setMnemonic, createWallet, setPassword, setInitialised, setUniqueId } from '@/Store/web3';
import { getHDWallet, validateMnemonic, setDefaultAccount, importWallet } from '@/Utils/web3/web3';
import { useTheme } from '@/Hooks';
import { Switch } from 'react-native-ui-lib';
import { Connection, PublicKey } from '@solana/web3.js';
import DeviceInfo from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';

const { width } = Dimensions.get('window');

const ImportWallet = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const wallet = useSelector((state: RootState) => state.wallet);
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(true);
  const [isTouchIdEnabled, setIsTouchIdEnabled] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [password, _setPassword] = useState('12345678');
  const [confirmPassword, setConfirmPassword] = useState('12345678');
  const [loading, setLoading] = useState(false);
  const { NavigationTheme, Layout } = useTheme();
  const { colors } = NavigationTheme;

  const _importWallet = async () => {
    await setLoading(true);
    if (!validateMnemonic(mnemonic.trimStart().trimEnd())) {
      console.log(validateMnemonic(mnemonic.trimStart().trimEnd()));
      AlertHelper.show('error', t('import.mnemonic'), t('import.errors.invalidMnemonic'));
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      AlertHelper.show('error', t('import.mnemonic'), t('import.errors.passwordLength'));
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      AlertHelper.show('error', t('import.mnemonic'), t('import.errors.passwordsDoNotMatch'));
      setLoading(false);
      return;
    }

    const _wallet = importWallet(mnemonic.trimStart().trimEnd());

    let HDWallet = getHDWallet(0, mnemonic.trimStart().trimEnd());
    dispatch(_setMnemonic(mnemonic.trimStart().trimEnd()));
    dispatch(setPassword(password));
    let web3 = setDefaultAccount(_wallet?.privateKey);
    const connection = new Connection('https://api.devnet.solana.com');
    const balance = await web3.eth.getBalance(HDWallet?.address as string);
    const solBalance = await connection.getBalance(new PublicKey(HDWallet?.solana.publicKey as any));
    console.log('solBalance');
    console.log(solBalance);
    const uniqueId = await DeviceInfo.getUniqueId();
    dispatch(setUniqueId(uniqueId));
    OneSignal.setExternalUserId(uniqueId);
    dispatch(
      createWallet({
        index: 0,
        balance: `${web3.utils.fromWei(balance, 'ether')}`,
        // @ts-ignore
        address: HDWallet?.address,
        // @ts-ignore
        privateKey: HDWallet?.privateKey,
        name: 'Account 1',
        solana: {
          publicKey: HDWallet?.solana.publicKey as string,
          secretKey: HDWallet?.solana.secretKey as string,
          balance: `${solBalance}`,
          name: 'Account 1',
        },
        tokens: [],
        nfts: [],
        transactions: {
          ethereum: [],
          bsc: [],
          arbitrum: [],
          polygon: [],
          avalanche: [],
          optimism: [],
          fantom: [],
          cronos: [],
        },
      }),
    );
    dispatch(setActiveWallet(0));
    dispatch(setInitialised(true));
    setLoading(false);
    navigation.navigate('Tabs' as never);
  };

  useEffect(() => {
    if (wallet.mnemonic.length > 0) {
      bip39.validateMnemonic(wallet.mnemonic) ? setMnemonic(wallet.mnemonic) : AlertHelper.show('error', t('import.mnemonic'), t('import.errors.invalidMnemonic'));
    }
    return () => {
      console.log('ImportWallet unmounted');
    };
  }, [wallet.mnemonic]);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="never">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Image source={require('../../Assets/Images/ethereum-seed-phrase.png')} style={{ width: 180, height: 180 }} />
        <Text style={[styles.title, { color: colors.text }]}>{t('import.title')}</Text>
        <View style={styles.seedPhraseContainer}>
          <TextInput
            value={mnemonic}
            onChangeText={text => setMnemonic(text)}
            placeholder={t('import.seedPhrase')}
            multiline={true}
            numberOfLines={5}
            placeholderTextColor={'#B5BBC9'}
            style={[styles.seedPhrase, { color: colors.text_01 }]}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Scan' as never, { key: 'value' } as never)} style={styles.scan}>
            <MaterialCommunityIcons name="line-scan" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.password}>
          <View style={styles.passwordView}>
            <TextInput
              value={password}
              onChangeText={text => _setPassword(text)}
              secureTextEntry={isPasswordVisible}
              placeholder={t('import.password')}
              placeholderTextColor={'#B5BBC9'}
              style={[styles.passwordText, { color: colors.text_01 }]}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eye}>
              <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={26} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordView}>
            <TextInput
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              secureTextEntry={isConfirmPasswordVisible}
              placeholder={t('import.confirmPassword')}
              placeholderTextColor={'#B5BBC9'}
              style={[styles.passwordText, { color: colors.text_01 }]}
            />
            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eye}>
              <Ionicons name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={26} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.options}>
          <View style={Layout.center}>
            <Text
              style={{
                color: colors.text_01,
                textAlignVertical: 'center',
                fontWeight: '400',
                fontSize: 16,
              }}>
              {t('import.touchId')}
            </Text>
          </View>
          <View>
            <Switch value={isTouchIdEnabled} onValueChange={() => setIsTouchIdEnabled(!isTouchIdEnabled)} />
          </View>
        </View>
        <View style={styles.importButton}>
          <TouchableOpacity onPress={() => _importWallet()} style={[styles.button, { backgroundColor: colors.interactive_01 }]}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}> {t('import.import')} </Text>}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default ImportWallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginVertical: 20,
    fontWeight: '400',
    fontSize: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 30,
  },
  scan: {
    right: '10%',
    position: 'absolute',
  },
  button: {
    padding: 10,
    borderRadius: 25,
    width: width / 1.4,
    height: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#fff',
  },
  options: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    maxHeight: 50,
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 8,
  },
  seedPhrase: {
    borderWidth: 1,
    borderColor: '#CFD2D8',
    borderRadius: 5,
    width: '90%',
    height: 96,
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 90,
    paddingTop: 5,
    backgroundColor: '#fff',
  },
  seedPhraseContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  password: {
    flex: 1,
    width: '100%',
  },
  passwordView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  passwordText: {
    borderWidth: 1,
    borderColor: '#CFD2D8',
    backgroundColor: '#fff',
    borderRadius: 5,
    width: '90%',
    height: 50,
    paddingHorizontal: 20,
    fontSize: 15,
    fontWeight: '400',
  },
  eye: {
    right: '8%',
    position: 'absolute',
  },
  importButton: {
    flex: 1,
    bottom: 0,
    position: 'relative',
    marginTop: '8%',
  },
});
