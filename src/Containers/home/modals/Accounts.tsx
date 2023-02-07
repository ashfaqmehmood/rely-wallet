import React, { useMemo } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import makeBlockie from 'ethereum-blockies-base64';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Network, setActiveWallet, Wallet } from '@/Store/web3';
import { addressAbbreviate, renderBalance } from '@/Utils/web3/web3';
import { AlertHelper } from '@/Utils/alertHelper';
import { useTheme } from '@/Hooks';

interface AccountsProps {
  network: Network;
  toggleAccountModal: any;
  toggleNetworkModal: any;
  toggleModal: any;
  wallets: Array<Wallet>;
}

const Accounts = (props: AccountsProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const Item = useMemo(() => ({ item, index }: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(setActiveWallet(index));
          props.toggleModal();
        }}
        style={{ flexDirection: 'row', width: '100%', alignContent: 'center', alignItems: 'center', marginVertical: 8, marginHorizontal: 12 }}
        key={index}>
        <View style={{ marginLeft: 6, marginRight: 6, marginVertical: 5 }}>
          <Image source={{ uri: makeBlockie(item.address) }} style={{ width: 48, height: 48, borderRadius: 24 }} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <View style={{ flexDirection: 'column', width: '100%', alignContent: 'center', alignItems: 'center' }}>
            <Text style={{ textAlign: 'left', color: colors.text_01 }}>{item.name}</Text>
            <Text style={{ textAlign: 'left', color: colors.text_02 }}>{addressAbbreviate(item.address)}</Text>
          </View>
        </View>
        <View style={{ position: 'absolute', right: 30 }}>
          <Text style={{ textAlign: 'right', color: colors.positive_01 }}>{renderBalance(item.balance, props.network.nativeCurrency.symbol)}</Text>
        </View>
      </TouchableOpacity>
    )
  }, []);

  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 50 }}
      ListHeaderComponent={() => (
        <TouchableOpacity
          onPress={props.toggleNetworkModal}
          style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 24, margin: 20, paddingVertical: 18, borderRadius: 12, borderColor: colors.border_01, borderWidth: 2 }}>
          <View style={[styles.dot, { backgroundColor: colors.positive_01, marginRight: 10 }]} />
          <Text style={{ color: colors.text_02, fontSize: 15, fontWeight: '500' }}>{props.network?.name}</Text>
          <FontAwesome name="chevron-down" size={13} color={colors.text_02} style={{ marginLeft: 10 }} />
          <View style={{ position: 'absolute', right: 20 }}>
            <AntDesign name='checkcircleo' size={24} color={colors.positive_01} />
          </View>
        </TouchableOpacity>
      )}
      ListFooterComponent={() => (
        <View style={{ width: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => props.toggleAccountModal()}
            style={{ backgroundColor: colors.ui_01, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginVertical: 5 }}>
            <Text style={{ color: colors.interactive_01, fontSize: 15, fontWeight: '700' }}>{t('Create Account')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // TODO: Import Account with private key
              AlertHelper.show('info', 'Coming Soon', 'Import Account with private key is coming soon.');
            }}
            style={{ backgroundColor: colors.ui_01, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginVertical: 5 }}>
            <Text style={{ color: colors.interactive_01, fontSize: 15, fontWeight: '700' }}>{t('Import Account')}</Text>
          </TouchableOpacity>
        </View>
      )}
      data={props.wallets}
      renderItem={({ item, index }) => <Item item={item} index={index} />}
      keyExtractor={(item) => item.address}
    />
  )
}

export default Accounts;

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
});