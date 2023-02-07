import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '@/Hooks';

const WebviewError = ({ error }: any) => {
  const { darkMode, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  return (
    <View style={styles.container}>
      <Image source={require('@/Assets/Images/alert.png')} resizeMode='contain' style={{ width: 200, height: 200 }} />
      <Text style={[styles.text, { color: colors.text_02 }]}>
        {error.description}
      </Text>
    </View>
  )
}

export default WebviewError

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: '100%',
    alignItems: 'center',
    paddingTop: '20%',
  },
  text: {
    marginHorizontal: '10%',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
})