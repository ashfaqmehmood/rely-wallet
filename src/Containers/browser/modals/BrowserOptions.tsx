import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

import { Network, Tab, Wallet } from '@/Store/web3';
import { useTheme } from '@/Hooks';
import makeBlockie from 'ethereum-blockies-base64';
import { addressAbbreviate, renderBalance } from '@/Utils/web3/web3';

interface BottomSheetProps {
  wallet: Wallet;
  network: Network;
  toggleAccountsModal: () => void;
  toggleNetworkModal: () => void;
}

const BrowserOptions = (props: BottomSheetProps) => {
  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  return (
    <>
      <View style={[{ alignItems: 'center', paddingLeft: 5, width: '100%' }]}>
        <TouchableOpacity style={{ marginLeft: 12, marginVertical: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ui_01, width: 48, height: 48, borderRadius: 24 }}>
            <Octicons name='plus' size={24} color={colors.icon_04} />
          </View>
          <Text style={{ textAlign: 'center', color: colors.text_04, fontSize: 16, fontWeight: '600', marginLeft: 12 }}>New tab</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 12, marginVertical: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ui_01, width: 48, height: 48, borderRadius: 24 }}>
            <AntDesign name='sharealt' size={24} color={colors.icon_04} />
          </View>
          <Text style={{ textAlign: 'center', color: colors.text_04, fontSize: 16, fontWeight: '600', marginLeft: 12 }}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 12, marginVertical: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ui_01, width: 48, height: 48, borderRadius: 24 }}>
            <Feather name='bookmark' size={24} color={colors.icon_04} />
          </View>
          <Text style={{ textAlign: 'center', color: colors.text_04, fontSize: 16, fontWeight: '600', marginLeft: 12 }}>Add to bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 12, marginVertical: 8, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ui_01, width: 48, height: 48, borderRadius: 24 }}>
            <Entypo name='globe' size={24} color={colors.icon_04} />
          </View>
          <Text style={{ textAlign: 'center', color: colors.text_04, fontSize: 16, fontWeight: '600', marginLeft: 12 }}>Open in browser</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => props.toggleAccountsModal()}
        style={{ flexDirection: 'row', width: '100%', alignContent: 'center', alignItems: 'center', marginVertical: 8, paddingHorizontal: 6 }}
        key={0}>
        <View style={{ marginLeft: 6, marginRight: 6, marginVertical: 5 }}>
          <Image source={{ uri: makeBlockie(props.wallet.address) }} style={{ width: 48, height: 48, borderRadius: 24 }} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <View style={{ flexDirection: 'column', width: '100%', alignContent: 'center', alignItems: 'center' }}>
            <Text style={{ textAlign: 'left', color: colors.text_01 }}>{props.wallet.name}</Text>
            <Text style={{ textAlign: 'left', color: colors.text_02 }}>{addressAbbreviate(props.wallet.address)}</Text>
          </View>
        </View>
        <View style={{ position: 'absolute', right: 30 }}>
          <Text style={{ textAlign: 'right', color: colors.positive_01 }}>{renderBalance(props.wallet.balance, props.network.nativeCurrency.symbol)}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={props.toggleNetworkModal}
        style={{ width: '90%', flexDirection: 'row', alignItems: 'center', paddingLeft: 24, margin: 20, paddingVertical: 18, borderRadius: 12, borderColor: colors.border_01, borderWidth: 2 }}>
        <View style={[styles.dot, { backgroundColor: colors.positive_01, marginRight: 10 }]} />
        <Text style={{ color: colors.text_02, fontSize: 15, fontWeight: '500' }}>{props.network.name}</Text>
        <FontAwesome name="chevron-down" size={13} color={colors.text_02} style={{ marginLeft: 10 }} />
        <View style={{ position: 'absolute', right: 20 }}>
          <AntDesign name='checkcircleo' size={24} color={colors.positive_01} />
        </View>
      </TouchableOpacity>
    </>
  )
}

export default BrowserOptions;

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