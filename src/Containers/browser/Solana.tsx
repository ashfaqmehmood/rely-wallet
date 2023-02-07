import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, SafeAreaView, Platform, TextInput } from 'react-native';
import { FileDownloadEvent, WebViewErrorEvent, WebViewNavigationEvent, WebViewProgressEvent } from 'react-native-webview/lib/WebViewTypes';
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import makeBlockie from 'ethereum-blockies-base64';
import { ProgressBar } from 'react-native-ui-lib';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';

import Accounts from '@/Containers/home/modals/Accounts';
import Networks from '@/Containers/home/modals/Networks';
import Account from '@/Containers/home/modals/Account';
import Assets from '@/Containers/home/modals/Assets';
import Connect from './modals/Connect';
import SignMessage from './modals/SignMessage';
import CustomBackdrop from '@/Components/Backdrop';
import WebviewError from '@/Components/WebviewError';

import { Network, Wallet } from '@/Store/web3';
import { getBlock, recoverPersonalSignature, signMessage, toAscii } from '@/Utils/web3/web3';
import { getInjectedJavaScript } from '@/Containers/browser/services/provider';
import { generateRequest } from '@/Containers/browser/services/request';
import { AlertHelper } from '@/Utils/alertHelper';
import { HOMEPAGE_URL } from '@/Utils/constants';
import { useTheme } from '@/Hooks';
import { RootState } from '@/Store';
import BrowserTabs from './modals/BrowserTabs';
import BrowserOptions from './modals/BrowserOptions';
import { getInjectedJavaScriptSol } from './services/solProvider';
import { PublicKey } from '@solana/web3.js';

