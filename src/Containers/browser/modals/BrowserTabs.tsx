import React from 'react'
import { Dimensions, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Tab } from '@/Store/web3';
import { useTheme } from '@/Hooks';

interface BottomSheetProps {
  tabs: Tab[];
  go: (url: string) => void;
  setActiveTab: (index: number) => void;
  toggleTabsModal: () => void;
}

const BrowserTabs = (props: BottomSheetProps) => {
  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  return (
    <>
      <Text style={{ marginTop: 3, textAlign: 'center', color: colors.text_01, fontSize: 16, fontWeight: '600' }}>Tabs</Text>
      <TouchableOpacity style={{
        position: 'absolute',
        backgroundColor: colors.ui_01,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        right: 20,
        top: 0,
      }}>
        <Text style={{ color: colors.text_04, fontSize: 14, fontWeight: '600' }}>Close all</Text>
      </TouchableOpacity>

      <FlatList
        style={{ width: Dimensions.get('window').width, height: 300, marginTop: 20, flex: 1 }}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }}
        data={props.tabs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              props.go(item.url);
              props.setActiveTab(index);
              props.toggleTabsModal();
            }}
            style={{
              borderColor: colors.border_01,
              borderWidth: 0,
              borderRadius: 10,
              flexDirection: 'row',
              width: '100%',
              padding: 10,
            }}>
            <Image
              source={{ uri: `https://www.google.com/s2/favicons?domain=${item.url}&sz=${48}` }}
              style={{ width: 36, height: 36, alignSelf: 'flex-start' }} />

            <View style={{ flexDirection: 'column', width: '80%', marginLeft: 12, justifyContent: 'center', alignItems: 'flex-start', alignContent: 'center' }}>
              <Text style={{ textAlign: 'left', color: colors.text_01, fontSize: 13, fontWeight: '600', textAlignVertical: 'center' }}>{item.title}</Text>
              <Text style={{ textAlign: 'left', color: colors.text_02, fontSize: 13, fontWeight: '600', textAlignVertical: 'center' }}>{item.url}</Text>
            </View>
            <TouchableOpacity style={{
              borderColor: colors.border_01,
              height: 30,
              width: 30,
              borderWidth: 2,
              borderRadius: 15,
              right: 12,
              alignSelf: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Ionicons name='close' size={18} color={colors.text_02} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={{
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 36 : 14
      }}>
        <Ionicons name='add-circle' size={48} color={colors.icon_04} />
      </TouchableOpacity>
    </>
  )
}

export default BrowserTabs;

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  header: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  },
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%'
  },
  favicon: {
    width: 64,
    height: 64,
    marginTop: 20
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    margin: 8
  },
  https: {
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  domain: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: 3
  },
  info: {
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
  },
  infoHeader: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 12
  },
  accountCard: {
    flexDirection: 'row',
    height: 70,
    minHeight: 70,
    width: '90%',
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
  accountCardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: 6
  },
  buttons: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
    marginVertical: 20
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  denyButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  allowButton: {
    padding: 10,
    borderRadius: 10,
    width: '45%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});