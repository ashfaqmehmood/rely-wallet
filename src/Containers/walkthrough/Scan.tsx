import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  BarcodeFormat,
  scanBarcodes,
  Barcode,
} from 'vision-camera-code-scanner';
import { useNavigation } from '@react-navigation/native';
import { runOnJS } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { setMnemonic } from '@/Store/web3';
import { AlertHelper } from '@/Utils/alertHelper';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';

const Scan = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const device = devices.back;

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], {
      checkInverted: true,
    });
    runOnJS(setBarcodes)(detectedBarcodes);
  }, []);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      // TODO: handle status | ask again if permission was denied
      console.log(status);
      setHasPermission(status === 'authorized');
      if (status === 'denied') {
        AlertHelper.show(
          'error',
          t('scan.permission'),
          t('scan.permissionDenied'),
        );
        // go to settings to enable permission
        Camera.requestCameraPermission();
      }
    })();
  }, []);

  return (
    device != null &&
    hasPermission && (
      <>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />

        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => navigation.goBack()}>
          <Icon name="close" size={30} color="#fff" />
        </TouchableOpacity>

        <View style={{ width: '100%', height: '100%', opacity: 0.1 }}>
          {barcodes.map((barcode, idx) => {
            let seedPhrase = String(barcode.rawValue).trimStart().trimEnd();
            dispatch(setMnemonic(seedPhrase));
            // @ts-ignore
            navigation.navigate('ImportWallet');
            return null;
          })}
        </View>
      </>
    )
  );
};

export default Scan;

const styles = StyleSheet.create({
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  closeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 4,
  },
});
