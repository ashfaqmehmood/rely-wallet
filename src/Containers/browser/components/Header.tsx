import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const Header = () => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={{}}>
        <Text>Header</Text>
      </View>
    </SafeAreaView>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})