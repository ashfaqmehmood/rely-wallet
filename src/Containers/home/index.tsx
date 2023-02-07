/* eslint-disable @typescript-eslint/no-shadow */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import Header from '@/Components/AccountHeader';
import CustomBackdrop from '@/Components/Backdrop';
import ActionButton from '@/Components/ActionButton';
import { useTheme } from '@/Hooks';
import { Network } from '@/Store/web3';
import { RootState } from '@/Store/index';

import Accounts from './modals/Accounts';
import Networks from './modals/Networks';
import Account from './modals/Account';
import Assets from './modals/Assets';
import Tabs from './tabs';

// TODO: FeatureHighlight for first time users
const Home: any = () => {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const state = useSelector((state: RootState) => state);
  const { NavigationTheme, Layout } = useTheme();
  const { colors } = NavigationTheme;
  const [, updateState] = useState({});
  const [modalVisible, setModalVisible] = useState(-1);
  const [networkModalVisible, setNetworkModalVisible] = useState(-1);
  const [accountModalVisible, setAccountModalVisible] = useState(-1);
  const [assetsModalVisible, setAssetsModalVisible] = useState(-1);
  const activeWallet = useSelector((state: RootState) => state.wallet.activeWallet);
  const network = state.wallet.networks.find((network: Network) => network.chainId === state.wallet.activeNetwork);
  const wallet = state.wallet.wallets[activeWallet];
  const usd_price = state.wallet.priceQuotes.find((quote: any) => quote.symbol === network?.nativeCurrency.symbol.toLowerCase())?.current_price || null;

  const accountsModalRef = useRef<BottomSheetModal>(null);
  const networksModalRef = useRef<BottomSheetModal>(null);
  const addAccountModalRef = useRef<BottomSheetModal>(null);
  const assetsRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['60%', '80%'], []);
  const snapPointsNetwork = useMemo(() => ['75%', '75%'], []);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const forceRender = React.useCallback(() => updateState({}), []);

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
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });
  }, [navigation]);

  useEffect(() => {
    console.log(`Wallet: ${wallet.address} - ${state.wallet.uniqueId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.balance, state.wallet.activeNetwork, state.wallet.wallets]);

  const renderBackrop = (props: any, dismissFunction: () => void) => {
    return <CustomBackdrop dismissModal={dismissFunction} {...props} />;
  };

  return (
    <SafeAreaView style={styles.contentContainer}>
      <Header network={network as Network} wallet={wallet} toggleAssetsModal={toggleAssetsModal} toggleAccountModal={toggleModal} />
      <View style={styles.header}>
        <Text style={[styles.symbol, { color: colors.text_01 }]}>
          {Number(wallet.balance) % 1 === 0 ? Number(wallet.balance) : Number(wallet.balance).toFixed(6)}
          {` ${network?.nativeCurrency.symbol}`}
        </Text>
        {usd_price && (
          <Text style={[styles.currency, { color: colors.text_02 }]}>
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(Number(wallet.balance) * usd_price)}
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <ActionButton onPress={() => navigation.navigate('ComingSoon' as never)} icon="send" text={t('Send')} size={18} iconType="FontAwesome" />
        <ActionButton onPress={toggleAssetsModal} icon="download" text={t('Receive')} size={18} iconType="AntDesign" />
        <ActionButton onPress={() => navigation.navigate('ComingSoon' as never)} icon="credit-card-alt" text={t('Buy')} size={18} iconType="FontAwesome" />
        <ActionButton onPress={() => navigation.navigate('ComingSoon' as never)} icon="repeat" text={t('Swap')} size={18} iconType="Feather" />
        <ActionButton onPress={() => navigation.navigate('ComingSoon' as never)} icon="swap-horizontal-variant" text={t('Bridge')} size={18} iconType="MaterialCommunityIcons" />
      </View>

      <Tabs />

      <BottomSheetModal
        index={0}
        ref={accountsModalRef}
        snapPoints={snapPoints}
        stackBehavior="push"
        backdropComponent={(props: any) => renderBackrop(props, toggleModal)}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleAccountsChanges}>
        <View style={Layout.fill}>
          <Accounts
            network={network as Network}
            toggleModal={toggleModal}
            toggleAccountModal={toggleAccountModal}
            toggleNetworkModal={toggleNetworkModal}
            wallets={state.wallet.wallets}
          />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={0}
        ref={networksModalRef}
        snapPoints={snapPointsNetwork}
        stackBehavior="push"
        backdropComponent={(props: any) => renderBackrop(props, toggleNetworkModal)}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleNetworksChanges}>
        <View style={Layout.fill}>
          <Networks network={network as Network} networks={state.wallet.networks} toggleNetworkModal={toggleNetworkModal} toggleAccountModal={toggleModal} />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={addAccountModalRef}
        snapPoints={snapPointsNetwork}
        stackBehavior="push"
        backdropComponent={(props: any) => renderBackrop(props, toggleAccountModal)}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleAccountChanges}>
        <View style={Layout.fill}>
          <Account index={state.wallet.wallets.length} mnemonic={state.wallet.mnemonic} toggleAccountModal={toggleAccountModal} />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={assetsRef}
        snapPoints={useMemo(() => ['60%', '60%'], [])}
        stackBehavior="push"
        backdropComponent={(props: any) => renderBackrop(props, toggleAssetsModal)}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleAssetsChanges}>
        <View style={[Layout.fill, Layout.alignItemsCenter]}>
          <Assets wallet={wallet} />
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  symbol: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  currency: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 12,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
