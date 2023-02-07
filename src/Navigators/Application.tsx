import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { Platform, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import DropdownAlert from 'react-native-dropdownalert';
import { useSelector, useDispatch } from 'react-redux';
import { enableScreens } from 'react-native-screens';
import * as Sentry from '@sentry/react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';

import AccountAvatar from '@/Components/AccountAvatar';
import { Network, setPriceQuotes, Wallet } from '@/Store/web3';
import { AlertHelper } from '@/Utils/alertHelper';
import { navigationRef } from '@/Navigators/utils';
import { StackNavigator } from '@/Navigators/Main';
import { RootState } from '@/Store';
import { useTheme } from '@/Hooks';

const Drawer = createDrawerNavigator();

const ApplicationNavigator = () => {
  const dispatch = useDispatch();
  const { Layout, darkMode, NavigationTheme } = useTheme()
  const { colors } = NavigationTheme;

  const activeNetwork = useSelector((state: RootState) => state.wallet.activeNetwork);
  const activeWallet = useSelector((state: RootState) => state.wallet.activeWallet);
  const network = useSelector((state: RootState) => state.wallet.networks.find((network: any) => network.chainId === activeNetwork) as Network);
  const wallet = useSelector((state: RootState) => state.wallet.wallets[activeWallet] as Wallet);

  useEffect(() => {
    enableScreens();
  }, [])

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false').then((result) => {
      dispatch(setPriceQuotes(result.data));
    }).catch((err) => {
      console.log('coingecko error');
      console.log(err);
      Sentry.captureException(err);
    });
  }, [])

  return (
    <>
      <BottomSheetModalProvider>
        <NavigationContainer
          // TODO: fix types
          // @ts-ignore
          theme={NavigationTheme}
          ref={navigationRef}>
          <SafeAreaView style={[Layout.fill, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
            <DrawerNavigator wallet={wallet} network={network} colors={colors} />
          </SafeAreaView>
        </NavigationContainer>
      </BottomSheetModalProvider>
      <Toast />
      <DropdownAlert
        defaultContainer={{
          paddingHorizontal: 8,
          paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 8,
          paddingBottom: 8,
          flexDirection: 'row',
          zIndex: 10,
        }}
        ref={ref => AlertHelper.setDropDown(ref)}
        onClose={() => AlertHelper.invokeOnClose()}
      />
    </>
  )
}

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView contentContainerStyle={{ flex: 1, height: '100%', width: '100%' }} {...props}>
      <AccountAvatar style={{ maxHeight: 80 }} toggleAccountModal={console.log} network={props.network} wallet={props.wallet} />
      <View style={{
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 20,
        bottom: 16,
        position: 'absolute',
        justifyContent: 'space-between'
      }}>
        <Text style={{ color: props.colors.text_02 }}>
          Version 1.0.0
        </Text>
      </View>
      <DrawerItemList {...props} />
      {
        // add icons to drawer items
      }
      <DrawerItem label="Help" onPress={() => console.log('Link to help')} />
      <DrawerItem label="Settings" onPress={() => console.log('Link to settings')} />
      <DrawerItem label="View on Explorer" onPress={() => console.log('Link to help')} />
      <DrawerItem label="Feedback" onPress={() => console.log('Link to help')} />
      <DrawerItem label="Lock Wallet" onPress={() => console.log('Link to help')} />
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = ({ colors, wallet, network }: any) => {
  return (
    <Drawer.Navigator
      initialRouteName={'Main'}
      drawerContent={(props) => <CustomDrawerContent colors={colors} wallet={wallet} network={network} {...props} />}>
      {/* <Drawer.Screen
        name="Startup"
        component={StartupContainer}
        options={{
          headerShown: false
        }}
      /> */}
      <Drawer.Screen
        name="Main"
        component={StackNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  )
}

export default ApplicationNavigator
