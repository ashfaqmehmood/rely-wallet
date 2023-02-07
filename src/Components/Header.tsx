import { useTheme } from '@/Hooks';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

interface Props {
  title: string;
  navigation: any;
  hideBack?: boolean;
};

const Header = (props: Props) => {
  const { NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.ui_background,
        borderBottomColor: colors.border_02,
        borderBottomWidth: 1,
      }
    ]}>
      {!props.hideBack ? (
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={30} color={colors.text_01} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => props.navigation.toggleDrawer()} style={styles.backButton}>
          <Ionicons name='menu' size={25} color={colors.text_01} />
        </TouchableOpacity>
      )}
      <Text style={{ fontWeight: '500', fontSize: 16, color: colors.text_01 }}>{props.title}</Text>
    </View>
  )
}

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    zIndex: 100,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  }
});