// TODO: Add history
// TODO: Add bookmarks
// TODO: Add get url clipboard suggestion
// TODO: Welcome hints for new users
const Solana = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { NavigationTheme, darkMode } = useTheme();
  const { colors } = NavigationTheme;

  const activeNetwork = useSelector((state: RootState) => state.wallet.activeNetwork);
  const state = useSelector((state: RootState) => state);
  const network: Network = state.wallet.networks.find((network: Network) => network.chainId === state.wallet.activeNetwork) as Network;
  const wallet: Wallet = state.wallet.wallets[state.wallet.activeWallet];

  let webview = useRef<WebView>(null as any);

  const [webviewUrl, setWebviewUrl] = useState(HOMEPAGE_URL);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [domain, setDomain] = useState('');
  const [error, setError] = useState(null as any);
  const [injectedJavaScript, setInjectedJavaScript] = useState(null as any);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const [messageToSign, setMessageToSign] = useState('');
  const [messageData, setMessageData] = useState({} as any);
  const [permissionMessageData, setPermissionMessageData] = useState({} as any);

  const [accountsModalVisible, setAccountsModalVisible] = useState(-1);
  const [networkModalVisible, setNetworkModalVisible] = useState(-1);
  const [accountModalVisible, setAccountModalVisible] = useState(-1);
  const [assetsModalVisible, setAssetsModalVisible] = useState(-1);
  const [connectModalVisible, setConnectModalVisible] = useState(-1);
  const [signMessageModalVisible, setSignMessageModalVisible] = useState(-1);
  const [tabsModalVisible, setTabsModalVisible] = useState(-1);
  const [optionsModalVisible, setOptionsModalVisible] = useState(-1);

  const accountModalRef = useRef<BottomSheetModal>(null);
  const networkModalRef = useRef<BottomSheetModal>(null);
  const addAccountRef = useRef<BottomSheetModal>(null);
  const assetsRef = useRef<BottomSheetModal>(null);
  const tabsRef = useRef<BottomSheetModal>(null);
  const optionsRef = useRef<BottomSheetModal>(null);
  const connectAccountRef = useRef<BottomSheetModal>(null);
  const signMessageRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['60%', '60%'], []);
  const snapPointsConnect = useMemo(() => ['55%', '60%'], []);
  const snapPointsNetwork = useMemo(() => ['60%', '60%'], []);
  const snapPointsSignMessage = useMemo(() => ['70%', '80%'], []);
  const snapPointsOptions = useMemo(() => ['60%', '60%'], []);
  const snapPointsTabs = Platform.OS === 'ios' ? useMemo(() => ['86%', '86%'], []) : useMemo(() => ['90%', '90%'], []);

  const handlePresentAccountsModal = useCallback(() => {
    accountModalRef.current?.present();
  }, []);
  const handlePresentNetworksModal = useCallback(() => {
    networkModalRef.current?.present();
  }, []);
  const handlePresentAddAccountModal = useCallback(() => {
    addAccountRef.current?.present();
  }, []);
  const handlePresentConnectModalPress = useCallback(() => {
    connectAccountRef.current?.present();
  }, []);
  const handlePresentSignMessageModalPress = useCallback(() => {
    signMessageRef.current?.present();
  }, []);
  const handlePresentTabsModalPress = useCallback(() => {
    tabsRef.current?.present();
  }, []);
  const handlePresentOptionsModalPress = useCallback(() => {
    optionsRef.current?.present();
  }, []);

  const handleAccountsChanges = useCallback((index: number) => {
    setAccountsModalVisible(index);
  }, []);
  const handleNetworkChanges = useCallback((index: number) => {
    setNetworkModalVisible(index);
  }, []);
  const handleAccountChanges = useCallback((index: number) => {
    setAccountModalVisible(index);
  }, []);
  const handleAssetsChanges = useCallback((index: number) => {
    setAssetsModalVisible(index);
  }, []);
  const handleConnectChanges = useCallback((index: number) => {
    setConnectModalVisible(index);
  }, []);
  const handleSignMessageChanges = useCallback((index: number) => {
    setSignMessageModalVisible(index);
  }, []);
  const handlePresentAssetsModalPress = useCallback(() => {
    assetsRef.current?.present();
  }, []);
  const handleTabsChanges = useCallback((index: number) => {
    setTabsModalVisible(index);
  }, []);
  const handleOptionsChanges = useCallback((index: number) => {
    setOptionsModalVisible(index);
  }, []);

  const toggleAccountsModal = () => {
    accountsModalVisible === -1 ? handlePresentAccountsModal() : accountModalRef.current?.dismiss();
  };
  const toggleNetworkModal = () => {
    networkModalVisible === -1 ? handlePresentNetworksModal() : networkModalRef.current?.dismiss();
  };
  const toggleAccountModal = () => {
    accountModalVisible === -1 ? handlePresentAddAccountModal() : addAccountRef.current?.dismiss();
  };
  const toggleAssetsModal = () => {
    assetsModalVisible === -1 ? handlePresentAssetsModalPress() : assetsRef.current?.dismiss();
  };
  const toggleConnectModal = () => {
    connectModalVisible === -1 ? handlePresentConnectModalPress() : connectAccountRef.current?.dismiss();
  };
  const toggleSignMessageModal = () => {
    signMessageModalVisible === -1 ? handlePresentSignMessageModalPress() : signMessageRef.current?.dismiss();
  };
  const toggleTabsModal = () => {
    tabsModalVisible === -1 ? handlePresentTabsModalPress() : tabsRef.current?.dismiss();
  };
  const toggleOptionsModal = () => {
    optionsModalVisible === -1 ? handlePresentOptionsModalPress() : optionsRef.current?.dismiss();
  };

  useEffect(() => {
    setInjectedJavaScript(getInjectedJavaScriptSol(network.chainId, network.networkVersion));
    console.log('imported solana provider');
    webview.injectJavaScript(`
      console.log('injected solana provider');
      console.log(window.solana);
      console.log(window.phantom);
    `);
  }, [network.chainId, network.networkVersion]);

  useEffect(() => {
    console.log('chainChanged');
    // @ts-ignore-next-line
    // webview.injectJavaScript(`
    //   window.ethereum.emit('chainChanged', '${network.chainId}');
    //   window.ethereum.emit('networkChanged', '${network.networkVersion}');
    //   window.ethereum.relyNetworkId = '${network.networkVersion}';
    //   window.ethereum.networkVersion = '${network.networkVersion}';
    //   window.ethereum.chainId = '${network.chainId}';
    //   console.log(window.ethereum);
    // `);
  }, [activeNetwork, activeTab]);

  useEffect(() => {
    console.log('accountsChanged');
    // @ts-ignore-next-line
    // webview.injectJavaScript(`window.ethereum.emit('accountsChanged', ['${wallet.address}']);`);
  }, [wallet.address]);

  /**
   * Handle messages from website
   */
  const onMessage = ({ nativeEvent }: WebViewMessageEvent) => {
    let data: any = nativeEvent.data;
    data = typeof data === 'string' ? JSON.parse(data) : data;
    console.log(data);
    if (data.permission === 'web3') {
      console.log('web3');
      setMessageData(data);
      toggleConnectModal();
    }
    if (data.type === 'web3-send-async-read-only') {
      if (data.payload.method === 'eth_accounts') {
        const request = `
          (function() {
            if (ReactNativeWebView.onMessage) { 
              ReactNativeWebView.onMessage(JSON.stringify({
                type: 'web3-send-async-callback',
                messageId: '${data.messageId}',
                result: {
                  jsonrpc: "2.0",
                  id: ${data.payload.id},
                  result: ["${wallet.address}"]
                }
              }));
            } else {
              console.log('ReactNativeWebView.onMessage is not defined');
            }
          })();`;
        // @ts-ignore-next-line
        webview.injectJavaScript(request);
      } else if (data.payload.method === 'eth_getBlockByNumber') {
        getBlock('latest', false)
          .then((block: any) => {
            // TODO: complete this response
          })
          .catch(error => console.log(error));
      } else if (data.payload.method === 'wallet_switchEthereumChain') {
        console.log(data.payload.params);
        console.log(data.payload.params[0].chainId);
        /*
          TODO:
            Create a modal to ask the user to switch the network
            If user reject: error {code 4902} "Unrecognized chain ID: Try adding the chain using wallet_addEthereumChain first."
            If user approve: dispatch(setActiveNetwork('ethereum'));
            If network is not available: ask user to add the network
            injectJavaScript chainChanged with the new chainId
        */
      } else if (data.payload.method === 'wallet_addEthereumChain') {
        console.log(data.payload.params);
      } else if (data.payload.method === 'personal_sign') {
        const message = toAscii(data.payload.params[0]);
        setMessageToSign(message);
        setPermissionMessageData(data);
        toggleSignMessageModal();
      } else if (data.payload.method === 'personal_ecRecover') {
        const message = toAscii(data.payload.params[0]);
        const address = recoverPersonalSignature(message, data.payload.params[1]);
        const request = `
        (function() {
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
            console.log('ReactNativeWebView.onMessage is not defined');
          }
        })();`;
        // @ts-ignore-next-line
        webview.injectJavaScript(request);
      }
    }
  };

  const web3Actions = {
    denyConnection: () => {
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
    },
    allowConnection: () => {
      const publicKey = new PublicKey(wallet.solana.publicKey);
      console.log(publicKey);
      const request = `
        (function() {
          var __send = function() { 
            try {
              if (ReactNativeWebView.onMessage) { 
                ReactNativeWebView.onMessage(JSON.stringify({
                  type: 'api-response',
                  isAllowed: true,
                  permission: 'web3',
                  messageId: '${messageData.messageId}',
                  data: {
                    publicKey: "${publicKey.toBase58()}",
                  }
                }));
              } else {
                setTimeout(__send, 0)
              }
            } catch (error) {
              console.log(error);
            }
          }; 
          __send();
        })();`;
      console.log(request);
      // @ts-ignore-next-line
      webview.injectJavaScript(request);
      toggleConnectModal();
    },
    sign: () => {
      signMessage(messageToSign, wallet.privateKey)
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
    },
    denySignature: () => {
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
    },
  };

  const returnHome = () => {
    go('https://g3yx7p.csb.app');
  };

  const validURL = (uri: string) => {
    let url_pattern = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!&',;=.+]+$/g);
    return !!url_pattern.test(uri);
  };

  const go = (url: string) => {
    if (validURL(url)) {
      const hasProtocol = url.match(/^[a-z]*:\/\//);
      const sanitizedURL = hasProtocol ? url : `https://${url}`;
      let urlToGo = sanitizedURL;
      urlToGo = sanitizeUrlInput(urlToGo);
      console.log(sanitizedURL);
      console.log(urlToGo);
      const isEnsUrl = false; // TODO: ENS ethereum name service
      if (isEnsUrl) {
        // TODO: redirect to ipfs gateway
      }
      // @ts-ignore-next-line
      webview.injectJavaScript(`(function(){window.location.href = '${urlToGo}' })()`);
    } else {
      // @ts-ignore-next-line
      webview.injectJavaScript(`(function(){window.location.href = 'https://www.google.com/search?q=${escape(url)}&client=rely-wallet' })()`);
    }
  };

  const sanitizeUrlInput = (url: string) => {
    return url.replace(/'/g, '%27').replace(/[\r\n]/g, '');
  };

  const onLoadStart = ({ nativeEvent }: WebViewNavigationEvent) => {
    setLoading(true);
  };

  const onLoad = ({ nativeEvent }: WebViewNavigationEvent) => {
    console.log(nativeEvent);
  };

  const onLoadEnd = ({ nativeEvent }: WebViewNavigationEvent | WebViewErrorEvent) => {
    // TODO: add to history
    if (nativeEvent.loading) {
      return;
    }

    const matches = nativeEvent.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    const domain = matches && matches[1];

    setWebviewUrl(nativeEvent.url);
    setDomain(domain as string);
    setLoading(false);
  };

  const onLoadProgress = ({ nativeEvent: { progress } }: WebViewProgressEvent) => {
    setProgress(progress * 100);
  };

  const onError = ({ nativeEvent: errorInfo }: WebViewErrorEvent) => {
    setError(errorInfo);
  };

  const onShouldStartLoadWithRequest = ({ url }: any) => {
    console.log(url);
    console.log('onShouldStartLoadWithRequest');
    // return false if ens url and redirect to ipfs gateway
    // go(url.replace(/^http:\/\//, 'https://'));
    // console.log(url);
    return true;
  };

  const handleOnFileDownload = (event: FileDownloadEvent) => {
    console.log(event);
    // TODO: Download file with RNFS react-native-fetch-blob
  };

  const handleWebViewNavigationStateChange = (newNavState: WebViewNavigation) => {
    setCanGoBack(newNavState.canGoBack);
    setCanGoForward(newNavState.canGoForward);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          {
            borderBottomColor: colors.border_01,
            backgroundColor: darkMode ? colors.ui_background : '#ffffff',
          },
        ]}>
        <View style={[styles.urlContainer, { backgroundColor: colors.ui_01 }]}>
          {webviewUrl.startsWith('https://') && <MaterialIcons name="https" size={16} color={colors.positive_01} style={styles.https} />}
          <TextInput
            placeholder="Search or enter address"
            placeholderTextColor={colors.text_02}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="default"
            selectTextOnFocus={true}
            onSubmitEditing={e => go(e.nativeEvent.text)}
            onFocus={() => {
              /*
                TODO: Show suggestions
                create a list of suggestions based on the history and bookmarks
                show the list
              */
            }}
            style={{
              height: 40,
              color: colors.text_01,
              backgroundColor: colors.transparent,
              maxWidth: '80%',
              overflow: 'hidden',
              marginLeft: 8,
            }}
            onChangeText={text => setWebviewUrl(text)}
            value={webviewUrl.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/$/, '')}
          />
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore-next-line
              webview.reload();
            }}
            style={{ position: 'absolute', right: 12 }}>
            <Ionicons name="reload" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => toggleAccountsModal()} style={styles.accountIconContainer}>
          <Image
            source={{ uri: makeBlockie(wallet.address) }}
            style={{
              alignSelf: 'center',
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: darkMode ? 1 : 2,
              borderColor: darkMode ? colors.text_01 : colors.text_03,
            }}
          />
        </TouchableOpacity>
      </View>
      {loading && <ProgressBar progress={progress} progressColor={colors.icon_04} style={{ borderRadius: 0, height: 5 }} />}

      <WebView
        originWhitelist={['https://*', 'http://*']}
        decelerationRate={'normal'}
        // @ts-ignore-next-line
        ref={ref => (webview = ref)}
        setSupportMultipleWindows={false}
        source={{
          uri: 'https://g3yx7p.csb.app',
          headers: {
            // use this for your fancy home page
            // 'my-custom-header-key': 'my-custom-header-value',
          },
        }}
        style={styles.webView}
        onMessage={onMessage}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
        onLoadStart={onLoadStart}
        onLoad={onLoad}
        onLoadEnd={onLoadEnd}
        onLoadProgress={onLoadProgress}
        onError={onError}
        javaScriptCanOpenWindowsAutomatically={false}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        renderError={e => {
          return <WebviewError error={error} returnHome={returnHome} />;
        }}
        sendCookies
        javascriptEnabled
        allowsInlineMediaPlayback
        useWebkit
        testID={'browser-webview'}
        applicationNameForUserAgent={'WebView RelyWallet'}
        onFileDownload={handleOnFileDownload}
      />
      <View style={[styles.menu, { backgroundColor: colors.ui_background }]}>
        <TouchableOpacity disabled={!canGoBack} onPress={() => webview.goBack()}>
          <Ionicons name="chevron-back" size={24} color={canGoBack ? colors.text : colors.text_02} />
        </TouchableOpacity>
        <TouchableOpacity disabled={!canGoForward} onPress={() => webview.goForward()}>
          <Ionicons name="chevron-forward" size={24} color={canGoForward ? colors.text : colors.text_02} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            AlertHelper.show('info', 'Coming soon', 'This feature is not available yet');
          }}>
          <Ionicons name="search" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            go('https://g3yx7p.csb.app');
          }}>
          <AntDesign name="home" size={23} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            toggleTabsModal();
          }}>
          <Ionicons name="copy-outline" size={23} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log('show options');
            toggleOptionsModal();
          }}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <BottomSheetModal
        index={1}
        ref={accountModalRef}
        snapPoints={snapPoints}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleAccountsModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleAccountsChanges}>
        <View style={[{ flex: 1 }]}>
          <Accounts
            network={network as Network}
            toggleModal={toggleAccountsModal}
            toggleAccountModal={toggleAccountModal}
            toggleNetworkModal={toggleNetworkModal}
            wallets={state.wallet.wallets}
          />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={networkModalRef}
        snapPoints={snapPointsNetwork}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleNetworkModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleNetworkChanges}>
        <View style={{ flex: 1 }}>
          <Networks network={network as Network} networks={state.wallet.networks} toggleAccountModal={toggleAccountModal} toggleNetworkModal={toggleNetworkModal} />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={addAccountRef}
        snapPoints={snapPointsNetwork}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleAccountModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleAccountChanges}>
        <View style={{ flex: 1 }}>
          <Account index={state.wallet.wallets.length} mnemonic={state.wallet.mnemonic} toggleAccountModal={toggleAccountModal} />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={connectAccountRef}
        snapPoints={snapPointsConnect}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleConnectModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleConnectChanges}>
        <View style={{ flex: 1 }}>
          <Connect
            domain={domain}
            webviewUrl={webviewUrl}
            network={network}
            wallet={wallet}
            allowConnection={web3Actions.allowConnection}
            denyConnection={web3Actions.denyConnection}
          />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={signMessageRef}
        snapPoints={snapPointsSignMessage}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleSignMessageModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleSignMessageChanges}>
        <View style={{ flex: 1 }}>
          <SignMessage
            domain={domain}
            webviewUrl={webviewUrl}
            network={network}
            wallet={wallet}
            messageToSign={messageToSign}
            sign={web3Actions.sign}
            denySignature={web3Actions.denySignature}
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

      <BottomSheetModal
        index={1}
        ref={tabsRef}
        snapPoints={snapPointsTabs}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleTabsModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleTabsChanges}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <BrowserTabs tabs={[...state.wallet.tabs]} go={go} setActiveTab={setActiveTab} toggleTabsModal={toggleTabsModal} />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        index={1}
        ref={optionsRef}
        snapPoints={snapPointsOptions}
        stackBehavior="push"
        backdropComponent={(props: any) => <CustomBackdrop dismissModal={toggleOptionsModal} {...props} />}
        backgroundStyle={{ backgroundColor: colors.ui_background }}
        handleIndicatorStyle={{ backgroundColor: colors.interactive_04 }}
        containerStyle={{ backgroundColor: colors.backdrop }}
        onChange={handleOptionsChanges}>
        <BrowserOptions wallet={wallet} network={network} toggleNetworkModal={toggleNetworkModal} toggleAccountsModal={toggleAccountsModal} />
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default Solana;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingLeft: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
  },
  urlContainer: {
    width: '86%',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  https: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: 8,
  },
  accountIconContainer: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '14%',
    position: 'relative',
  },
  webView: {
    width: '100%',
    height: '100%',
    flex: 1,
    marginBottom: 46,
  },
  menu: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
