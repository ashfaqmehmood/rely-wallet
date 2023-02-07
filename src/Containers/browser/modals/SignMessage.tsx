import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import makeBlockie from 'ethereum-blockies-base64';

import { addressAbbreviate } from '@/Utils/web3/web3';
import { Network, Wallet } from '@/Store/web3';
import { useTheme } from '@/Hooks';

interface BottomSheetProps {
  webviewUrl: string;
  domain: string;
  wallet: Wallet;
  network: Network;
  messageToSign: string;
  sign: () => void;
  denySignature: () => void;
}

const SignMessage = (props: BottomSheetProps) => {
  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  return (
    <>
      <Text style={{ textAlign: 'center', color: colors.text_01, fontSize: 16, fontWeight: '600' }}>Sign Message</Text>
      <View style={{ backgroundColor: colors.transparent, width: '100%', alignItems: 'center', justifyContent: 'center', paddingTop: '10%' }}>
        <Image
          resizeMode='contain'
          source={{
            uri: `https://www.google.com/s2/favicons?domain=${props.domain}&sz=${128}`
          }}
          style={{ width: 64, height: 64, marginTop: 20 }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 8 }}>
          {props.webviewUrl.startsWith('https://') && (<MaterialIcons name='https' size={16} color={colors.positive_01} style={{ textAlign: 'center', textAlignVertical: 'center' }} />)}
          <Text style={{ color: colors.positive_01, textAlign: 'center', textAlignVertical: 'center', marginLeft: 3 }}>
            {
              // TODO: Show ssl status
              props.domain
            }
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 8 }}>
          <View style={[styles.dot, { backgroundColor: colors.positive_01 }]} />
          <Text style={{ color: colors.interactive_01, marginLeft: 5 }}>
            {
              props.network.name
            }
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: 70,
            minHeight: 70,
            width: '88%',
            flex: 1,
            borderWidth: 2,
            borderColor: colors.border_01,
            borderRadius: 10,
            padding: 10,
          }}>
          <Image source={{ uri: makeBlockie(props.wallet.address) }} style={{ borderRadius: 24, width: 48, height: 48 }} />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', marginLeft: 6 }}>
            <Text style={{ textAlign: 'center', color: colors.text_01, fontSize: 14, fontWeight: '500' }}>{props.wallet.name} ({addressAbbreviate(props.wallet.address)}) </Text>
            <Text style={{ textAlign: 'center', color: colors.text_02, fontSize: 13, fontWeight: '500' }}>{props.wallet.balance} {props.network.nativeCurrency.symbol} </Text>
          </View>
        </View>
        <ScrollView style={{
          borderWidth: 2,
          borderColor: colors.border_01,
          marginHorizontal: 10,
          marginTop: 10,
          paddingHorizontal: 24,
          paddingVertical: 0,
          borderRadius: 10,
          width: '92%',
          minHeight: '24%',
          maxHeight: '50%'
        }}>
          <Text style={{ marginTop: 10, color: colors.text_01 }}>Message:</Text>
          <Text style={{ fontSize: 13, textAlign: 'center', color: colors.text_02, marginVertical: 15 }}>
            {props.messageToSign}
          </Text>
        </ScrollView>
        <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 12, marginVertical: 20 }}>
          <TouchableOpacity
            onPress={() => props.denySignature()}
            style={{
              backgroundColor: 'red',
              padding: 10,
              borderRadius: 10,
              width: '45%',
              height: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.sign()}
            style={{
              backgroundColor: colors.interactive_01,
              padding: 10,
              borderRadius: 10,
              width: '45%',
              height: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>Sign</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default SignMessage;

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  header: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  },
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%'
  },
  favicon: {
    width: 64,
    height: 64,
    marginTop: 20
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    margin: 8
  },
  https: {
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  domain: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: 3
  },
  info: {
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
  },
  infoHeader: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 12
  },
  accountCard: {
    flexDirection: 'row',
    height: 70,
    minHeight: 70,
    width: '90%',
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
  accountCardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: 6
  },
  buttons: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
    marginVertical: 20
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  denyButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  allowButton: {
    padding: 10,
    borderRadius: 10,
    width: '45%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});