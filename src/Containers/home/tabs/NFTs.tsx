import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-ui-lib';
import { Network } from '@/Store/web3';
import { RootState } from '@/Store';
import { useTheme } from '@/Hooks';
import { getWeb3Instance } from '@/Utils/web3/web3';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('window').width;

const NFTs = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { darkMode, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const state = useSelector((state: RootState) => state.wallet);
  const activeWallet = useSelector((state: RootState) => state.wallet.activeWallet);
  const activeNetwork = useSelector((state: RootState) => state.wallet.activeNetwork);
  const network = state.networks.find((network: Network) => network.chainId === activeNetwork);
  const wallet = state.wallets[activeWallet];

  const [nfts, setNfts] = React.useState([]);

  useEffect(() => {
    // @ts-ignore-next-line
    let nft_items = wallet.nfts.filter((nft: any) => nft.chainId == network?.chainId);
    setNfts(nft_items as any);
    console.log(getWeb3Instance().currentProvider)
  }, [wallet.address, network?.chainId]);

  const getImageUrl = (url: string) => {
    if (url?.includes('ipfs://')) {
      return url.replace('ipfs://', 'https://ipfs.io/');
    }
    return url;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.transparent }}>
      {nfts.length === 0 && (
        <View style={{ padding: 10, marginTop: 20 }}>
          <FastImage
            source={require('@/Assets/Images/nft/nft-search.png')}
            style={{
              width: width / 2,
              height: width / 2,
              alignSelf: 'center'
            }} />
          <Text style={{ color: colors.text_01, textAlign: 'center', fontWeight: '500', fontSize: 15 }}>
            No NFTs found!
          </Text>
        </View>
      )}
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: any, index: number) => index.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
        data={nfts}
        renderItem={({ item, index }: any) => {
          return (
            <Card
              flex
              enableShadow={false}
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.border_02,
                backgroundColor: darkMode ? '#1d1d20' : '#f4f6fb',
                padding: 10,
                marginVertical: 5,
                width: '90%',
                maxHeight: 120,
                height: 120,
                flexDirection: 'row',
                alignSelf: 'center',
              }}
              onPress={() => {
                navigation.navigate('NFT' as never, { nft: item } as never);
              }}>
              <View style={{ flex: 0.7, flexDirection: 'column', width: '100%' }}>
                <Text style={{ color: colors.text_01, textAlign: 'left', textAlignVertical: 'center', fontSize: 15, fontWeight: '600', marginTop: 32 }}>
                  {item.name} ({item.symbol})
                </Text>
                <Text style={{ color: colors.text_02, textAlign: 'left', textAlignVertical: 'center', fontSize: 13, fontWeight: '500', marginTop: 16 }}>
                  {item.amount} {item.amount > 1 ? 'NFTs' : 'NFT'}
                </Text>
              </View>
              <View style={{ flex: 0.3, flexDirection: 'column', marginTop: 5, justifyContent: 'center', alignItems: 'flex-end' }}>
                <FastImage
                  resizeMode={FastImage.resizeMode.contain}
                  style={{ width: 82, height: 82, borderRadius: 12, marginRight: 8 }}
                  defaultSource={require('@/Assets/Images/nft/nft-search.png')}
                  source={{
                    uri: getImageUrl(item.normalized_metadata.image),
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                  }} />
              </View>
            </Card>
          )
        }}
        ListFooterComponent={() => (
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
            <Text style={{ color: colors.text_01, marginVertical: 8 }}>
              Don't see your assets?
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => navigation.navigate('ImportNFT' as never)}>
                <Text style={{ color: colors.text_04, fontWeight: '500' }}>
                  Import NFT
                </Text>
              </TouchableOpacity>
              {/* 
              <Text style={{ color: colors.text_01, marginHorizontal: 5 }}>
                or
              </Text>
              <TouchableOpacity
                onPress={() => {
                  console.log('refresh tokens');
                  // TODO: prevent refresh if already refreshing
                  // TODO: prevent duplicate tokens if manually imported
                  // TODO: Manually refresh tokens and nfts (loading indicator)
                  // TODO: Warning if request fails because of rate limit or other error (try again later)
                  // TODO: Warning if token is not verified
                  dispatch(setActiveWallet(activeWallet));
                }}>
                <Text style={{ color: colors.text_04, fontWeight: '500' }}>Refresh NFTs</Text>
              </TouchableOpacity>
              */}
            </View>
          </View>
        )}
      />
    </View>
  )
}

export default NFTs

const styles = StyleSheet.create({

})