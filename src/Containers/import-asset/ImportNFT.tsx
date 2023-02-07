import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getWeb3Instance, utils } from '@/Utils/web3/web3';
import { useTheme } from '@/Hooks';
import { AlertHelper } from '@/Utils/alertHelper';
import { ERC1155ABI, ERC721ABI } from '@/Utils/ABI';
import { Network, setTokens, Token, Wallet } from '@/Store/web3';
import { useDispatch } from 'react-redux';
import { changeTheme } from '@/Store/Theme';

const web3 = getWeb3Instance();

const ImportNFT = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { NavigationTheme, darkMode } = useTheme();
  const { colors } = NavigationTheme;

  const activeWallet = useSelector((state: any) => state.wallet.activeWallet);
  const activeNetwork = useSelector((state: any) => state.wallet.activeNetwork);
  const wallet: Wallet = useSelector((state: any) => state.wallet.wallets[activeWallet]);
  const network: Network = useSelector((state: any) => state.wallet.networks.find((network: Network) => network.chainId === activeNetwork));

  const [tokenAddress, setTokenAddress] = React.useState('0x2953399124f0cbb46d2cbacd8a89cf0599974963');
  const [tokenId, setTokenId] = React.useState('21467873749992246999512605600492711159631745245389906895106497242132671103066');
  const [normalized_metadata, setNormalizedMetadata] = React.useState({});
  const [isValidAddress, setIsValidAddress] = React.useState(false);

  useEffect(() => {
    dispatch(changeTheme({ theme: 'default', darkMode: true }));
    console.log('tokenAddress', tokenAddress);
    if (!utils.isAddress(tokenAddress)) {
      // AlertHelper.show('error', 'Invalid Address', 'Please enter a valid address');
      // return;
    }
    (async () => {
      try {
        if (utils.isAddress(tokenAddress)) {
          const code = await web3.eth.getCode(tokenAddress);
          if (code === '0x') {
            // AlertHelper.show('error', 'Invalid Address', 'You have entered a personal address. Please enter a valid token address');
            // return;
          }
          const ABI = [
            {
              constant: true,
              inputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
              name: 'supportsInterface',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
          ];
          const contract = new web3.eth.Contract(ABI as any, tokenAddress);
          const is_erc721 = await contract.methods.supportsInterface('0x80ac58cd').call();
          const is_erc1155 = await contract.methods.supportsInterface('0xd9b67a26').call();

          if (is_erc721) {
            setIsValidAddress(true);
            let nft_contract = new web3.eth.Contract(ERC721ABI, tokenAddress);
            const name = await nft_contract.methods.name().call();
            const result = await nft_contract.methods.tokenURI(tokenId).call();
            let ipfsUrl = result;
            if (String(result).startsWith('ipfs://')) {
              ipfsUrl = String(result).replace('ipfs://', 'https://ipfs.io/');
            }
            return;
          }
          if (is_erc1155) {
            setIsValidAddress(true);
            let nft_contract = new web3.eth.Contract(ERC1155ABI, tokenAddress);
            const result = await nft_contract.methods.uri(tokenId).call();
            console.log(result);
            const balance = await nft_contract.methods.balanceOf(wallet.address, tokenId).call();
            console.log(balance);
            let tokenURI = result;
            if (String(result).startsWith('ipfs://')) {
              tokenURI = String(result).replace('ipfs://', 'https://ipfs.io/');
            }
            if (String(result).startsWith('https://api.opensea.io/') || String(result).startsWith('https://testnets-api.opensea.io/')) {
              tokenURI = result.replace('0x{id}', tokenId);
            }
            console.log(tokenURI);
            let metadata = await axios.get(tokenURI);
            console.log(metadata.data);
            setNormalizedMetadata({
              name: metadata.data.name,
              description: metadata.data.description,
              image: metadata.data.image || metadata.data.url || metadata.data.uri,
              ...metadata.data,
            });
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    })();
  }, [tokenAddress])

  const importToken = () => {
    console.log(network);
    const token: any = {
      chainId: network.chainId,
    }

    console.log(token);
    if (wallet.tokens.find((token: Token) => token.token_address === tokenAddress)) {
      AlertHelper.show('error', 'Token already exists', 'This token already exists in your wallet');
      return;
    }
    // dispatch(setTokens({ tokens: [token], index: activeWallet }));
    navigation.goBack();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.ui_background }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='never'>
        <View style={{ alignItems: 'center', flex: 1, paddingTop: 36 }}>
          <FastImage
            resizeMode='contain'
            style={{
              width: '100%',
              maxHeight: 240,
              height: 240,
            }}
            defaultSource={require('@/Assets/Images/nft/import-nft.png')}
            source={{ uri: normalized_metadata.image }} />
          <TextInput
            placeholder="Token Address"
            placeholderTextColor={colors.text_02}
            value={tokenAddress}
            onChangeText={text => setTokenAddress(text)}
            style={{
              width: '90%',
              height: 48,
              borderRadius: 8,
              marginVertical: 12,
              paddingHorizontal: 8,
              borderWidth: 0,
              borderColor: colors.border_01,
              color: colors.text_01,
              backgroundColor: darkMode ? colors.ui_01 : colors.ui_02
            }} />
          <TextInput
            placeholder="Token ID"
            placeholderTextColor={colors.text_02}
            value={tokenId}
            onChangeText={text => setTokenId(text)}
            style={{
              width: '90%',
              height: 48,
              borderRadius: 8,
              marginVertical: 12,
              paddingHorizontal: 8,
              borderWidth: 0,
              borderColor: colors.border_01,
              color: colors.text_01,
              backgroundColor: darkMode ? colors.ui_01 : colors.ui_02
            }} />
          <TouchableOpacity
            onPress={importToken}
            disabled={!isValidAddress}
            style={{
              width: '70%',
              height: 48,
              backgroundColor: isValidAddress ? colors.interactive_01 : colors.interactive_04,
              borderWidth: 1,
              borderColor: colors.border_01,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 20
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: '600',
              }}>
              Import NFT
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default ImportNFT

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})