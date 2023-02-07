import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from '@/Hooks';
import Tokens from './Tokens';
import NFTs from './NFTs';

const Tabs = () => {
  const { NavigationTheme, Layout } = useTheme();
  const { colors } = NavigationTheme;
  const navigationState = {
    index: 0,
    routes: [
      { key: 'token', title: 'Tokens' },
      { key: 'nft', title: 'NFTs' },
    ],
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      labelStyle={[styles.label, { color: colors.text_01 }]}
      activeColor={colors.icon_04}
      indicatorStyle={{ backgroundColor: colors.icon_04 }}
      style={styles.tabBar}
    />
  );

  return (
    <View style={[Layout.fill, styles.contentContainer]}>
      <TabView
        renderTabBar={renderTabBar}
        sceneContainerStyle={[styles.container, { backgroundColor: colors.transparent }]}
        pagerStyle={[styles.container, { backgroundColor: colors.transparent }]}
        style={[styles.container, { backgroundColor: colors.transparent }]}
        swipeEnabled={true}
        navigationState={navigationState}
        renderScene={SceneMap({
          token: () => <Tokens />,
          nft: () => <NFTs />,
        })}
        onIndexChange={index => (navigationState.index = index)}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: 0,
  },
  contentContainer: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  scene: {
    flex: 1,
  },
  label: {
    textTransform: 'none',
    fontSize: 15,
    fontWeight: '600',
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
});
