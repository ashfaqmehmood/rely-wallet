import React, { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Jazzicon from 'react-jazzicon';
import makeBlockie from 'ethereum-blockies-base64';
import { RootState } from '@/Store';
import { useTheme } from '@/Hooks';
import { useDispatch, useSelector } from 'react-redux';
import { Network, Wallet } from '@/Store/web3';
import { AlertHelper } from '@/Utils/alertHelper';

type Props = {
  toggleAccountModal: () => void;
  toggleAssetsModal?: () => void;
  wallet: Wallet;
  network: Network;
  style?: any;
};

const Account: React.FunctionComponent<Props> = ({ toggleAccountModal, toggleAssetsModal, wallet, network, style = {} }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { darkMode, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => {
          // @ts-ignore
          navigation.toggleDrawer();
        }}>
        <Image style={{ width: 48, height: 48, borderRadius: 24 }} source={{ uri: makeBlockie(wallet.address) }} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => toggleAccountModal()}
        style={styles.labelContainer}>
        <Text
          style={{
            color: colors.text_01,
            fontWeight: '600',
            fontSize: 16
          }}>
          {wallet.name}
        </Text>
        <View style={styles.networkContainer}>
          <View style={[styles.dot, { backgroundColor: colors.positive_01 }]} />
          <Text style={{ color: colors.text_02, fontSize: 12, marginLeft: 5 }}>
            {network.name}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{
        alignContent: 'center',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        flexDirection: 'row',
        position: 'absolute',
        right: 8,
      }}>
        <TouchableOpacity
          onPress={toggleAssetsModal}
          style={{ marginHorizontal: 8 }}>
          <Ionicons style={{ fontWeight: 'bold' }} name='copy-outline' size={25} color={colors.text_01} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            AlertHelper.show('info', 'Coming soon', 'This feature is not yet available. Stay tuned for updates!');
          }}
          style={{ marginHorizontal: 8 }}>
          <Ionicons style={{ fontWeight: 'bold' }} name='scan' size={25} color={colors.text_01} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            AlertHelper.show('info', 'Coming soon', 'This feature is not yet available. Stay tuned for updates!');
          }}
          style={{ marginHorizontal: 8 }}>
          <Ionicons style={{ fontWeight: 'bold' }} name='notifications-outline' size={25} color={colors.text_01} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Account

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    paddingLeft: 10,
    marginTop: 10
  },
  labelContainer: {
    alignContent: 'center',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 10
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  networkContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  }
})