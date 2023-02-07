import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/Hooks';

type Props = {
  text: string;
  icon: string;
  size: number;
  iconType: 'FontAwesome' | 'AntDesign' | 'Feather' | 'MaterialCommunityIcons';
  onPress: () => void;
};

const ActionButton: React.FunctionComponent<Props> = ({ text, icon, size, iconType, onPress }) => {
  const { t } = useTranslation();
  const { NavigationTheme, Fonts } = useTheme();
  const { colors } = NavigationTheme;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: colors.interactive_01 }]}>
        { iconType === 'MaterialCommunityIcons' && <MaterialCommunityIcons style={styles.icon} name={icon} size={size} color={'#fff'} /> }
        { iconType === 'FontAwesome' && <FontAwesome style={styles.icon} name={icon} size={size} color={'#fff'} /> }
        { iconType === 'AntDesign' && <AntDesign style={styles.icon} name={icon} size={size} color={'#fff'} /> }
        { iconType === 'Feather' && <Feather style={styles.icon} name={icon} size={size} color={'#fff'} /> }
      </TouchableOpacity>
      <Text style={[Fonts.textCenter, { fontSize: 12, fontWeight: '500' }, { color: colors.text_01 }]}>
        {t(text)}
      </Text>
    </View>
  )
}

export default ActionButton

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    margin: 10,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 5,
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center'
  }
})