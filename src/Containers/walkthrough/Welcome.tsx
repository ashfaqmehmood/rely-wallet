import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, SafeAreaView } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/Hooks';

const { width } = Dimensions.get('window');

const Welcome = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { NavigationTheme, Layout, Colors } = useTheme();
  const { colors } = NavigationTheme;

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
  }, []);

  const importWallet = () => {
    // @ts-ignore
    navigation.navigate('ImportWallet');
  }

  const createWallet = () => {
    // @ts-ignore
    navigation.navigate('CreateWallet');
  }

  const openTerms = () => {
    // TODO: Add terms link
    InAppBrowser.open('https://www.google.com').then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <SafeAreaView style={[Layout.center, { backgroundColor: colors.background }]}>
      <Image resizeMode='contain' style={styles.image} source={require('@/Assets/Images/coins/ethereum.png')} />
      <Text style={styles.setup}>
        { t('welcome.setup') }
      </Text>
      <Text style={styles.title}>
        {t('welcome.title')}
      </Text>
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={() => importWallet()}
          style={[styles.button]}>
          <Text style={[styles.buttonText, { color: colors.interactive_01 }]}>
            {t('welcome.import')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => createWallet()}
          style={[styles.button, { backgroundColor: colors.interactive_01 }]}>
          <Text style={[styles.buttonText]}>
            {t('welcome.create')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => openTerms()}
          style={{ flexDirection: 'row', marginTop: 10 }}>
          <Text style={{ color: colors.text, fontSize: 10 }}>
            { t('welcome.agree') }
          </Text>
          <Text style={{ color: colors.text, fontSize: 10, textDecorationLine: 'underline' }}>
            { t('welcome.terms') }
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: 0,
    position: 'relative',
    marginTop: '5%',
    alignItems: 'center',
  },
  image: {
    width: '50%',
    maxHeight: '50%',
    marginVertical: '10%'
  },
  setup: {
    fontWeight: '700',
    fontSize: 24,
    color: '#0D1F3C',
    marginVertical: 10
  },
  title: {
    fontWeight: '400',
    fontSize: 16,
    color: '#485068'
  },
  button: {
    color: '#000',
    padding: 10,
    borderRadius: 25,
    width: width / 1.5,
    height: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderColor: '#347AF0',
    borderWidth: 2
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#ffffff'
  }
})