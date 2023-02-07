import React, { useEffect, useMemo } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import makeBlockie from 'ethereum-blockies-base64';
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux';
import { RootState } from '@/Store';
import { Network, setActiveWallet, Token } from '@/Store/web3';
import { useTheme } from '@/Hooks';
import { getTokenIcon } from '@/Utils/tokenIcons';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const Tokens = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { darkMode, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const state = useSelector((state: RootState) => state.wallet);
  const activeWallet = useSelector((state: RootState) => state.wallet.activeWallet);
  const network = state.networks.find((network: Network) => network.chainId === state.activeNetwork);
  const wallet = state.wallets[activeWallet];
  const [refreshing, setRefreshing] = React.useState(false);

  const [tokens, setTokens] = React.useState([]);
  const [nativeToken, setNativeToken] = React.useState({
    balance: Number(wallet.balance),
    decimals: 18,
    name: network?.nativeCurrency.name,
    symbol: network?.nativeCurrency.symbol,
    token_address: '0x0000000000000000000000000000000000000000',
    usd_price: state.priceQuotes.find((quote: any) => quote.symbol === network?.nativeCurrency.symbol.toLowerCase())?.current_price || null,
  });

  useEffect(() => {
    // @ts-ignore-next-line
    let erc20_tokens = wallet.tokens.filter((token: Token) => token.chainId == network?.chainId);
    console.log(network?.chainId);
    console.log(wallet.tokens.length);
    setTokens(erc20_tokens as any);
  }, [wallet.address, network?.chainId]);

  const Item = useMemo(() => ({ item, index }: any) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Token' as never, { token: item } as never)}
        key={index}
        style={{
          width: '100%',
          paddingVertical: 4, paddingHorizontal: 8,
          flexDirection: 'row',
          borderBottomWidth: 2,
          borderBottomColor: colors.border_02,
        }}>
        <FastImage
          style={{
            width: getTokenIcon(item.symbol).url ? 64 : 48,
            height: getTokenIcon(item.symbol).url ? 64 : 48,
            borderRadius: getTokenIcon(item.symbol).url ? 32 : 24,
            margin: getTokenIcon(item.symbol).url ? 0 : 8,
          }}
          resizeMode={FastImage.resizeMode.contain}
          source={getTokenIcon(item.symbol).url || { uri: makeBlockie(item.token_address) }}
        />
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginLeft: 10 }}>
          <Text style={{ color: colors.text_01, textAlign: 'left', textAlignVertical: 'center', fontSize: 14, fontWeight: '500' }}>
            {(item.balance).toFixed(6)} {` ${item.symbol}`}
          </Text>
          <Text style={{ color: colors.text_02, textAlign: 'left', textAlignVertical: 'center', fontSize: 13, fontWeight: '400' }}>
            {
              item.usd_price && Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(item.usd_price * item.balance)
            }
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', marginRight: 8 }}>
          <FontAwesome style={{ textAlignVertical: 'center' }} name={'chevron-right'} size={20} color={colors.text_02} />
        </View>
      </TouchableOpacity>
    )
  }, []);

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item: any, index: number) => index.toString()}
      contentContainerStyle={{ paddingVertical: 0 }}
      contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
      data={[nativeToken, ...tokens]}
      ListFooterComponent={() => (
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
          <Text style={{ color: colors.text_01, marginVertical: 8 }}>
            Don't see your token?
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ImportToken' as never);
              }}>
              <Text style={{ color: colors.text_04, fontWeight: '500' }}>Import Token</Text>
            </TouchableOpacity>
            {/* 
            <Text style={{ color: colors.text_01, marginHorizontal: 5 }}>
              or
            </Text>
            <TouchableOpacity
              disabled={refreshing}
              onPress={() => {
                console.log('refresh tokens');
                // TODO: prevent refresh if already refreshing
                // TODO: prevent duplicate tokens if manually imported
                // TODO: Manually refresh tokens and nfts (loading indicator)
                // TODO: Warning if request fails because of rate limit or other error (try again later)
                // TODO: Warning if token is not verified
                setRefreshing(true);
                dispatch(setActiveWallet(activeWallet));
              }}>
              <Text
                style={{
                  color: refreshing ? colors.text_02 : colors.text_04,
                  fontWeight: '500'
                }}>
                Refresh Tokens
              </Text>
            </TouchableOpacity> 
             */}
          </View>
        </View>
      )}
      renderItem={({ item, index }) => <Item item={item} index={index} />}
    />
  )
}

export default Tokens

const styles = StyleSheet.create({

})