import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const EntryScriptWeb3 = {
  entryScriptWeb3: '',
  // Cache InpageBridgeWeb3 so that it is immediately available
  async init() {
    try {
      this.entryScriptWeb3 = Platform.OS === 'ios' ? await RNFS.readFile(`${RNFS.MainBundlePath}/sol_provider.js`, 'utf8') : await RNFS.readFileAssets('sol_provider.js');
      return this.entryScriptWeb3;
    } catch (error: any) {
      console.log(error);
      console.log(error.message);
    }
  },
  async get() {
    // Return from cache
    if (this.entryScriptWeb3) {
      return this.entryScriptWeb3;
    }

    // If for some reason it is not available, get it again
    return await this.init();
  },
};

export default EntryScriptWeb3;

const connect = {
  method: 'connect',
};
const disconnect = {
  method: 'disconnect',
};
const signMessage = {
  method: 'signMessage',
  params: {
    message: Uint8Array,
    display: 'utf8',
  },
};
const signTransaction = {
  method: 'signTransaction',
  params: {
    transaction:
      'AKhoybLLJS1deDJDyjELDNhfkBBX3k4dt4bBfmppjfPVVimhQdFEfDo8AiFcCBCC9VkYWV2r3jkh9n1DAXEhnJPwMmnss63AhX7hp51QCWc7UKSsFpXRsPu2Da3XuJ5xjjg7WA96eV4NgZ5PpCfhBrw2QxvPXcL7kUmPd39aoSUBAfe2NN6vKsFfxQASTyN4c3FuWadFHR6nEqDj3jN1xgVudWrfiz2esVchog1tKVyDpCuzPYebBd6mM',
  },
};
const signTransactionResult = {
  publicKey: 'solweb3.js public key',
  signature: Uint8Array,
};
