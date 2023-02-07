import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Jazzicon from 'react-native-jazzicon';
// import Blockies from 'react-native-blockies';
import { RootState } from '@/Store';
import { useTheme } from '@/Hooks';
import { useDispatch, useSelector } from 'react-redux';
import { Network, Wallet } from '@/Store/web3';

type Props = {
  toggleAccountModal: () => void;
  wallet: Wallet;
  network: Network;
  style?: any;
};

const AccountAvatar: React.FunctionComponent<Props> = ({ toggleAccountModal, wallet, network, style = {} }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { darkMode, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => {
          // @ts-ignore
          // navigation.toggleDrawer();
        }}>
        <Jazzicon size={64} address={wallet.address} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => toggleAccountModal()}
        style={styles.labelContainer}>
        <Text
          style={{
            color: colors.text_01,
            textAlign: 'center',
            textAlignVertical: 'center',
            fontWeight: '600',
            fontSize: 16
          }}>
          {wallet.name}
        </Text>
        <View style={styles.networkContainer}>
          <View style={[styles.dot, { backgroundColor: colors.positive_01 }]} />
          <Text style={{ 
              color: colors.text_02,
              fontSize: 12,
              marginLeft: 5,
              textAlign: 'center',
              textAlignVertical: 'center', 
              }}>
            {network.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default AccountAvatar

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 50
  },
  labelContainer: {
    alignContent: 'center',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0
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
    justifyContent: 'center',
    marginTop: 2,
  }
})