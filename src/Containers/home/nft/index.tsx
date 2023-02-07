import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux'

import { abbreviateTokenID, addressAbbreviate } from '@/Utils/web3/web3';
import { useTheme } from '@/Hooks';
import { RootState } from '@/Store'

const NFT = ({ route }: any) => {
  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const { nft } = route.params

  const activeNetwork = useSelector((state: RootState) => state.wallet.activeNetwork);
  const network = useSelector((state: RootState) => state.wallet.networks.find((network) => network.chainId === activeNetwork));

  useEffect(() => {
    console.log(nft);
  }, [])

  // TODO: move this to utils
  const getImageUrl = (url: string) => {
    if (url?.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://ipfs.io/');
    }
    return url;
  }

  return (
    <ScrollView
      style={{ flex: 1, flexGrow: 1 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <FastImage
        style={{
          width: 200,
          height: 200,
          borderRadius: 8
        }}
        source={{ uri: getImageUrl(nft.normalized_metadata.image) }}
        defaultSource={require('@/Assets/Images/nft/nft-search.png')} />
      <Text
        style={{
          color: colors.text_01,
          fontWeight: '500',
          fontSize: 20,
          paddingVertical: 24,
        }}>
        {nft.normalized_metadata.name}
      </Text>
      <Text
        style={{
          color: colors.text_02,
          fontWeight: '500',
          fontSize: 14,
          paddingHorizontal: 12,
          textAlign: 'center'
        }}>
        {nft.normalized_metadata.description}
      </Text>
      {nft.normalized_metadata.attributes.length > 0 && (
        <View style={{ padding: 12, width: '100%' }}>
          <Text
            style={{
              color: colors.text_01,
              fontWeight: '500',
              fontSize: 14,
              marginVertical: 12
            }}>
            Attributes
          </Text>
          {nft.normalized_metadata.attributes.map((attribute: any) => (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderColor: colors.border_02,
                borderWidth: 2,
                borderRadius: 8,
                alignSelf: 'flex-start',
                backgroundColor: colors.blurred_bg
              }}
              key={attribute.trait_type}>
              <Text
                style={{
                  color: colors.interactive_01,
                  fontWeight: '500',
                  fontSize: 14,
                  textTransform: 'uppercase',
                  marginVertical: 2
                }}>
                {attribute.trait_type}
              </Text>
              <Text
                style={{
                  color: colors.text_01,
                  fontWeight: '500',
                  fontSize: 13,
                  marginVertical: 2
                }}>
                {attribute.value}
              </Text>
            </View>
          ))}
        </View>
      )}
      <View style={{ flex: 1, padding: 16, width: '100%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
          <Text style={{ color: colors.text_01, fontWeight: '500', fontSize: 14 }}>Contract Address</Text>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(nft.token_address);
              Toast.show({
                type: 'info',
                text1: 'Copied to clipboard',
                text2: nft.token_address
              })
            }}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="copy-outline" size={18} color={colors.text_02} />
            <Text style={{ color: colors.text_01, fontWeight: '500', fontSize: 14, marginLeft: 8 }}>{addressAbbreviate(nft.token_address)}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
          <Text style={{ color: colors.text_01, fontWeight: '500', fontSize: 14 }}>Token ID</Text>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(nft.token_id);
              Toast.show({
                type: 'info',
                text1: 'Copied to clipboard',
                text2: nft.token_id
              })
            }}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="copy-outline" size={18} color={colors.text_02} />
            <Text style={{ color: colors.text_01, fontWeight: '500', fontSize: 14, marginLeft: 8 }}>{abbreviateTokenID(nft.token_id)}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
          <Text style={{ color: colors.text_01, fontWeight: '500', fontSize: 14 }}>Token Strandart</Text>
          <Text style={{ color: colors.text_01, fontWeight: '500', fontSize: 14 }}>{nft.contract_type}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
          <Text style={{ color: colors.text_01, fontWeight: '500', fontSize: 14 }}>Chain</Text>
          <Text style={{ color: colors.text_01, fontWeight: '500', fontSize: 14 }}>{network?.name}</Text>
        </View>
        {nft.contract_type === 'ERC1155' && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
            <Text style={{ color: colors.text_01, fontWeight: '500', fontSize: 14 }}>Amount</Text>
            <Text style={{ color: colors.text_01, fontWeight: '500', fontSize: 14 }}>{nft.amount}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default NFT

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
})