import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/Hooks';
import Portfolio from '@/Containers/portfolio';
import History from '@/Containers/history';
import ImportToken from '@/Containers/import-asset/ImportToken';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '@/Containers/home';
import ImportWallet from '@/Containers/walkthrough/ImportWallet';
import CreateWallet from '@/Containers/walkthrough/CreateWallet';
import OnboardingScreen from '@/Containers/onboarding/Onboarding';
import Welcome from '@/Containers/walkthrough/Welcome';
import Scan from '@/Containers/walkthrough/Scan';
import { StartupContainer } from '@/Containers';
import Token from '@/Containers/home/token';
import ImportNFT from '@/Containers/import-asset/ImportNFT';
import ComingSoon from '@/Containers/coming-soon';
import NFT from '@/Containers/home/nft';
import SolBrowser from '@/Containers/browser/SolBrowser';
import Browser from '@/Containers/browser/Browser';
import Solana from '@/Containers/browser/Solana';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// @refresh reset
const MainNavigator = () => {
  const navigation = useNavigation();
  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.interactive_01,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color, size }: any) => <SimpleLineIcons name="wallet" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Browser}
        options={{
          title: 'Explore',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color, size }: any) => <Octicons name="browser" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={Portfolio}
        options={{
          title: 'Portfolio',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color, size }: any) => <Feather name="pie-chart" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          title: 'History',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color, size }: any) => <Octicons name="history" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const StackNavigator = () => {
  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  return (
    <Stack.Navigator initialRouteName={'Startup'}>
      <Stack.Screen name="Startup" component={StartupContainer} options={{ headerShown: false }} />
      <Stack.Screen name="Tabs" component={MainNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <Stack.Screen name="Scan" component={Scan as any} options={{ headerShown: false }} />
      <Stack.Screen
        name="CreateWallet"
        component={CreateWallet}
        options={{
          headerShown: true,
          headerTitle: 'Create Wallet',
          headerTitleAlign: 'center',
          headerLeftLabelVisible: false,
          headerTintColor: colors.text_01,
          headerStyle: {
            borderBottomColor: colors.border_02,
            borderBottomWidth: 1,
          },
        }}
      />
      <Stack.Screen
        name="ImportWallet"
        component={ImportWallet}
        options={{
          headerShown: true,
          headerTitle: 'Import Wallet',
          headerTitleAlign: 'center',
          headerLeftLabelVisible: false,
          headerTintColor: colors.text_01,
          headerStyle: {
            borderBottomColor: colors.border_02,
            borderBottomWidth: 1,
          },
        }}
      />
      <Stack.Screen
        name="ImportToken"
        component={ImportToken}
        options={{
          headerShown: true,
          headerTitle: 'Import Token',
          headerTitleAlign: 'center',
          headerLeftLabelVisible: false,
          headerTintColor: colors.text_01,
          headerStyle: {
            borderBottomColor: colors.border_02,
            borderBottomWidth: 1,
          },
        }}
      />
      <Stack.Screen
        name="ImportNFT"
        component={ImportNFT}
        options={{
          headerShown: true,
          headerTitle: 'Import NFT',
          headerTitleAlign: 'center',
          headerLeftLabelVisible: false,
          headerTintColor: colors.text_01,
          headerStyle: {
            borderBottomColor: colors.border_02,
            borderBottomWidth: 1,
          },
        }}
      />
      <Stack.Screen
        name="Token"
        component={Token}
        options={{
          headerShown: true,
          headerTitle: 'Token Details',
          headerTitleAlign: 'center',
          headerLeftLabelVisible: false,
          headerTintColor: colors.text_01,
          headerStyle: {
            borderBottomColor: colors.border_02,
            borderBottomWidth: 1,
          },
        }}
      />
      <Stack.Screen
        name="NFT"
        component={NFT}
        options={{
          headerShown: true,
          headerTitle: 'NFT Details',
          headerTitleAlign: 'center',
          headerLeftLabelVisible: false,
          headerTintColor: colors.text_01,
          headerStyle: {
            borderBottomColor: colors.border_02,
            borderBottomWidth: 1,
          },
        }}
      />
      <Stack.Screen
        name="ComingSoon"
        component={ComingSoon}
        options={{
          headerShown: true,
          headerTitle: 'Coming Soon',
          headerTitleAlign: 'center',
          headerLeftLabelVisible: false,
          headerTintColor: colors.text_01,
          headerStyle: {
            borderBottomColor: colors.border_02,
            borderBottomWidth: 1,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
