import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import makeBlockie from 'ethereum-blockies-base64';

import { RootState } from '@/Store';
import {
  Network,
  setEthTransactions as setEthTransactionsAction,
  setBscTransactions as setBscTransactionsAction,
  setArbitrumTransactions as setArbitrumTransactionsAction,
  setPolygonTransactions as setPolygonTransactionsAction,
  setAvalancheTransactions as setAvalancheTransactionsAction,
  setOptimismTransactions as setOptimismTransactionsAction,
  setFantomTransactions as setFantomTransactionsAction,
  setCronosTransactions as setCronosTransactionsAction,
} from '@/Store/web3';

import Header from '@/Components/AccountHeader';
import CustomBackdrop from '@/Components/Backdrop';
import Accounts from '../home/modals/Accounts';
import Networks from '../home/modals/Networks';
import Assets from '../home/modals/Assets';
import { useTheme } from '@/Hooks';
import Account from '../home/modals/Account';
import { changeTheme } from '@/Store/Theme';
import { addressAbbreviate, utils } from '@/Utils/web3/web3';
import { arbitrum, avalanche, bscscan, cronos, etherscan, fantom, optimism, polygon } from '@/Services/history';
import FastImage from 'react-native-fast-image';

const width = Dimensions.get("window").width

const History = () => {
  const dispatch = useDispatch();
  const { darkMode, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const activeWallet = useSelector((state: RootState) => state.wallet.activeWallet);
  const activeNetwork = useSelector((state: RootState) => state.wallet.activeNetwork);
  const networks = useSelector((state: RootState) => state.wallet.networks);
  const wallets = useSelector((state: RootState) => state.wallet.wallets);
  const mnemonic = useSelector((state: RootState) => state.wallet.mnemonic);
  const network = networks.find((network: Network) => network.chainId === activeNetwork);
  const wallet = useSelector((state: RootState) => state.wallet.wallets[activeWallet]);
  const state = useSelector((state: RootState) => state);

  const [eth_transactions, setEthTransactions] = useState<any>(wallet.transactions.ethereum);
  const [bsc_transactions, setBscTransactions] = useState<any>(wallet.transactions.bsc);
  const [arbitrum_transactions, setArbitrumTransactions] = useState<any>(wallet.transactions.arbitrum);
  const [polygon_transactions, setPolygonTransactions] = useState<any>(wallet.transactions.polygon);
  const [avalanche_transactions, setAvalancheTransactions] = useState<any>(wallet.transactions.avalanche);
  const [optimism_transactions, setOptimismTransactions] = useState<any>(wallet.transactions.optimism);
  const [fantom_transactions, setFantomTransactions] = useState<any>(wallet.transactions.fantom);
  const [cronos_transactions, setCronosTransactions] = useState<any>(wallet.transactions.cronos);

  let transactions = [
    ...wallet.transactions.ethereum,
    ...wallet.transactions.bsc,
    ...wallet.transactions.arbitrum,
    ...wallet.transactions.polygon,
    ...wallet.transactions.avalanche,
    ...wallet.transactions.optimism,
    ...wallet.transactions.fantom,
    ...wallet.transactions.cronos,
  ];

  const [modalVisible, setModalVisible] = useState(-1);
  const [networkModalVisible, setNetworkModalVisible] = useState(-1);
  const [accountModalVisible, setAccountModalVisible] = useState(-1);
  const [assetsModalVisible, setAssetsModalVisible] = useState(-1);

  // refs
  const accountsModalRef = useRef<BottomSheetModal>(null);
  const networksModalRef = useRef<BottomSheetModal>(null);
  const addAccountModalRef = useRef<BottomSheetModal>(null);
  const assetsRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['50%', '60%'], []);
  const snapPointsNetwork = useMemo(() => ['50%', '50%'], []);

  // callbacks
  const handlePresentAccountsModal = useCallback(() => {
    accountsModalRef.current?.present();
  }, []);
  const handlePresentNetworksModal = useCallback(() => {
    networksModalRef.current?.present();
  }, []);
  const handlePresentAddAccountModal = useCallback(() => {
    addAccountModalRef.current?.present();
  }, []);
  const handlePresentAssetsModalPress = useCallback(() => {
    assetsRef.current?.present();
  }, []);

  const handleAccountsChanges = useCallback((index: number) => {
    setModalVisible(index);
  }, []);
  const handleNetworksChanges = useCallback((index: number) => {
    setNetworkModalVisible(index);
  }, []);
  const handleAccountChanges = useCallback((index: number) => {
    setAccountModalVisible(index);
  }, []);
  const handleAssetsChanges = useCallback((index: number) => {
    setAssetsModalVisible(index);
  }, []);

  const toggleModal = () => {
    modalVisible === -1 ? handlePresentAccountsModal() : accountsModalRef.current?.dismiss();
  };
  const toggleNetworkModal = () => {
    networkModalVisible === -1 ? handlePresentNetworksModal() : networksModalRef.current?.dismiss();
  };
  const toggleAccountModal = () => {
    accountModalVisible === -1 ? handlePresentAddAccountModal() : addAccountModalRef.current?.dismiss();
  };
  const toggleAssetsModal = () => {
    assetsModalVisible === -1 ? handlePresentAssetsModalPress() : assetsRef.current?.dismiss();
  };

  useEffect(() => {
    dispatch(changeTheme({ theme: 'default', darkMode: true }))
    // etherscan.getTransactions(wallet.address).then((result: any) => {
    //   // setEthTransactions(result);
    //   dispatch(setEthTransactionsAction({ index: activeWallet, transactions: [...result] }));
    // });
    // bscscan.getTransactions(wallet.address).then((result: any) => {
    //   // setBscTransactions(result);
    //   dispatch(setBscTransactionsAction({ index: activeWallet, transactions: [...result] }));
    // });
    // arbitrum.getTransactions(wallet.address).then((result: any) => {
    //   // setArbitrumTransactions(result);
    //   dispatch(setArbitrumTransactionsAction({ index: activeWallet, transactions: [...result] }));
    // });
    // polygon.getTransactions(wallet.address).then((result: any) => {
    //   // setPolygonTransactions(result);
    //   dispatch(setPolygonTransactionsAction({ index: activeWallet, transactions: [...result] }));
    // });
    // avalanche.getTransactions(wallet.address).then((result: any) => {
    //   // setAvalancheTransactions(result);
    //   dispatch(setAvalancheTransactionsAction({ index: activeWallet, transactions: [...result] }));
    // });
    // optimism.getTransactions(wallet.address).then((result: any) => {
    //   // setOptimismTransactions(result);
    //   dispatch(setOptimismTransactionsAction({ index: activeWallet, transactions: [...result] }));
    // });
    // fantom.getTransactions(wallet.address).then((result: any) => {
    //   // setFantomTransactions(result);
    //   dispatch(setFantomTransactionsAction({ index: activeWallet, transactions: [...result] }));
    // });
    // cronos.getTransactions(wallet.address).then((result: any) => {
    //   // setCronosTransactions(result);
    //   dispatch(setCronosTransactionsAction({ index: activeWallet, transactions: [...result] }));
    // });
  }, [wallet.address])

  // TODO: move to utils
  const renderImage = (slug: any, chain: string) => {
    switch (chain) {
      case 'eth':
        if (slug) {
          return (
            <View>
              <Image
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
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <Image
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<Image style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/ethereum.png')} />)
        }
      case 'bsc':
        if (slug) {
          return (
            <View>
              <Image
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
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <Image
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<Image style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/binance.png')} />)
        }
      case 'arbitrum':
        if (slug) {
          return (
            <View>
              <Image
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
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <Image
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<Image style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/arbitrum.png')} />)
        }
      case 'polygon':
        if (slug) {
          return (
            <View>
              <Image
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
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <Image
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<Image style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/polygon.png')} />)
        }
      case 'avalanche':
        if (slug) {
          return (
            <View>
              <Image
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
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <Image
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<Image style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/avalanche.png')} />)
        }
      case 'optimism':
        if (slug) {
          return (
            <View>
              <Image
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
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <Image
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<Image style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/optimism.png')} />)
        }
      case 'avalanche':
        if (slug) {
          return (
            <View>
              <Image
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
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <Image
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<Image style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/avalanche.png')} />)
        }
      case 'fantom':
        if (slug) {
          return (
            <View>
              <Image
                style={{
                  width: 28,
                  height: 28,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 12
                }}
                source={require('@/Assets/Images/coins/fantom.png')} />
              {
                slug == 'USDT' ? (
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <Image
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<Image style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/fantom.png')} />)
        }
      case 'cronos':
        if (slug) {
          return (
            <View>
              <Image
                style={{
                  width: 28,
                  height: 28,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1,
                  borderRadius: 12
                }}
                source={require('@/Assets/Images/coins/cronos.png')} />
              {
                slug == 'USDT' ? (
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={require('@/Assets/Images/coins/tether.png')} />
                ) : (
                  <Image
                    style={{ width: 48, height: 48, borderRadius: 24, marginHorizontal: 8 }}
                    source={{ uri: makeBlockie('0x00000000000000000000000000000000') }} />
                )
              }
            </View>
          )
        } else {
          return (<Image style={{ width: 60, height: 60 }} source={require('@/Assets/Images/coins/cronos.png')} />)
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
    <View style={styles.container}>
      <Header
        network={network as Network}
        wallet={wallet}
        toggleAssetsModal={toggleAssetsModal}
        toggleAccountModal={toggleModal} />

      <View
        style={{
          backgroundColor: colors.transparent,
          borderBottomColor: colors.border_01,
          borderBottomWidth: 2,
        }}>
        <ScrollView
          horizontal={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            backgroundColor: colors.transparent,
            paddingVertical: 10,
            paddingHorizontal: 4,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            alignContent: 'center',
            marginTop: 10,
          }}>
          <TouchableOpacity
            onPress={() => console.log('test')}
            style={{
              alignItems: 'center',
              marginHorizontal: 2,
              padding: 6,
              borderRadius: 8,
              backgroundColor: darkMode ? colors.ui_03 : colors.transparent,
              borderColor: colors.border_02,
              borderWidth: 1,
              height: 34,
              width: 36,
            }}>
            <Ionicons name="md-options" size={20} color={darkMode ? colors.text_02 : '#464646'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('test')}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginHorizontal: 2,
              padding: 6,
              borderRadius: 8,
              backgroundColor: darkMode ? colors.ui_03 : colors.transparent,
              borderColor: colors.border_02,
              borderWidth: 1,
              height: 34,
            }}>
            <Text
              style={{
                color: darkMode ? colors.text_02 : '#464646',
                marginRight: 2,
                fontSize: 13,
              }}>
              Networks
            </Text>
            <Ionicons name="ios-chevron-down" size={20} color={darkMode ? colors.text_02 : '#464646'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('test')}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginHorizontal: 2,
              padding: 6,
              borderRadius: 8,
              backgroundColor: darkMode ? colors.ui_03 : colors.transparent,
              borderColor: colors.border_02,
              borderWidth: 1,
              height: 34,
            }}>
            <Text
              style={{
                color: darkMode ? colors.text_02 : '#464646',
                marginRight: 2,
                fontSize: 13,
              }}>
              All Transactions
            </Text>
            <Ionicons name="ios-chevron-down" size={20} color={darkMode ? colors.text_02 : '#464646'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('test')}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginHorizontal: 2,
              padding: 6,
              borderRadius: 8,
              backgroundColor: darkMode ? colors.ui_03 : colors.transparent,
              borderColor: colors.border_02,
              borderWidth: 1,
              height: 34,
            }}>
            <Text
              style={{
                color: darkMode ? colors.text_02 : '#464646',
                marginRight: 2,
                fontSize: 13,
              }}>
              Descending
            </Text>
            <Ionicons name="ios-chevron-down" size={20} color={darkMode ? colors.text_02 : '#464646'} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {transactions.length === 0 ? (
        <View style={{ padding: 10, marginTop: 20, flex: 1 }}>
          <FastImage
            source={require('@/Assets/Images/search.png')}
            style={{
              width: width / 1.2,
              height: width / 1.2,
              alignSelf: 'center'
            }} />
          <Text style={{ color: colors.text_01, textAlign: 'center', fontWeight: '500', fontSize: 15 }}>
            No transaction found!
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={transactions.sort((a, b) => b.timeStamp - a.timeStamp)}
          renderItem={({ item }) => (
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
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      <BottomSheetModal
        index={0}
        ref={accountsModalRef}
        snapPoints={snapPoints}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleAccountsChanges}>
        <View style={[{ flex: 1 }]}>
          <Accounts
            network={network as Network}
            toggleModal={toggleModal}
            toggleAccountModal={toggleAccountModal}
            toggleNetworkModal={toggleNetworkModal}
            wallets={wallets}
          />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={0}
        ref={networksModalRef}
        snapPoints={snapPointsNetwork}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleNetworkModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleNetworksChanges}>
        <View style={[{ flex: 1 }]}>
          <Networks
            network={network as Network}
            networks={networks}
            toggleAccountModal={toggleModal}
            toggleNetworkModal={toggleNetworkModal}
          />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={addAccountModalRef}
        snapPoints={snapPointsNetwork}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleAccountModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleAccountChanges}>
        <View style={[{ flex: 1 }]}>
          <Account
            index={wallets.length}
            mnemonic={mnemonic}
            toggleAccountModal={toggleAccountModal}
          />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={assetsRef}
        snapPoints={snapPoints}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleAssetsModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleAssetsChanges}>
        <View style={[{ flex: 1, alignItems: 'center' }]}>
          <Assets wallet={wallet} />
        </View>
      </BottomSheetModal>

    </View>
  )
}

export default History

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})