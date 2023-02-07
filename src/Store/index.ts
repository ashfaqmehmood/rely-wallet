import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import createSagaMiddleware from 'redux-saga';
import { Storage } from 'redux-persist';
import { MMKV } from 'react-native-mmkv';
import walletSaga from './Sagas/wallet';

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { api } from '@/Services/api';
import theme from './Theme';
import wallet from './web3';

const reducers = combineReducers({
  theme,
  api: api.reducer,
  wallet: wallet.reducer,
});

const storage = new MMKV();

export const reduxStorage: Storage = {
  setItem: (key, value: any) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: any) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: any) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  // whitelist: [],
  whitelist: ['wallet', 'theme', 'api'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(api.middleware)
      .concat(sagaMiddleware);

    if (__DEV__ && !process.env.JEST_WORKER_ID) {
      const createDebugger = require('redux-flipper').default;
      middlewares.push(createDebugger());
    }

    return middlewares;
  },
});
sagaMiddleware.run(walletSaga);

const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export { store, persistor };
