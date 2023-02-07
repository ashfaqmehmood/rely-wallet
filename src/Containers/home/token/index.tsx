import React, { useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import makeBlockie from 'ethereum-blockies-base64';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';

import ActionButton from '@/Components/ActionButton';
import { useTheme } from '@/Hooks';
import { RootState } from '@/Store';
import { Network } from '@/Store/web3';
import { AlertHelper } from '@/Utils/alertHelper';
import { getTokenIcon } from '@/Utils/tokenIcons';
import { addressAbbreviate, utils } from '@/Utils/web3/web3';

const width = Dimensions.get('window').width;

// TODO: fix types
const Token = ({ route }: any) => {
  const { token } = route.params;
  const { t } = useTranslation();
  const { NavigationTheme, darkMode } = useTheme();
  const { colors } = NavigationTheme;

  const [transactions, setTransactions] = React.useState([]);

  const activeWallet = useSelector((state: RootState) => state.wallet.activeWallet);
  const network = useSelector((state: RootState) => state.wallet.networks.find((network: Network) => network.chainId === state.wallet.activeNetwork));
  const wallet = useSelector((state: RootState) => state.wallet.wallets[activeWallet]);
  const all_transactions = wallet.transactions;

  useEffect(() => {
    // TODO use chainId instead of slug
    // @ts-ignore-next-line network?.slug is not undefined
    let txs = all_transactions[network.slug]?.filter((tx: any) => tx.chain == network?.slug);

    if (txs) {
      if (token.token_address == '0x0000000000000000000000000000000000000000') {
        setTransactions(txs.filter((tx: any) => tx.is_erc20 === false).sort((a: any, b: any) => b.timeStamp - a.timeStamp));
      } else {
        let token_txs = txs?.filter((tx: any) => tx.is_erc20 === true);
        token_txs = token_txs?.filter((tx: any) => tx.token[0].address == token.token_address);
        setTransactions(token_txs?.sort((a: any, b: any) => b.timeStamp - a.timeStamp))
      }
    }
  }, [])

  // TODO: Move to utils
  const renderImage = (slug: any, chain: string) => {
    switch (chain) {
      case 'eth':
        if (slug) {
          return (
            <View>
              <FastImage
                style={{
                  width: 28,
                  height: 28,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 12
                }}
                source={require('@/Assets/Images/coins/ethereum.png')} />
              {
                slug == 'USDT' ? (
                  <FastImage
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <FastImage
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<FastImage style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/ethereum.png')} />)
        }
      case 'bsc':
        if (slug) {
          return (
            <View>
              <FastImage
                style={{
                  width: 28,
                  height: 28,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 12
                }}
                source={require('@/Assets/Images/coins/binance.png')} />
              {
                slug == 'USDT' ? (
                  <FastImage
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <FastImage
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<FastImage style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/binance.png')} />)
        }
      case 'arbitrum':
        if (slug) {
          return (
            <View>
              <FastImage
                style={{
                  width: 28,
                  height: 28,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 12
                }}
                source={require('@/Assets/Images/coins/arbitrum.png')} />
              {
                slug == 'USDT' ? (
                  <FastImage
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <FastImage
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<FastImage style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/arbitrum.png')} />)
        }
      case 'polygon':
        if (slug) {
          return (
            <View>
              <FastImage
                style={{
                  width: 28,
                  height: 28,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 12
                }}
                source={require('@/Assets/Images/coins/polygon.png')} />
              {
                slug == 'USDT' ? (
                  <FastImage
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <FastImage
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<FastImage style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/polygon.png')} />)
        }
      case 'avalanche':
        if (slug) {
          return (
            <View>
              <FastImage
                style={{
                  width: 28,
                  height: 28,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 12
                }}
                source={require('@/Assets/Images/coins/avalanche.png')} />
              {
                slug == 'USDT' ? (
                  <FastImage
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <FastImage
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<FastImage style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/avalanche.png')} />)
        }
      case 'optimism':
        if (slug) {
          return (
            <View>
              <FastImage
                style={{
                  width: 28,
                  height: 28,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 12
                }}
                source={require('@/Assets/Images/coins/optimism.png')} />
              {
                slug == 'USDT' ? (
                  <FastImage
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <FastImage
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<FastImage style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/optimism.png')} />)
        }
      case 'fantom':
        if (slug) {
          return (
            <View>
              <FastImage
                style={{
                  width: 28,
                  height: 28,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 12
                }}
                source={require('@/Assets/Images/coins/fantom-3d.png')} />
              {
                slug == 'USDT' ? (
                  <FastImage
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <FastImage
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<FastImage style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/fantom.png')} />)
        }
      case 'cronos':
        if (slug) {
          return (
            <View>
              <FastImage
                style={{
                  width: 28,
                  height: 28,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 12
                }}
                source={require('@/Assets/Images/coins/cronos-badge.png')} />
              {
                slug == 'USDT' ? (
                  <FastImage
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <FastImage
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<FastImage style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/cronos.png')} />)
        }
    }
  };

  // TODO: move to utils
  const getColor = (item: any) => {
    if (item.is_erc20) {
      return item.from == wallet.address.toLowerCase() ? 'red' : colors.positive_01
    } else if (item.value == 0) {
      return colors.text_02
    } else {
      return item.from == wallet.address.toLowerCase() ? 'red' : colors.positive_01
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <FastImage
        style={{
          width: getTokenIcon(token.symbol).url ? 96 : 72,
          height: getTokenIcon(token.symbol).url ? 96 : 72,
          borderRadius: getTokenIcon(token.symbol).url ? 48 : 36,
          margin: getTokenIcon(token.symbol).url ? 16 : 16,
        }}
        source={getTokenIcon(token.symbol).url}
        defaultSource={require('@/Assets/Images/blockie.png')} />
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 12 }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>
          {
            Number(token.balance) % 1 === 0 ? Number(token.balance) : Number(token.balance).toFixed(6)
          }
          {` ${token.symbol}`}
        </Text>
        {token.usd_price && (
          <Text style={{ color: colors.text_02, fontSize: 15, fontWeight: '500', marginTop: 12 }}>
            {
              Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(token.balance) * token.usd_price)
            }
          </Text>
        )}
        {token.token_address != '0x0000000000000000000000000000000000000000' && (
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(token.token_address);
              AlertHelper.show('success', 'Copied to clipboard', 'Token address has been copied to clipboard');
            }}
            style={{
              backgroundColor: colors.ui_01,
              marginTop: 12,
              height: 36,
              borderRadius: 18,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: colors.border_02,
            }}>
            <Text style={{ color: colors.text_01, fontSize: 13, fontWeight: '600', marginRight: 8 }}>
              {addressAbbreviate(token.token_address)}
            </Text>
            <Ionicons name='copy-outline' size={16} color={colors.text_01} />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          borderBottomColor: colors.border_01,
          borderBottomWidth: 2
        }}>
        <ActionButton icon='send' text={t('Send')} size={18} iconType='FontAwesome' />
        <ActionButton icon='download' text={t('Receive')} size={18} iconType='AntDesign' />
        <ActionButton icon='credit-card-alt' text={t('Buy')} size={18} iconType='FontAwesome' />
        <ActionButton icon='repeat' text={t('Swap')} size={18} iconType='Feather' />
        <ActionButton icon='swap-horizontal-variant' text={t('Bridge')} size={18} iconType='MaterialCommunityIcons' />
      </View>
      {transactions.length === 0 ? (
        <View style={{ padding: 10, marginTop: 20, flex: 1 }}>
          <FastImage
            source={require('@/Assets/Images/search.png')}
            style={{
              width: width / 1.6,
              height: width / 1.6,
              alignSelf: 'center'
            }} />
          <Text style={{ color: colors.text_01, textAlign: 'center', fontWeight: '500', fontSize: 15 }}>
            No transaction found!
          </Text>
        </View>
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item, index) => index.toString()}
          data={transactions}
          renderItem={({ item }: any) => (
            <TouchableOpacity onPress={() => console.log(item)}>
              <View
                style={{
                  backgroundColor: colors.transparent,
                  paddingHorizontal: 10,
                  paddingTop: 6,
                }}>
                <Text
                  style={{
                    color: colors.text_02,
                    fontSize: 11,
                  }}>
                  {
                    `#${item.nonce} - ${new Date(item.timeStamp * 1000).toUTCString()}`
                  }
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingTop: 2,
                  paddingBottom: 4,
                  borderBottomColor: colors.border_01,
                  borderBottomWidth: 2,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {item.is_erc20 ? renderImage(item.token[0].symbol, item.chain) : renderImage(null, item.chain)}
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: colors.text_01, marginLeft: 10 }}>{addressAbbreviate(item.to)}</Text>
                    <Text style={{ color: colors.text_02, marginLeft: 10 }}>{item.functionName.substring(0, item.functionName.indexOf('('))}</Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: getColor(item),
                  }}>
                  {item.is_erc20 && `${item.logs.value / 10 ** item.token[0].decimals} ${item.token[0].symbol}`}
                  {(!item.is_erc20 && Number(item.value) !== 0) && `${parseFloat(utils.fromWei(item.value, 'ether')).toFixed(4)} ${item.symbol}`}
                  {(!item.is_erc20 && Number(item.value) === 0) && `Contract Call`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
}

export default Token

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})