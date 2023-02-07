import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Jazzicon from 'react-native-jazzicon';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import Account from '@/Components/AccountHeader';
import CustomBackdrop from '@/Components/Backdrop';

import { getItem } from '@/Utils/localstorage';
import { useTheme } from '@/Hooks';

import { RootState } from '@/Store';
import {
  addWallet,
  Network,
  setActiveNetwork,
  setActiveWallet,
  Wallet,
} from '@/Store/web3';
import {
  getBlock,
  getHDWallet,
  recoverPersonalSignature,
  setDefaultAccount,
  signMessage,
  toAscii,
} from '@/Utils/web3/web3';

import { getInjectedJavaScript } from '../services/provider';
import { generateRequest } from '../services/request';
import WebviewError from '../../../Components/WebviewError';
import {
  FileDownloadEvent,
  WebViewError,
  WebViewErrorEvent,
  WebViewMessage,
  WebViewNavigationEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import { Connection, PublicKey } from '@solana/web3.js';
import Chrome from './Chrome';

const HOMEPAGE_URL = 'https://hsyndeniz.github.io/test-dapp-vconsole/';

const NUM_ITEMS = 10;
function getColor(i: number) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

type Item = {
  key: string;
  label: string;
  height: number;
  width: number;
  backgroundColor: string;
};

const initialData: Item[] = [
  {
    key: '0',
    label: '0',
    height: 100,
    width: 100,
    backgroundColor: getColor(0),
    uri: 'https://www.google.com/',
  },
  {
    key: '1',
    label: '1',
    height: 100,
    width: 100,
    backgroundColor: getColor(1),
    uri: 'https://www.opensea.io/',
  },
  {
    key: '2',
    label: '2',
    height: 100,
    width: 100,
    backgroundColor: getColor(2),
    uri: 'https://www.rarible.com/',
  },
].map((d, index) => {
  const backgroundColor = getColor(index);
  return {
    key: `item-${index}`,
    label: String(index) + '',
    height: 100,
    width: 60 + Math.random() * 40,
    backgroundColor,
    uri: d.uri,
  };
});

// TODO: Add url input
// TODO: Add history
// TODO: Add bookmarks
// TODO: Add search
// TODO: Add settings
// TODO: Add get url clipboard suggestion
const Browser = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  let webview = useRef<WebView>(null as any);

  const [modalVisible, setModalVisible] = useState(-1);
  const [networkModalVisible, setNetworkModalVisible] = useState(-1);
  const [accountModalVisible, setAccountModalVisible] = useState(-1);
  const [connectModalVisible, setConnectModalVisible] = useState(-1);
  const [signMessageModalVisible, setSignMessageModalVisible] = useState(-1);

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const networkModalRef = useRef<BottomSheetModal>(null);
  const addAccountRef = useRef<BottomSheetModal>(null);
  const connectAccountRef = useRef<BottomSheetModal>(null);
  const signMessageRef = useRef<BottomSheetModal>(null);

  const url = useRef('');
  const title = useRef('');
  const icon = useRef(null);
  const backgroundBridges = useRef([]);
  const fromHomepage = useRef(false);
  const wizardScrollAdjusted = useRef(false);

  // variables
  const snapPoints = useMemo(() => ['50%', '50%'], []);
  const snapPointsConnect = useMemo(() => ['55%', '60%'], []);
  const snapPointsNetwork = useMemo(() => ['50%', '50%'], []);
  const snapPointsSignMessage = useMemo(() => ['70%', '80%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handlePresentNetworkModalPress = useCallback(() => {
    networkModalRef.current?.present();
  }, []);
  const handlePresentAccountModalPress = useCallback(() => {
    addAccountRef.current?.present();
  }, []);
  const handlePresentConnectModalPress = useCallback(() => {
    connectAccountRef.current?.present();
  }, []);
  const handlePresentSignMessageModalPress = useCallback(() => {
    signMessageRef.current?.present();
  }, []);

  const [accountName, setAccountName] = useState('');
  const [addAccountLoading, setAddAccountLoading] = useState(false);

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const activeNetwork = useSelector(
    (state: RootState) => state.wallet.activeNetwork,
  );
  const state = useSelector((state: RootState) => state);
  const network: Network = state.wallet.networks.find(
    (network: Network) => network.slug === state.wallet.activeNetwork,
  ) as Network;
  const activeWallet = state.wallet.wallets[state.wallet.activeWallet];
  const [injectedJavaScript, setInjectedJavaScript] = useState(null as any);

  const [error, setError] = useState(null as any);
  const [webviewUrl, setWebviewUrl] = useState(HOMEPAGE_URL);
  const [domain, setDomain] = useState('');
  const [messageToSign, setMessageToSign] = useState('');
  const [messageData, setMessageData] = useState({} as any);
  const [permissionMessageData, setPermissionMessageData] = useState({} as any);
  const [viewTabs, setViewTabs] = useState(true);
  // const [dappUrl, setDappUrl] = useState('https://hsyndeniz.github.io/test-dapp-vconsole/');
  const [dappUrl, setDappUrl] = useState('https://rarible.com/');
  const [data, setData] = useState(initialData);

  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  useEffect(() => {
    console.log('chainChanged');
    console.log(activeNetwork);
    console.log(network.chainId);
    console.log(network.networkVersion);
    setInjectedJavaScript(
      getInjectedJavaScript(network.chainId, network.networkVersion),
    );
    // @ts-ignore-next-line
    webview.injectJavaScript(`
      window.ethereum.emit('chainChanged', '${network.chainId}');
      window.ethereum.emit('networkChanged', '${network.networkVersion}');
      window.ethereum.relyNetworkId = '${network.networkVersion}';
      window.ethereum.networkVersion = '${network.networkVersion}';
      window.ethereum.chainId = '${network.chainId}';
      console.log(window.ethereum);
    `);
  }, [activeNetwork]);

  useEffect(() => {
    console.log('accountsChanged');
    // @ts-ignore-next-line
    webview.current &&
      webview.injectJavaScript(
        `window.ethereum.emit('accountsChanged', ['${activeWallet.address}']);`,
      );
  }, [activeWallet.address]);

  const handleWebViewNavigationStateChange = (
    newNavState: WebViewNavigation,
  ) => {
    let navigationState = {
      url: newNavState.url,
      title: newNavState.title,
      loading: newNavState.loading,
      canGoBack: newNavState.canGoBack,
      canGoForward: newNavState.canGoForward,
      lockIdentifier: newNavState.lockIdentifier,
      navigationType: newNavState.navigationType,
      mainDocumentURL: newNavState.mainDocumentURL,
    };
    // console.log(navigationState);
    setCanGoBack(newNavState.canGoBack);
    setCanGoForward(newNavState.canGoForward);
  };

  /**
   * Handle message from website
   */
  const onMessage = ({ nativeEvent }: WebViewMessageEvent) => {
    let data: any = nativeEvent.data;
    // console.log(data);
    data = typeof data === 'string' ? JSON.parse(data) : data;
    console.log(data);
    if (data.permission === 'web3') {
      console.log('web3');
      setMessageData(data);
      toggleConnectModal();
    }
    if (data.type === 'web3-send-async-read-only') {
      console.log('web3-send-async-read-only');
      console.log(data.payload.method);
      if (data.payload.method === 'eth_accounts') {
        console.log('eth_accounts requested read only');
        const request = `
          (function() {
            var __send = function() { 
              if (ReactNativeWebView.onMessage) { 
                ReactNativeWebView.onMessage(JSON.stringify({
                  type: 'web3-send-async-callback',
                  messageId: '${data.messageId}',
                  result: {
                    jsonrpc: "2.0",
                    id: ${data.payload.id},
                    result: ["${activeWallet.address}"]
                  }
                }));
              } else {
                setTimeout(__send, 0)
              }
            }; 
            __send();
          })();`;
        // @ts-ignore-next-line
        webview.injectJavaScript(request);
      } else if (data.payload.method === 'eth_getBlockByNumber') {
        // TODO: complete this
        getBlock('latest', false)
          .then((block: any) => {
            block.transactions = [];
          })
          .catch(error => console.log(error));
        let request = `
        (function() {
          var __send = function() { 
            if (ReactNativeWebView.onMessage) { 
              ReactNativeWebView.onMessage(JSON.stringify({
                type: 'web3-send-async-callback',
                messageId: '${data.messageId}',
                result: {
                  jsonrpc: "2.0",
                  id: ${data.payload.id},
                  result: ["${activeWallet.address}"]
                }
              }));
            } else {
              setTimeout(__send, 0)
            }
          }; 
          __send();
        })();`;

        // console.log(request);
        // @ts-ignore-next-line
        // webview.injectJavaScript(request);
      } else if (data.payload.method === 'wallet_switchEthereumChain') {
        console.log(data.payload.params);
        console.log(data.payload.params[0].chainId);
        // ask user to switch chain. if not available, ask to add chain
        // error {code 4902} "Unrecognized chain ID: Try adding the chain using wallet_addEthereumChain first."
        // dispatch(setActiveNetwork('ethereum'));
        const request = `
        (function() {
          var __send = function() { 
            if (ReactNativeWebView.onMessage) { 
              ReactNativeWebView.onMessage(JSON.stringify({
                type: 'web3-send-async-callback',
                messageId: '${data.messageId}',
                result: {
                  jsonrpc: "2.0",
                  id: ${data.payload.id},
                  result: null
                }
              }));
            } else {
              setTimeout(__send, 0)
            }
          }; 
          __send();
        })();`;
        // @ts-ignore-next-line
        webview.injectJavaScript(request);
      } else if (data.payload.method === 'wallet_addEthereumChain') {
        console.log(data.payload.params);
      } else if (data.payload.method === 'personal_sign') {
        console.log('personal_sign');
        console.log(data.payload.params[1]);
        console.log(data.payload.params[2]);
        const message = toAscii(data.payload.params[0]);
        setMessageToSign(message);
        setPermissionMessageData(data);
        toggleSignMessageModal();
      } else if (data.payload.method === 'personal_ecRecover') {
        console.log('personal_ecRecover');
        const message = toAscii(data.payload.params[0]);
        const address = recoverPersonalSignature(
          message,
          data.payload.params[1],
        );
        console.log(address);
        const request = `
        (function() {
          var __send = function() {
            if (ReactNativeWebView.onMessage) {
              ReactNativeWebView.onMessage(JSON.stringify({
                type: 'web3-send-async-callback',
                messageId: '${data.messageId}',
                result: {
                  jsonrpc: "2.0",
                  id: ${data.payload.id},
                  result: "${address?.toLocaleLowerCase()}"
                }
              }));
            } else {
              setTimeout(__send, 0)
            }
          };
          __send();
        })();`;
        // @ts-ignore-next-line
        webview.injectJavaScript(request);
      }
    }
  };

  const denyConnection = () => {
    let request = `
      (function() {
        var __send = function() { 
          if (ReactNativeWebView.onMessage) { 
            ReactNativeWebView.onMessage(JSON.stringify({
              type: 'api-response',
              isAllowed: false,
              permission: 'web3',
              messageId: '${messageData.messageId}',
            }));
          } else {
            setTimeout(__send, 0)
          }
        }; 
        __send();
      })();`;
    console.log(request);
    // @ts-ignore-next-line
    webview.injectJavaScript(request);
    toggleConnectModal();
  };

  const allowConnection = () => {
    const request = `
      (function() {
        var __send = function() { 
          if (ReactNativeWebView.onMessage) { 
            ReactNativeWebView.onMessage(JSON.stringify({
              type: 'api-response',
              isAllowed: true,
              permission: 'web3',
              messageId: '${messageData.messageId}',
              data: ["${activeWallet.address}"]
            }));
          } else {
            setTimeout(__send, 0)
          }
        }; 
        __send();
      })();`;
    console.log(request);
    // @ts-ignore-next-line
    webview.injectJavaScript(request);
    toggleConnectModal();
  };
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    setModalVisible(index);
  }, []);

  const handleModalChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    setNetworkModalVisible(index);
  }, []);

  const handleAccountChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    setAccountModalVisible(index);
  }, []);

  const handleConnectChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    setConnectModalVisible(index);
  }, []);

  const handleSignMessageChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    setSignMessageModalVisible(index);
  }, []);

  const toggleModal = () => {
    modalVisible === -1
      ? handlePresentModalPress()
      : bottomSheetModalRef.current?.dismiss();
  };
  const toggleNetworkModal = () => {
    networkModalVisible === -1
      ? handlePresentNetworkModalPress()
      : networkModalRef.current?.dismiss();
  };
  const toggleAccountModal = () => {
    accountModalVisible === -1
      ? handlePresentAccountModalPress()
      : addAccountRef.current?.dismiss();
  };
  const toggleConnectModal = () => {
    connectModalVisible === -1
      ? handlePresentConnectModalPress()
      : connectAccountRef.current?.dismiss();
  };
  const toggleSignMessageModal = () => {
    signMessageModalVisible === -1
      ? handlePresentSignMessageModalPress()
      : signMessageRef.current?.dismiss();
  };

  const sign = () => {
    signMessage(messageToSign, activeWallet.privateKey)
      .then((signature: any) => {
        console.log(signature);
        const request = `
      (function() {
        var __send = function() {
          if (ReactNativeWebView.onMessage) {
            ReactNativeWebView.onMessage(JSON.stringify({
              type: 'web3-send-async-callback',
              messageId: '${permissionMessageData.messageId}',
              result: {
                jsonrpc: "2.0",
                id: ${permissionMessageData.payload.id},
                result: "${signature}"
              }
            }));
          } else {
            setTimeout(__send, 0)
          }
        };
        __send();
      })();`;
        // @ts-ignore-next-line
        webview.injectJavaScript(request);
        toggleSignMessageModal();
      })
      .catch((error: any) => console.log(error));
  };

  const denySignature = () => {
    const request = `
      (function() {
        var __send = function() {
          if (ReactNativeWebView.onMessage) {
            ReactNativeWebView.onMessage(JSON.stringify({
              type: 'web3-send-async-callback',
              messageId: '${permissionMessageData.messageId}',
              result: {
                jsonrpc: "2.0",
                id: ${permissionMessageData.payload.id},
                result: null
              }
            }));
          } else {
            setTimeout(__send, 0)
          }
        };
        __send();
      })();`;
    // @ts-ignore-next-line
    webview.injectJavaScript(request);
    toggleSignMessageModal();
  };

  const renderImage = (slug: string) => {
    switch (slug) {
      case 'ethereum':
        return (
          <Image
            style={{ width: 60, height: 60 }}
            source={require('@/Assets/Images/coins/ethereum.png')}
          />
        );
      case 'polygon':
        return (
          <Image
            style={{ width: 60, height: 60 }}
            source={require('@/Assets/Images/coins/polygon.png')}
          />
        );
      case 'bsc':
        return (
          <Image
            style={{ width: 60, height: 60 }}
            source={require('@/Assets/Images/coins/binance.png')}
          />
        );
      case 'avalanche':
        return (
          <Image
            style={{ width: 60, height: 60 }}
            source={require('@/Assets/Images/coins/avalanche.png')}
          />
        );
      default:
        return (
          <View style={{ marginLeft: 6, marginRight: 6, marginVertical: 5 }}>
            <Jazzicon size={48} address={slug} />
          </View>
        );
    }
  };

  // TODO: ENS ethereum name service
  // TODO: move to utils
  const addressAbbreviate = (address: string) => {
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  // TODO: move to utils
  const renderBalance = (balance: string) => {
    const symbol = state.wallet.networks.find(
      (network: Network) => network.slug === state.wallet.activeNetwork,
    )?.nativeCurrency.symbol;
    const iBalance = parseFloat(balance);
    if (iBalance === 0) {
      return `0 ${symbol}`;
    }
    return `${iBalance.toFixed(4)} ${symbol}`;
  };

  const createAccount = async () => {
    setAddAccountLoading(true);
    let mnemonic = state.wallet.mnemonic;
    const index = state.wallet.wallets.length;
    console.log('index');
    console.log(index);
    let HDWallet = getHDWallet(index, mnemonic as string);
    let web3 = setDefaultAccount(HDWallet?.privateKeyString);
    const connection = new Connection('https://api.devnet.solana.com');
    const balance = await web3.eth.getBalance(
      HDWallet?.addressString as string,
    );
    const solBalance = await connection.getBalance(
      new PublicKey(HDWallet?.solana.publicKey as any),
    );

    const account: Wallet = {
      index: index,
      balance: `${web3.utils.fromWei(balance, 'ether')}`,
      // @ts-ignore
      address: HDWallet?.addressString,
      // @ts-ignore
      privateKey: HDWallet?.privateKeyString,
      name: accountName,
      solana: {
        publicKey: HDWallet?.solana.publicKey as string,
        secretKey: HDWallet?.solana.secretKey as string,
        balance: `${solBalance}`,
        name: accountName,
      },
    };

    console.log(account);
    dispatch(addWallet(account));
    setAddAccountLoading(false);
    toggleAccountModal();
  };

  const returnHome = () => {
    go('https://hsyndeniz.github.io/test-dapp-vconsole/');
  };

  const go = (url: string) => {
    const hasProtocol = url.match(/^[a-z]*:\/\//);
    const sanitizedURL = hasProtocol ? url : `$http://${url}`;
    let urlToGo = sanitizedURL;
    urlToGo = sanitizeUrlInput(urlToGo);
    const isEnsUrl = false; // TODO: ENS ethereum name service
    if (isEnsUrl) {
      // redirect to ipfs gateway
    }
    // @ts-ignore-next-line
    webview.injectJavaScript(
      `(function(){window.location.href = '${urlToGo}' })()`,
    );
  };

  const sanitizeUrlInput = (url: string) =>
    url.replace(/'/g, '%27').replace(/[\r\n]/g, '');

  const onLoadStart = ({ nativeEvent }: WebViewNavigationEvent) => {
    // console.log('onLoadStart', nativeEvent);
    // TODO: Show it on address bar
    // TODO: Show loading indicator
    // TODO: add to browser history
  };

  const onLoad = ({ nativeEvent }: WebViewNavigationEvent) => {
    //For iOS url on the navigation bar should only update upon load.
    if (Platform.OS === 'ios') {
      // TODO: Show it on address bar
    }
  };

  const onLoadEnd = ({
    nativeEvent,
  }: WebViewNavigationEvent | WebViewErrorEvent) => {
    // Do not update URL unless website has successfully completed loading.
    if (nativeEvent.loading) {
      return;
    }
    // Use URL to produce real url. This should be the actual website that the user is viewing.
    const urlObj = new URL(nativeEvent.url);
    setWebviewUrl(nativeEvent.url);

    const matches = nativeEvent.url.match(
      /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i,
    );
    const domain = matches && matches[1]; // domain will be null if no match is found

    setDomain(domain as string);

    console.log(`https://www.google.com/s2/favicons?domain=${domain}&sz=${32}`);
    // const { origin, pathname = '', query = '' } = urlObj;
    // const realUrl = `${origin}${pathname}${query}`;
    // Generate favicon.
    // const favicon = `https://api.faviconkit.com/${getHost(realUrl)}/32`;
    // Update navigation bar address with title of loaded url.
    // changeUrl({ ...nativeEvent, url: realUrl, icon: favicon });
    // changeAddressBar({ ...nativeEvent, url: realUrl, icon: favicon });
  };

  const onLoadProgress = ({
    nativeEvent: { progress },
  }: WebViewProgressEvent) => {
    // TODO: Show progress bar
    // console.log(progress);
    //setProgress(progress);
  };

  /**
   * Handle error, for example, ssl certificate error
   */
  const onError = ({ nativeEvent: errorInfo }: WebViewErrorEvent) => {
    console.log(errorInfo);
    setError(errorInfo);
  };

  const onShouldStartLoadWithRequest = ({ url }: any) => {
    // return false if ens url
    // go(url.replace(/^http:\/\//, 'https://'));
    // console.log(url);
    return true;
  };

  const handleOnFileDownload = (event: FileDownloadEvent) => {
    console.log(event);
    // TODO: Download file with RNFS react-native-fetch-blob
  };

  const renderItem = ({ item, drag, isActive }: any) => {
    console.log('renderItem');
    console.log(item);
    return (
      <ScaleDecorator>
        <View
          style={{
            height: 36,
            marginTop: 20,
            marginLeft: 20,
            flexDirection: 'row',
            backgroundColor: colors.ui_01,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            width: Dimensions.get('window').width - 40,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            borderColor: colors.border_02,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderTopWidth: 1,
            borderBottomWidth: 0,
          }}>
          <Image
            resizeMode="contain"
            source={{
              uri: `https://www.google.com/s2/favicons?domain=${
                item.uri
              }&sz=${128}`,
            }}
            style={{ width: 20, height: 20, position: 'absolute', left: 10 }}
          />
          <Text
            style={{
              color: colors.text_01,
              fontSize: 14,
              textAlign: 'left',
              textAlignVertical: 'center',
              position: 'absolute',
              left: 36,
            }}>
            {item.uri
              .replace(/^https?\:\/\//i, '')
              .replace(/^www\./i, '')
              .replace(/\/$/, '')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              console.log('close tab');
            }}
            style={{ position: 'absolute', right: 10, zIndex: 4 }}>
            <Ionicons name="close" size={20} color={colors.text_01} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onLongPress={() => {
            console.log('onLongPress');
            drag();
          }}
          onPress={() => {
            console.log('onPress');
            setViewTabs(false);
            setDappUrl(item.uri);
          }}
          disabled={false}
          style={[
            styles.rowItem,
            {
              backgroundColor: colors.transparent,
              // backgroundColor: isActive ? "red" : item.backgroundColor,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height / 6,
              borderRadius: 10,
            },
          ]}>
          <WebView
            source={{
              uri: item.uri,
              headers: {
                // use it for your fancy home page
                // 'my-custom-header-key': 'my-custom-header-value',
              },
            }}
            allowsLinkPreview={true}
            injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
            mediaPlaybackRequiresUserAction={true}
            nativeConfig={{
              props: {
                scrollEnabled: false,
              },
            }}
            onScroll={console.log}
            scrollEnabled={false}
            originWhitelist={['https://*', 'http://*']}
            decelerationRate={'normal'}
            // @ts-ignore-next-line
            style={{
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              width: Dimensions.get('window').width - 40,
              // height: Dimensions.get('window').height / 3.5,
            }}
            onMessage={onMessage}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            renderError={e => {
              console.log('renderError');
              console.log(e);
              return <WebviewError error={error} returnHome={returnHome} />;
            }}
            onLoadStart={onLoadStart}
            onLoad={onLoad}
            onLoadEnd={onLoadEnd}
            onLoadProgress={onLoadProgress}
            onError={onError}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            sendCookies
            allowsInlineMediaPlayback
            useWebkit
            testID={'browser-webview'}
            applicationNameForUserAgent={'WebView RelyWallet'}
            onFileDownload={handleOnFileDownload}
            overScrollMode={'never'}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 10,
              backgroundColor: colors.transparent,
              opacity: 0,
            }}
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return viewTabs ? (
    <View
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        alignContent: 'center',
        borderColor: colors.border_01,
        borderBottomWidth: 1,
        justifyContent: 'center',
      }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          height: 50,
          width: Dimensions.get('window').width,
          zIndex: 1,
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          borderColor: colors.border_01,
          // borderBottomWidth: 1,
        }}>
        <Text
          style={{
            color: colors.text_01,
            fontSize: 16,
            fontWeight: '500',
            textAlignVertical: 'center',
            alignSelf: 'center',
            textAlign: 'center',
          }}>
          2 Tabs
        </Text>
        <FontAwesome
          style={{
            alignSelf: 'center',
            right: 20,
            position: 'absolute',
            textAlignVertical: 'center',
          }}
          name={'ellipsis-v'}
          size={20}
          color={colors.text_01}
        />
      </View>

      <DraggableFlatList
        contentContainerStyle={{ marginTop: 50, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ width: '100%', height: '100%' }}
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={item => item.key}
        renderItem={renderItem}
      />
    </View>
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <Account
        style={{ marginBottom: 12 }}
        network={network as Network}
        wallet={activeWallet}
        toggleAssetsModal={console.log}
        toggleAccountModal={toggleModal}
      />

      <WebView
        originWhitelist={['https://*', 'http://*']}
        decelerationRate={'normal'}
        // @ts-ignore-next-line
        ref={ref => (webview = ref)}
        source={{
          uri: dappUrl,
          // uri: 'https://bscscan.com/',
          // uri: 'https://chainlist.org/',
          // uri: 'https://opensea.io',
          // uri: 'https://portfolio.metamask.io',
          // uri: 'https://rarible.com',
          // uri: 'https://pancakeswap.finance',
          // uri: 'https://metamask.github.io/test-dapp',
          // uri: 'https://js-eth-sign.surge.sh',
          // uri: 'https://web3-react-mu.vercel.app',
          // uri: 'https://hsyndeniz', // test error page
          // uri: 'https://hsyndeniz.github.io/test-dapp-vconsole/',
          headers: {
            // use it for your fancy home page
            // 'my-custom-header-key': 'my-custom-header-value',
          },
        }}
        style={{ width: '100%', height: '100%', flex: 1 }}
        onMessage={onMessage}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        renderError={e => {
          console.log('renderError');
          console.log(e);
          return <WebviewError error={error} returnHome={returnHome} />;
        }}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
        onLoadStart={onLoadStart}
        onLoad={onLoad}
        onLoadEnd={onLoadEnd}
        onLoadProgress={onLoadProgress}
        onError={onError}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        sendCookies
        javascriptEnabled
        allowsInlineMediaPlayback
        useWebkit
        testID={'browser-webview'}
        applicationNameForUserAgent={'WebView RelyWallet'}
        onFileDownload={handleOnFileDownload}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: colors.background,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderBottomColor: colors.border_01,
          borderBottomWidth: 0,
        }}>
        <TouchableOpacity
          disabled={!canGoBack}
          onPress={() => webview.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={canGoBack ? colors.text : colors.text_02}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canGoForward}
          onPress={() => webview.goForward()}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={canGoForward ? colors.text : colors.text_02}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => webview.reload()}>
          <Ionicons name="reload" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            go(HOMEPAGE_URL);
          }}>
          <Ionicons name="home" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setViewTabs(true);
          }}>
          <Ionicons name="copy-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log('show options');
          }}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <BottomSheetModal
        index={1}
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        stackBehavior="push"
        backdropComponent={(props: any) => (
          <CustomBackdrop dismissModal={toggleModal} {...props} />
        )}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleSheetChanges}>
        <View style={[{ flex: 1 }]}>
          <FlatList
            contentContainerStyle={{ paddingBottom: 50 }}
            ListHeaderComponent={() => (
              <TouchableOpacity
                onPress={toggleNetworkModal}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 24,
                  margin: 20,
                  paddingVertical: 18,
                  borderRadius: 12,
                  borderColor: colors.border_01,
                  borderWidth: 2,
                }}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: colors.positive_01, marginRight: 10 },
                  ]}
                />
                <Text
                  style={{
                    color: colors.text_02,
                    fontSize: 15,
                    fontWeight: '500',
                  }}>
                  {network.name}
                </Text>
                <FontAwesome
                  name="chevron-down"
                  size={13}
                  color={colors.text_02}
                  style={{ marginLeft: 10 }}
                />
                <View style={{ position: 'absolute', right: 20 }}>
                  <AntDesign
                    name="checkcircleo"
                    size={24}
                    color={colors.positive_01}
                  />
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={() => (
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                <TouchableOpacity
                  onPress={() => toggleAccountModal()}
                  style={{
                    backgroundColor: colors.ui_01,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    marginVertical: 5,
                  }}>
                  <Text
                    style={{
                      color: colors.interactive_01,
                      fontSize: 15,
                      fontWeight: '700',
                    }}>
                    {t('Create Account')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleAccountModal()}
                  style={{
                    backgroundColor: colors.ui_01,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    marginVertical: 5,
                  }}>
                  <Text
                    style={{
                      color: colors.interactive_01,
                      fontSize: 15,
                      fontWeight: '700',
                    }}>
                    {t('Import Account')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            data={[...state.wallet.wallets]}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => dispatch(setActiveWallet(index))}
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignContent: 'center',
                  alignItems: 'center',
                  marginVertical: 8,
                  marginHorizontal: 12,
                }}
                key={index}>
                <View
                  style={{ marginLeft: 6, marginRight: 6, marginVertical: 5 }}>
                  <Jazzicon size={48} address={item.address} />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '100%',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ textAlign: 'left', color: colors.text_01 }}>
                      {item.name}
                    </Text>
                    <Text style={{ textAlign: 'left', color: colors.text_02 }}>
                      {addressAbbreviate(item.address)}
                    </Text>
                  </View>
                </View>
                <View style={{ position: 'absolute', right: 30 }}>
                  <Text
                    style={{ textAlign: 'right', color: colors.positive_01 }}>
                    {renderBalance(item.balance)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.address}
          />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={networkModalRef}
        snapPoints={snapPointsNetwork}
        stackBehavior="push"
        backdropComponent={(props: any) => (
          <CustomBackdrop dismissModal={toggleNetworkModal} {...props} />
        )}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleModalChanges}>
        <View style={[{ flex: 1 }]}>
          <Text style={{ textAlign: 'center', color: colors.text_01 }}>
            Networks
          </Text>
          <FlatList
            data={state.wallet.networks}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  dispatch(setActiveNetwork(item.slug));
                  toggleNetworkModal();
                }}
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignContent: 'center',
                  alignItems: 'center',
                  marginVertical: 0,
                  marginHorizontal: 12,
                }}
                key={index}>
                {renderImage(item.slug)}
                <View style={{ marginLeft: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ textAlign: 'left', color: colors.text_01 }}>
                      {item.name}
                    </Text>
                  </View>
                </View>
                {state.wallet.activeNetwork === item.slug && (
                  <View style={{ position: 'absolute', right: 30 }}>
                    <AntDesign
                      name="checkcircleo"
                      size={24}
                      color={colors.positive_01}
                    />
                  </View>
                )}
              </TouchableOpacity>
            )}
            keyExtractor={item => item.slug}
          />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={addAccountRef}
        snapPoints={snapPointsNetwork}
        stackBehavior="push"
        backdropComponent={(props: any) => (
          <CustomBackdrop dismissModal={toggleAccountModal} {...props} />
        )}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleAccountChanges}>
        <View style={[{ flex: 1 }]}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.text_01,
              fontSize: 16,
              fontWeight: '600',
            }}>
            Create Account
          </Text>
          <View
            style={{
              backgroundColor: colors.transparent,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '10%',
            }}>
            <Jazzicon size={64} />
            <BottomSheetTextInput
              onChangeText={(text: any) => setAccountName(text)}
              placeholder="Account Name"
              placeholderTextColor={colors.text_02}
              style={{
                color: colors.text_01,
                backgroundColor: colors.ui_01,
                padding: 10,
                borderRadius: 10,
                width: '80%',
                height: 40,
                marginTop: 20,
              }}
            />
            <TouchableOpacity
              onPress={() => createAccount()}
              style={{
                backgroundColor: colors.interactive_01,
                padding: 10,
                borderRadius: 10,
                width: '60%',
                height: 40,
                marginTop: '10%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {addAccountLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text
                  style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                  Create
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={connectAccountRef}
        snapPoints={snapPointsConnect}
        stackBehavior="push"
        backdropComponent={(props: any) => (
          <CustomBackdrop dismissModal={toggleConnectModal} {...props} />
        )}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleConnectChanges}>
        <View style={[{ flex: 1 }]}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.text_01,
              fontSize: 16,
              fontWeight: '600',
            }}>
            Connect Account
          </Text>
          <View
            style={{
              backgroundColor: colors.transparent,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '10%',
            }}>
            <Image
              resizeMode="contain"
              source={{
                uri: `https://www.google.com/s2/favicons?domain=${domain}&sz=${128}`,
              }}
              style={{ width: 64, height: 64, marginTop: 20 }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              {webviewUrl.startsWith('https://') && (
                <MaterialIcons
                  name="https"
                  size={16}
                  color={colors.positive_01}
                  style={{ textAlign: 'center', textAlignVertical: 'center' }}
                />
              )}
              <Text
                style={{
                  color: colors.positive_01,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginLeft: 3,
                }}>
                {
                  // TODO: Show ssl status
                  domain
                }
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              <View
                style={[styles.dot, { backgroundColor: colors.positive_01 }]}
              />
              <Text style={{ color: colors.interactive_01, marginLeft: 5 }}>
                {network.name}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                textAlign: 'center',
                marginHorizontal: 20,
                marginVertical: 12,
                color: colors.text_02,
              }}>
              By touching connect, you allow this dapp to get your public
              address. Be careful about connecting to dapps you don't trust and
              always check the URL.
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: colors.text_01,
                fontSize: 14,
                fontWeight: '600',
                marginVertical: 12,
              }}>
              {domain} would like to connect to your wallet.
            </Text>
            <View
              style={{
                flexDirection: 'row',
                height: 70,
                minHeight: 70,
                width: '90%',
                flex: 1,
                borderWidth: 2,
                borderColor: colors.border_01,
                borderRadius: 10,
                padding: 10,
              }}>
              <Jazzicon size={48} address={activeWallet.address} />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                  marginLeft: 6,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.text_01,
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                  {activeWallet.name} ({addressAbbreviate(activeWallet.address)}
                  ){' '}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.text_02,
                    fontSize: 13,
                    fontWeight: '500',
                  }}>
                  {activeWallet.balance} {network.nativeCurrency.symbol}{' '}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingHorizontal: 12,
                marginVertical: 20,
              }}>
              <TouchableOpacity
                onPress={() => denyConnection()}
                style={{
                  backgroundColor: 'red',
                  padding: 10,
                  borderRadius: 10,
                  width: '45%',
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                  Deny
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => allowConnection()}
                style={{
                  backgroundColor: colors.interactive_01,
                  padding: 10,
                  borderRadius: 10,
                  width: '45%',
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                  Allow
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={signMessageRef}
        snapPoints={snapPointsSignMessage}
        stackBehavior="push"
        backdropComponent={(props: any) => (
          <CustomBackdrop dismissModal={toggleSignMessageModal} {...props} />
        )}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleSignMessageChanges}>
        <View style={[{ flex: 1 }]}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.text_01,
              fontSize: 16,
              fontWeight: '600',
            }}>
            Sign Message
          </Text>
          <View
            style={{
              backgroundColor: colors.transparent,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '10%',
            }}>
            <Image
              resizeMode="contain"
              source={{
                uri: `https://www.google.com/s2/favicons?domain=${domain}&sz=${128}`,
              }}
              style={{ width: 64, height: 64, marginTop: 20 }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              {webviewUrl.startsWith('https://') && (
                <MaterialIcons
                  name="https"
                  size={16}
                  color={colors.positive_01}
                  style={{ textAlign: 'center', textAlignVertical: 'center' }}
                />
              )}
              <Text
                style={{
                  color: colors.positive_01,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginLeft: 3,
                }}>
                {
                  // TODO: Show ssl status
                  domain
                }
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                margin: 8,
              }}>
              <View
                style={[styles.dot, { backgroundColor: colors.positive_01 }]}
              />
              <Text style={{ color: colors.interactive_01, marginLeft: 5 }}>
                {network.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                height: 70,
                minHeight: 70,
                width: '88%',
                flex: 1,
                borderWidth: 2,
                borderColor: colors.border_01,
                borderRadius: 10,
                padding: 10,
              }}>
              <Jazzicon size={48} address={activeWallet.address} />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                  marginLeft: 6,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.text_01,
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                  {activeWallet.name} ({addressAbbreviate(activeWallet.address)}
                  ){' '}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.text_02,
                    fontSize: 13,
                    fontWeight: '500',
                  }}>
                  {activeWallet.balance} {network.nativeCurrency.symbol}{' '}
                </Text>
              </View>
            </View>
            <ScrollView
              style={{
                borderWidth: 2,
                borderColor: colors.border_01,
                marginHorizontal: 10,
                marginTop: 10,
                paddingHorizontal: 24,
                paddingVertical: 0,
                borderRadius: 10,
                width: '92%',
                minHeight: '24%',
                maxHeight: '50%',
              }}>
              <Text style={{ marginTop: 10, color: colors.text_01 }}>
                Message:
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  textAlign: 'center',
                  color: colors.text_02,
                  marginVertical: 15,
                }}>
                {messageToSign}
              </Text>
            </ScrollView>
            <View
              style={{
                flex: 1,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingHorizontal: 12,
                marginVertical: 20,
              }}>
              <TouchableOpacity
                onPress={() => denySignature()}
                style={{
                  backgroundColor: 'red',
                  padding: 10,
                  borderRadius: 10,
                  width: '45%',
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sign()}
                style={{
                  backgroundColor: colors.interactive_01,
                  padding: 10,
                  borderRadius: 10,
                  width: '45%',
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                  Sign
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default Browser;

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rowItem: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
