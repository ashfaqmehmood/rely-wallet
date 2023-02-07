import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

import { Wallet } from '@/Store/web3';
import { addressAbbreviate } from '@/Utils/web3/web3';
import { AlertHelper } from '@/Utils/alertHelper';
import { useTheme } from '@/Hooks';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CustomBackdrop from '@/Components/Backdrop';

interface AssetsProps {
  wallet: Wallet;
}

const Assets = (props: AssetsProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const modalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%', '60%'], []);

  const [modalVisible, setModalVisible] = useState(-1);
  const [address, setAddress] = useState('');

  const toggleModal = () => {
    modalVisible === -1 ? handlePresentModalPress() : modalRef.current?.dismiss();
  };
  const handleModalChanges = useCallback((index: number) => {
    setModalVisible(index);
  }, []);
  const handlePresentModalPress = useCallback(() => {
    modalRef.current?.present();
  }, []);

  return (
    <>
      <Text style={{ textAlign: 'center', color: colors.text_01, fontSize: 16, fontWeight: '600', marginTop: 12 }}>Receive assets</Text>
      <TouchableOpacity
        onPress={() => {
          Clipboard.setString(props.wallet.address);
          Toast.show({
            type: 'info',
            text1: 'Copied to clipboard',
            text2: props.wallet.address,
          })
        }}
        style={{
          backgroundColor: colors.transparent,
          borderColor: colors.border_01,
          borderWidth: 1,
          width: '90%',
          borderRadius: 10,
          minHeight: 100,
          marginTop: 40,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            paddingHorizontal: 12,
            backgroundColor: colors.transparent,
          }}>
          <Text
            style={{
              textAlign: 'left',
              color: colors.text_01,
              fontSize: 13,
              fontWeight: '600',
              alignSelf: 'flex-start'
            }}>
            Your Ethereum address
          </Text>
          {
            // TODO: Add QR code
            // TODO: Add share
            // TODO: Add popover for info
          }
          <AntDesign style={{ marginLeft: 5 }} name='infocirlce' size={13} color={colors.text_02} />
        </View>
        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 10, marginTop: 10 }}>
          <View style={{ flexDirection: 'column', width: '60%', alignContent: 'flex-start', alignItems: 'flex-start' }}>
            <Text style={{ textAlign: 'left', color: colors.text_02, fontSize: 13 }}>
              {addressAbbreviate(props.wallet.address)}
            </Text>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <Image
                style={{ width: 24, height: 24, alignSelf: 'flex-start', marginTop: 6 }}
                source={require('@/Assets/Images/coins/ethereum.png')} />
              <Image
                style={{ width: 24, height: 24, alignSelf: 'flex-start', marginTop: 6 }}
                source={require('@/Assets/Images/coins/binance.png')} />
              <Image
                style={{ width: 24, height: 24, alignSelf: 'flex-start', marginTop: 6 }}
                source={require('@/Assets/Images/coins/polygon.png')} />
              <Image
                style={{ width: 20, height: 20, alignSelf: 'flex-start', marginTop: 8.5, marginHorizontal: 2 }}
                source={require('@/Assets/Images/coins/arbitrumc.png')} />
              <Image
                style={{ width: 24, height: 24, alignSelf: 'flex-start', marginTop: 6 }}
                source={require('@/Assets/Images/coins/avalanche.png')} />
              <Image
                style={{ width: 20, height: 20, alignSelf: 'flex-start', marginTop: 8, marginHorizontal: 2 }}
                source={require('@/Assets/Images/coins/optimism.png')} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', width: '40%', alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                setAddress(props.wallet.address);
                toggleModal();
              }}
              style={{ backgroundColor: colors.ui_01, margin: 5, height: 36, width: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name='qr-code' size={16} color={colors.text_01} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(props.wallet.address);
                Toast.show({
                  type: 'info',
                  text1: 'Copied to clipboard',
                  text2: props.wallet.address,
                })
              }}
              style={{ backgroundColor: colors.ui_01, margin: 5, height: 36, width: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name='copy-outline' size={16} color={colors.text_01} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Share.open({
                  title: 'Share your Ethereum address',
                  message: props.wallet.address,
                })
              }}
              style={{ backgroundColor: colors.ui_01, margin: 5, height: 36, width: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name='md-share-social-sharp' size={16} color={colors.text_01} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Clipboard.setString(props.wallet.solana.publicKey);
          Toast.show({
            type: 'info',
            text1: 'Copied to clipboard',
            text2: props.wallet.solana.publicKey,
          })
        }}
        style={{
          backgroundColor: colors.transparent,
          borderColor: colors.border_01,
          borderWidth: 1,
          width: '90%',
          borderRadius: 10,
          minHeight: 100,
          marginTop: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            paddingHorizontal: 12,
            backgroundColor: colors.transparent,
          }}>
          <Text
            style={{
              textAlign: 'left',
              color: colors.text_01,
              fontSize: 13,
              fontWeight: '600',
              alignSelf: 'flex-start'
            }}>
            Your Solana address
          </Text>
          <AntDesign style={{ marginLeft: 5 }} name='infocirlce' size={13} color={colors.text_02} />
        </View>
        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 10, marginTop: 10 }}>
          <View style={{ flexDirection: 'column', width: '60%', alignContent: 'flex-start', alignItems: 'flex-start' }}>
            <Text style={{ textAlign: 'left', color: colors.text_02, fontSize: 13, marginRight: 6 }}>
              {addressAbbreviate(props.wallet.solana.publicKey)}
            </Text>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <Image
                style={{ width: 24, height: 24, alignSelf: 'flex-start' }}
                source={require('@/Assets/Images/coins/solana.png')} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', width: '40%', alignContent: 'flex-end', justifyContent: 'flex-end', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                setAddress(props.wallet.solana.publicKey)
                toggleModal();
              }}
              style={{ backgroundColor: colors.ui_01, margin: 5, height: 36, width: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name='qr-code' size={16} color={colors.text_01} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(props.wallet.solana.publicKey);
                AlertHelper.show('success', 'Copied to clipboard', 'Your Solana address has been copied to clipboard');
              }}
              style={{ backgroundColor: colors.ui_01, margin: 5, height: 36, width: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name='copy-outline' size={16} color={colors.text_01} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Share.open({
                  title: 'Share your Solana address',
                  message: props.wallet.solana.publicKey,
                })
              }}
              style={{ backgroundColor: colors.ui_01, margin: 5, height: 36, width: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name='md-share-social-sharp' size={16} color={colors.text_01} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          AlertHelper.show('info', 'Coming soon', 'This feature is not yet available. Stay tuned for updates!');
        }}
        style={{
          backgroundColor: colors.transparent,
          borderColor: colors.border_01,
          borderWidth: 0,
          width: '90%',
          borderRadius: 10,
          minHeight: 50,
          marginTop: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
            paddingHorizontal: 12,
            backgroundColor: colors.transparent,
          }}>
          <Text
            style={{
              textAlign: 'left',
              color: colors.text_01,
              fontSize: 13,
              fontWeight: '600',
              alignSelf: 'flex-start'
            }}>
            Other assets
          </Text>
          <FontAwesome style={{ textAlign: 'right', textAlignVertical: 'center' }} name='chevron-right' size={13} color={colors.text_01} />
        </View>
      </TouchableOpacity>

      <BottomSheetModal
        index={1}
        ref={modalRef}
        snapPoints={snapPoints}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleModalChanges}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <QRCode
            size={200}
            value={address}
            logoSize={70}
            logoBackgroundColor={colors.ui_background}
            logoBorderRadius={35}
            logoMargin={0}
            backgroundColor={colors.ui_background}
            color={colors.text_01}
            logo={address.startsWith('0x') ? require('@/Assets/Images/coins/ethereum.png') : require('@/Assets/Images/coins/solana.png')}
          />
          <Text style={{ color: colors.text_01, fontSize: 13, fontWeight: '600', marginTop: 20 }}>
            Scan this QR code to receive assets
          </Text>

          <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 10, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(address);
                Toast.show({
                  type: 'info',
                  text1: 'Copied to clipboard',
                  text2: address,
                })
              }}
              style={{
                backgroundColor: colors.ui_01,
                margin: 5,
                height: 36,
                borderRadius: 18,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: colors.border_02,
              }}>
              <Text style={{ color: colors.text_01, fontSize: 13, fontWeight: '600', marginRight: 8 }}>
                {addressAbbreviate(address)}
              </Text>
              <Ionicons name='copy-outline' size={16} color={colors.text_01} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Share.open({
                  title: 'Share your address',
                  message: address,
                })
              }}
              style={{
                backgroundColor: colors.ui_01,
                margin: 5,
                height: 36,
                width: 36,
                borderRadius: 18,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.border_02,
                alignItems: 'center'
              }}>
              <Ionicons name='md-share-social-sharp' size={16} color={colors.text_01} />
            </TouchableOpacity>
          </View>

        </View>
      </BottomSheetModal>
    </>
  )
}

export default Assets;

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
});