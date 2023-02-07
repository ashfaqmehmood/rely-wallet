export const generateRequest = (data: any, params?: any) => {
  switch (data.data.method) {
    case "eth_accounts":
      return `
        (function() {
          if (ReactNativeWebView.onMessage) { 
            ReactNativeWebView.onMessage(JSON.stringify({
              type: 'web3-send-async-callback',
              messageId: '${data.messageId}',
              result: {
                jsonrpc: "2.0",
                id: ${data.payload.id},
                result: ["${params.address}"]
              }
            }));
          } else {
            console.log('ReactNativeWebView.onMessage is not defined');
          }
        })();`;
    // TODO: complete other cases
    default:
      return null;
  }
}