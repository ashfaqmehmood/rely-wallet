import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import Account from '@/Components/AccountHeader';

import { useTheme } from '@/Hooks';

import { RootState } from '@/Store';
import { Network, Wallet } from '@/Store/web3';

import { getInjectedJavaScript } from '@/Containers/browser/services/provider';
import WebviewError from '@/Components/WebviewError';
import { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';

const Browser = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  let webview = useRef<WebView>(null);

  const wallet = useSelector((state: RootState) => state.wallet);
  const activeNetwork = useSelector((state: RootState) => wallet.activeNetwork);
  const network: Network = wallet.networks.find((network: Network) => network.chainId === wallet.activeNetwork) as Network;
  const activeWallet = wallet.wallets[wallet.activeWallet];
  const [injectedJavaScript, setInjectedJavaScript] = useState(getInjectedJavaScript(network.chainId, network.networkVersion));

  const [error, setError] = useState(null as any);
  const [messageData, setMessageData] = useState({} as any);

  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  useEffect(() => {
    console.log('chainChanged');
    setInjectedJavaScript(getInjectedJavaScript(network.chainId, network.networkVersion));
    // @ts-ignore-next-line
    // webview.injectJavaScript(`window.ethereum.emit('chainChanged', '${network.chainId}');`);
  }, [activeNetwork]);

  useEffect(() => {
    console.log('accountsChanged');
    // @ts-ignore-next-line
    // webview.injectJavaScript(`window.ethereum.emit('accountsChanged', ['${activeWallet.address}']);`);
  }, [activeWallet.address]);

  /**
   * Handle message from website
   */
  const onMessage = ({ nativeEvent }: WebViewMessageEvent) => {
    let data: any = nativeEvent.data;
    // console.log(data);
    data = typeof data === 'string' ? JSON.parse(data) : data;
    console.log(data);
    let wallets = '';
    wallet.wallets.map((wallet: Wallet) => {
      wallets = `${wallets}"${wallet.address}",`;
    });
    if (data.permission === 'web3') {
      const request = `
      (function() {
        var __send = function() { 
          if (ReactNativeWebView.onMessage) { 
            ReactNativeWebView.onMessage(JSON.stringify({
              type: 'api-response',
              isAllowed: true,
              permission: 'web3',
              messageId: '${data.messageId}',
              data: [${wallets}]
            }));
          } else {
            setTimeout(__send, 0)
          }
        }; 
        __send();
      })();`
      console.log(request);
      // @ts-ignore-next-line
      webview.injectJavaScript(request);
    }
    if (data.type === 'web3-send-async-read-only') {
      console.log('web3-send-async-read-only');
      console.log(data.payload.method);
      if (data.payload.method === 'eth_accounts') {
        console.log('eth_accounts requested read only')
        let wallets = '';
        wallet.wallets.map((wallet: Wallet) => {
          wallets = `${wallets}"${wallet.address}",`;
        });
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
                    result: [${wallets}]
                  }
                }));
              } else {
                setTimeout(__send, 0)
              }
            }; 
            __send();
          })();`
        // @ts-ignore-next-line
        webview.injectJavaScript(request);
      }
    }
  }

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
    webview.injectJavaScript(`(function(){window.location.href = '${urlToGo}' })()`);
  };

  const sanitizeUrlInput = (url: string) =>
    url.replace(/'/g, '%27').replace(/[\r\n]/g, '');

  /**
   * Handle error, for example, ssl certificate error
   */
  const onError = ({ nativeEvent: errorInfo }: WebViewErrorEvent) => {
    console.log(errorInfo);
    setError(errorInfo);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Account 
        style={{ marginBottom: 12 }}
        network={network as Network} 
        wallet={activeWallet} 
        toggleAssetsModal={console.log}
        toggleAccountModal={console.log} />
      <WebView
        originWhitelist={['https://*', 'http://*']}
        decelerationRate={'normal'}
        // @ts-ignore-next-line
        ref={(ref) => (webview = ref)}
        source={{
          uri: 'https://portfolio.metamask.io'
        }}
        style={{ width: '100%', height: '100%', flex: 1 }}
        onMessage={onMessage}
        renderError={(e) => {
          console.log('renderError');
          console.log(e);
          return (<WebviewError error={error} returnHome={returnHome} />)
        }}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
        onError={onError}
        sendCookies
        javascriptEnabled
        allowsInlineMediaPlayback
        useWebkit
        testID={'browser-webview'}
        applicationNameForUserAgent={'WebView RelyWallet'}
      />
    </SafeAreaView>
  )
}

export default Browser

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
});