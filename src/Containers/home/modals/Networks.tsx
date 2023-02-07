import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';

import { Network, setActiveNetwork } from '@/Store/web3';
import { getTokenIcon } from '@/Utils/tokenIcons';
import { useTheme } from '@/Hooks';

interface BottomSheetProps {
  networks: Array<Network>;
  network: Network;
  toggleNetworkModal: any;
  toggleAccountModal: any;
}

// TODO: Add other networks images
const renderImage = (symbol: string) => {
  return (
    <FastImage
      defaultSource={require('@/Assets/Images/blockie.png')}
      style={{
        width: getTokenIcon(symbol).url ? 60 : 48,
        height: getTokenIcon(symbol).url ? 60 : 48,
        borderRadius: getTokenIcon(symbol).url ? 30 : 24,
        marginHorizontal: getTokenIcon(symbol).url ? 0 : 8,
        marginVertical: getTokenIcon(symbol).url ? 0 : 6,
        ...getTokenIcon(symbol).style
      }}
      source={getTokenIcon(symbol).url ? getTokenIcon(symbol).url : require('@/Assets/Images/blockie.png')} />
  )
};

const Networks = (props: BottomSheetProps) => {
  const dispatch = useDispatch();
  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  return (
    <>
      <Text style={{ textAlign: 'center', color: colors.text_01 }}>Networks</Text>
      <FlatList
        data={props.networks}
        // estimatedItemSize={58}
        // TODO: Add custom networks (footer component)
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              dispatch(setActiveNetwork(item.chainId));
              props.toggleNetworkModal();
              props.toggleAccountModal();
            }}
            style={{ flexDirection: 'row', width: '100%', alignContent: 'center', alignItems: 'center', marginVertical: 0, marginHorizontal: 12 }}
            key={index}>
            {renderImage(item.nativeCurrency.symbol)}
            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', width: '100%', alignContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'left', color: colors.text_01 }}>{item.name}</Text>
              </View>
            </View>
            {props.network.chainId === item.chainId && (
              <View style={{ position: 'absolute', right: 30 }}>
                <AntDesign name='checkcircleo' size={24} color={colors.positive_01} />
              </View>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item.chainId + index}
      />
    </>
  )
}

export default Networks;

const styles = StyleSheet.create({});