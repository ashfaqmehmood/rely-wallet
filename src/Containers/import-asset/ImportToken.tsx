import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import { getWeb3Instance, utils } from '@/Utils/web3/web3';
import { useTheme } from '@/Hooks';
import { AlertHelper } from '@/Utils/alertHelper';
import { ERC20ABI } from '@/Utils/ABI';
import { Network, setTokens, Token, Wallet } from '@/Store/web3';
import { useDispatch } from 'react-redux';
import { changeTheme } from '@/Store/Theme';

const web3 = getWeb3Instance();

const ImportToken = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { NavigationTheme, darkMode } = useTheme();
  const { colors } = NavigationTheme;

  const activeWallet = useSelector((state: any) => state.wallet.activeWallet);
  const activeNetwork = useSelector((state: any) => state.wallet.activeNetwork);
  const wallet: Wallet = useSelector((state: any) => state.wallet.wallets[activeWallet]);
  const network: Network = useSelector((state: any) => state.wallet.networks.find((network: Network) => network.chainId === activeNetwork));

  const [tokenAddress, setTokenAddress] = React.useState('0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7');
  const [tokenName, setTokenName] = React.useState('');
  const [tokenSymbol, setTokenSymbol] = React.useState('');
  const [tokenDecimals, setTokenDecimals] = React.useState('');
  const [tokenBalance, setTokenBalance] = React.useState('');
  const [isValidAddress, setIsValidAddress] = React.useState(false);

  useEffect(() => {
    dispatch(changeTheme({ theme: 'default', darkMode: true }));
    console.log('tokenAddress', tokenAddress);
    if (!utils.isAddress(tokenAddress)) {
      AlertHelper.show('error', 'Invalid Address', 'Please enter a valid address');
      return;
    }
    (async () => {
      try {
        if (utils.isAddress(tokenAddress)) {
          const code = await web3.eth.getCode(tokenAddress);
          if (code === '0x') {
            AlertHelper.show('error', 'Invalid Address', 'You have entered a personal address. Please enter a valid token address');
            return;
          }
          const tokenContract = new web3.eth.Contract(ERC20ABI, tokenAddress);
          const symbol = await tokenContract.methods.symbol().call();
          const decimals = await tokenContract.methods.decimals().call();
          const name = await tokenContract.methods.name().call();
          const balance = await tokenContract.methods.balanceOf(wallet.address).call();
          setTokenName(name);
          setTokenSymbol(symbol);
          setTokenDecimals(decimals);
          setTokenBalance(balance);
          setIsValidAddress(true);
        }
      } catch (error) {
        console.log('error', error);
      }
    })();
  }, [tokenAddress])

  const importToken = () => {
    console.log(network);
    const token: Token = {
      name: tokenName,
      symbol: tokenSymbol,
      decimals: Number(tokenDecimals),
      token_address: tokenAddress,
      balance: Number(tokenBalance),
      chainId: network.chainId,
    }

    console.log(token);
    if (wallet.tokens.find((token: Token) => token.token_address === tokenAddress)) {
      AlertHelper.show('error', 'Token already exists', 'This token already exists in your wallet');
      return;
    }
    dispatch(setTokens({ tokens: [token], index: activeWallet }));
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
            source={require('@/Assets/Images/onboarding/astronaut-ethereum.png')} />
          <Card
            padding-0
            margin-0
            center
            containerStyle={{
              padding: 0,
              backgroundColor: colors.ui_01,
              borderWidth: 1,
              borderColor: colors.border_02,
            }}
            style={{
              width: '90%',
              paddingHorizontal: 12,
              paddingVertical: 12,
              marginBottom: '5%',
              shadowColor: colors.shadow_01,
              backgroundColor: colors.ui_01,
              borderWidth: 1,
              borderColor: colors.border_02,
              flexDirection: 'row',
            }}>
            <Ionicons
              size={24}
              name="alert-circle-outline"
              color={colors.icon_04}
              style={{ width: '8%' }}
            />
            <Text
              style={{
                backgroundColor: 'transparent',
                color: darkMode ? colors.text_02 : colors.text_02,
                fontSize: 12,
                fontWeight: '500',
                width: '92%',
                paddingLeft: 6,
              }}>
              Anyone can create a token, including fake versions of existing tokens. Check the contract address before interacting with a token.
            </Text>
          </Card>
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
            placeholder="Token Symbol"
            placeholderTextColor={colors.text_02}
            value={tokenSymbol}
            onChangeText={text => setTokenSymbol(text)}
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
            placeholder="Token Decimals"
            placeholderTextColor={colors.text_02}
            value={tokenDecimals}
            onChangeText={text => setTokenDecimals(text)}
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
              Import Token
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

export default ImportToken

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})