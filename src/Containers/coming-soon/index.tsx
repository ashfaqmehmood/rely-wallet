import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '@/Hooks'
import FastImage from 'react-native-fast-image'

const ComingSoon = () => {
  const { NavigationTheme } = useTheme()
  const { colors } = NavigationTheme

  return (
    <SafeAreaView style={styles.container}>
      <FastImage
        style={{ width: 200, height: 200 }}
        source={require('@/Assets/Images/coming-soon.png')} />
      <Text style={{ color: colors.text_01, marginVertical: 20 }}>
        This feature is coming soon! Stay tuned!
      </Text>
    </SafeAreaView>
  )
}

export default ComingSoon

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})