import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React from 'react';
import OneSignal from 'react-native-onesignal';
import * as Sentry from '@sentry/react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { store, persistor } from '@/Store';
import ApplicationNavigator from '@/Navigators/Application';
import { ONESIGNAL_APP_ID } from './Utils/constants';
import './Translations';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

Sentry.init({
  dsn: 'https://88ac34f3f32e498c8d69a6323062b194@o4504430500708352.ingest.sentry.io/4504430504902656',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

// TODO: Handle push notifications
// OneSignal Initialization
OneSignal.setAppId(ONESIGNAL_APP_ID);

// promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
OneSignal.promptForPushNotificationsWithUserResponse();

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  console.log('OneSignal: notification will show in foreground:', notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  console.log('notification: ', notification);
  const data = notification.additionalData;
  console.log('additionalData: ', data);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.log('OneSignal: notification opened:', notification);
});

const App = () => (
  <Provider store={store}>
    {/**
     * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
     * and saved to redux.
     * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
     * for example `loading={<SplashScreen />}`.
     * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
     */}
    <PersistGate loading={null} persistor={persistor}>
      <GestureHandlerRootView style={styles.container}>
        <ApplicationNavigator />
      </GestureHandlerRootView>
    </PersistGate>
  </Provider>
);

export default Sentry.wrap(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
