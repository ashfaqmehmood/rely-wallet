import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import makeBlockie from 'ethereum-blockies-base64';

import { addressAbbreviate } from '@/Utils/web3/web3';
import { Network, Wallet } from '@/Store/web3';
import { useTheme } from '@/Hooks';

interface BottomSheetProps {
  webviewUrl: string;
  domain: string;
  network: Network;
  wallet: Wallet;
  allowConnection: () => void;
  denyConnection: () => void;
}

const Connect = (props: BottomSheetProps) => {
  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  return (
    <>
      <Text style={[styles.header, { color: colors.text_01 }]}>Connect Account</Text>
      <View style={[styles.container, { backgroundColor: colors.transparent }]}>
        <Image
          resizeMode='contain'
          source={{
            uri: `https://www.google.com/s2/favicons?domain=${props.domain}&sz=${128}`
          }}
          style={styles.favicon}
        />
        <View style={styles.box}>
          {props.webviewUrl.startsWith('https://') && (<MaterialIcons name='https' size={16} color={colors.positive_01} style={styles.https} />)}
          <Text style={[styles.domain, { color: colors.positive_01 }]}>
            {props.domain}
          </Text>
        </View>
        <View style={styles.box}>
          <View style={[styles.dot, { backgroundColor: colors.positive_01 }]} />
          <Text style={{ color: colors.interactive_01, marginLeft: 5 }}>
            {props.network.name}
          </Text>
        </View>
        <Text style={[styles.info, { color: colors.text_02 }]}>
          By touching connect, you allow this dapp to get your public address. Be careful about connecting to dapps you don't trust and always check the URL.
        </Text>
        <Text style={[styles.infoHeader, { color: colors.text_01 }]}>
          {props.domain} would like to connect to your wallet.
        </Text>
        <View
          style={[styles.accountCard, { borderColor: colors.border_01 }]}>
          <Image
            source={{ uri: makeBlockie(props.wallet.address) }}
            style={{ borderRadius: 24, width: 48, height: 48 }} />
          <View style={styles.accountCardView}>
            <Text style={{ color: colors.text_01, fontSize: 14, fontWeight: '500', textAlign: 'center' }}>{props.wallet.name} ({addressAbbreviate(props.wallet.address)}) </Text>
            <Text style={{ color: colors.text_02, fontSize: 13, fontWeight: '500', textAlign: 'center' }}>{props.wallet.balance} {props.network.nativeCurrency.symbol} </Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => props.denyConnection()}
            style={styles.denyButton}>
            <Text style={styles.buttonText}>Deny</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.allowConnection()}
            style={[styles.allowButton, { backgroundColor: colors.interactive_01 }]}>
            <Text style={styles.buttonText}>Allow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default Connect;

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