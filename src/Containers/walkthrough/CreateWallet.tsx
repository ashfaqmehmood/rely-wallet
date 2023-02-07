import _ from 'lodash';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, ActivityIndicator, SafeAreaView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Chip, GridList, Switch, Wizard } from 'react-native-ui-lib';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as bip39 from 'bip39';

import Header from '@/Components/Header';
import { setActiveWallet, setMnemonic, createWallet, setPassword, setInitialised, setUniqueId } from '@/Store/web3';
import { getHDWallet, setDefaultAccount, importWallet } from '@/Utils/web3/web3';
import { navigateAndSimpleReset } from '@/Navigators/utils';
import { AlertHelper } from '@/Utils/alertHelper';
import { setItem } from '@/Utils/localstorage';
import { RootState } from '@/Store';
import { useTheme } from '@/Hooks';
import { Connection, PublicKey } from '@solana/web3.js';
import DeviceInfo from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';

const { width, height } = Dimensions.get('window');

const CreateWallet = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(true);
  const [isTouchIdEnabled, setIsTouchIdEnabled] = useState(false);
  const [password, _setPassword] = useState('12345678');
  const [confirmPassword, setConfirmPassword] = useState('12345678');
  const [mnemonicWords, setMnemonicWords] = useState('');

  const [mnemonicWordsArray, setMnemonicWordsArray] = useState([]);
  const [filledMnemonicWords, setFilledMnemonicWords] = useState([]);
  const [mnemonicShuffled, setMnemonicShuffled] = useState([]);
  const [, updateState] = useState({});

  const [loading, setLoading] = useState(false);
  const { NavigationTheme, Layout } = useTheme();
  const { colors } = NavigationTheme;

  const [activeIndex, setActiveIndex] = useState(0);
  const [completedStepIndex, setCompletedStepIndex] = useState(0);

  const createPassword = async () => {
    await setLoading(true);
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

    let mnemonic = bip39.generateMnemonic();
    setMnemonicWords(mnemonic);

    const mnemonicArray = mnemonic.split(' ');

    // Avoid repeating words
    const hasDuplicates = _.uniq(mnemonicArray).length !== mnemonicArray.length;
    if (hasDuplicates) {
      createPassword();
      return;
    }

    let shuffled = _.shuffle(mnemonicArray);

    setMnemonicWordsArray(mnemonicArray as any);
    setMnemonicShuffled(shuffled as any);

    const _wallet = importWallet(mnemonic);

    // await setItem('mnemonic', mnemonic);
    // await setItem('privateKey', `${_wallet?.privateKey}`);
    // await setItem('isTouchIdEnabled', `${isTouchIdEnabled}`);

    let HDWallet = getHDWallet(0, mnemonic);
    dispatch(setMnemonic(mnemonic));
    dispatch(setPassword(password));
    let web3 = setDefaultAccount(_wallet?.privateKey);
    const connection = new Connection('https://api.devnet.solana.com');
    const balance = await web3.eth.getBalance(HDWallet?.address as string);
    const solBalance = await connection.getBalance(new PublicKey(HDWallet?.solana.publicKey as any));
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
    goToNextStep();
  };

  const completeWallet = () => {
    if (!_.isEqual(mnemonicWordsArray, filledMnemonicWords)) {
      AlertHelper.show('error', t('Create Wallet'), t('Select all words in correct order'));
      return;
    }
    dispatch(setInitialised(true));
    // navigateAndSimpleReset('Tabs');
    navigation.navigate('Tabs' as never);
  };

  const fillSeedPhrase = (word: string, index: number) => {
    if (filledMnemonicWords.includes(word as never)) {
      let filledWords = filledMnemonicWords;
      filledWords.splice(filledWords.indexOf(word as never), 1);
      setFilledMnemonicWords(filledWords);
      forceRender();
      return;
    }

    let filledWords = filledMnemonicWords;
    filledWords.push(word as never);
    setFilledMnemonicWords(filledWords);
    forceRender();
  };

  const forceRender = React.useCallback(() => updateState({}), []);

  const getStepState = (index: number) => {
    let state = Wizard.States.DISABLED;
    if (completedStepIndex > index - 1) {
      state = Wizard.States.COMPLETED;
    }
    return state;
  };

  const renderCurrentStep = () => {
    switch (activeIndex) {
      case 0:
      default:
        return renderCreatePassword();
      case 1:
        return renderSecureWallet();
      case 2:
        return renderConfirmSeedPhrase();
    }
  };

  const renderCreatePassword = () => {
    return (
      <>
        <Image resizeMode="contain" source={require('@/Assets/Images/onboarding/wallet.png')} style={{ height: '20%' }} />

        <Text style={[styles.title, { color: colors.text }]}>{t('create.title')}</Text>

        <Text style={[styles.description, { color: colors.text }]}>{t('create.description')}</Text>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.password]}>
            <View style={styles.passwordView}>
              <TextInput
                value={password}
                onChangeText={text => _setPassword(text)}
                secureTextEntry={isPasswordVisible}
                placeholder={t('create.password')}
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
                placeholder={t('create.confirmPassword')}
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
                  textAlignVertical: 'center',
                  color: colors.text_01,
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
        </KeyboardAvoidingView>
        <View style={styles.importButton}>
          <TouchableOpacity onPress={() => createPassword()} style={[styles.button, { backgroundColor: colors.interactive_01 }]}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}> {t('create.create')} </Text>}
          </TouchableOpacity>
          {
            // TODO: add password recover notice (optional)
          }
        </View>
      </>
    );
  };

  const renderSecureWallet = () => {
    return (
      <>
        <Text style={[styles.title, { color: colors.text }]}>{t('create.secureWallet')}</Text>

        <Text style={[styles.description, { color: colors.text }]}>{t('create.secureWalletDescription')}</Text>

        <GridList
          data={mnemonicWords.split(' ')}
          renderItem={({ item, index }) => (
            <Chip labelStyle={{ color: colors.text }} containerStyle={{ borderColor: 'blue' }} label={`${index + 1}. ${item}`} onPress={() => console.log('pressed')} />
          )}
          contentContainerStyle={{ marginTop: '10%', paddingHorizontal: 30 }}
          containerWidth={(width * 9) / 10}
          maxItemWidth={width / 2}
          numColumns={1}
          itemSpacing={10}
          listPadding={10}
        />

        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => goToNextStep()} style={[styles.button, { backgroundColor: colors.interactive_01 }]}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}> {t('create.next')} </Text>}
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderConfirmSeedPhrase = () => {
    return (
      <>
        <Text style={[styles.title, { color: colors.text }]}>{t('create.confirmSeedPhrase')}</Text>

        <Text style={[styles.description, { color: colors.text }]}>{t('create.confirmSeedPhraseDescription')}</Text>

        <View style={styles.mnemonics}>
          <GridList
            data={mnemonicWords.split(' ')}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <Chip containerStyle={{ width: 50, borderWidth: 0 }} label={`${index + 1}. `} onPress={() => console.log('pressed')} />
                <Chip
                  containerStyle={{
                    width: '70%',
                    borderColor: 'blue',
                    borderStyle: !filledMnemonicWords[index] ? 'dashed' : 'solid',
                  }}
                  label={filledMnemonicWords[index]}
                  onPress={() => console.log('pressed')}
                />
              </View>
            )}
            contentContainerStyle={styles.wordsContainer}
            containerWidth={width - 50}
            maxItemWidth={width / 2}
            numColumns={1}
            itemSpacing={10}
            listPadding={10}
          />
        </View>
        <View style={styles.mnemonicsList}>
          <GridList
            data={mnemonicShuffled}
            renderItem={({ item, index }) => (
              <Chip
                containerStyle={
                  !filledMnemonicWords.includes(item)
                    ? { borderColor: colors.interactive_01 }
                    : {
                        backgroundColor: colors.interactive_01,
                        borderColor: colors.interactive_01,
                      }
                }
                labelStyle={!filledMnemonicWords.includes(item) ? { color: colors.text } : { color: '#fff' }}
                label={item}
                onPress={() => fillSeedPhrase(item, index)}
              />
            )}
            contentContainerStyle={{ marginTop: '5%' }}
            containerWidth={width - 50}
            maxItemWidth={width / 3}
            numColumns={1}
            itemSpacing={10}
            listPadding={10}
          />
        </View>

        <View style={styles.importButton}>
          <TouchableOpacity onPress={() => completeWallet()} style={[styles.button, { backgroundColor: colors.interactive_01 }]}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}> {t('create.title')} </Text>}
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const goToNextStep = () => {
    setActiveIndex(activeIndex + 1);
    setCompletedStepIndex(completedStepIndex + 1);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Wizard activeIndex={activeIndex} onActiveIndexChanged={(index: React.SetStateAction<number>) => setActiveIndex(index)}>
        <Wizard.Step state={getStepState(0)} label={'Create Password'} />
        <Wizard.Step state={getStepState(1)} label={'Secure Wallet'} />
        <Wizard.Step state={getStepState(2)} label={'Confirm Seed Phrase'} />
      </Wizard>
      {renderCurrentStep()}
    </SafeAreaView>
  );
};

export default CreateWallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mnemonics: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    minHeight: 160,
  },
  wordsContainer: {
    marginTop: 10,
    borderColor: 'lightgray',
    borderWidth: 2,
    paddingTop: 12,
    borderRadius: 20,
  },
  mnemonicsList: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    minHeight: '10%',
  },
  title: {
    marginTop: 0,
    fontWeight: '500',
    fontSize: 18,
  },
  description: {
    marginTop: 20,
    fontWeight: '400',
    fontSize: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 10,
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
    marginBottom: 20,
  },
  password: {
    flex: 1,
    width: '100%',
    marginTop: '5%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  passwordView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  passwordText: {
    borderWidth: 1,
    borderColor: '#CFD2D8',
    backgroundColor: '#fff',
    borderRadius: 5,
    width: '90%',
    height: 50,
    margin: 10,
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
