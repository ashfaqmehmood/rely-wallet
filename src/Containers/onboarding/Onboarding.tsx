import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Onboarding from 'react-native-onboarding-swiper';

import { Colors } from '@/Theme/Variables';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setOnboarding } from '@/Store/web3';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onDone = () => {
    dispatch(setOnboarding(true));
    // @ts-ignore
    navigation.navigate('Welcome');
  };

  return (
    <Onboarding
      // @ts-ignore
      onSkip={onDone}
      // @ts-ignore
      onDone={onDone}
      containerStyles={{ backgroundColor: Colors.background }}
      imageContainerStyles={{ backgroundColor: Colors.background }}
      titleStyles={styles.title}
      subTitleStyles={styles.subTitle}
      bottomBarColor={'#ffffff'}
      pages={[
        {
          backgroundColor: Colors.background,
          image: (
            <Image
              resizeMode="contain"
              style={styles.image}
              source={require('@/Assets/Images/onboarding/1.png')}
            />
          ),
          title: t('onboarding.title1'),
          subtitle: t('onboarding.subtitle1'),
        },
        {
          backgroundColor: Colors.background,
          image: (
            <Image
              resizeMode="contain"
              style={styles.image}
              source={require('@/Assets/Images/onboarding/2.png')}
            />
          ),
          title: t('onboarding.title2'),
          subtitle: t('onboarding.subtitle2'),
        },
        {
          backgroundColor: Colors.background,
          image: (
            <Image
              resizeMode="contain"
              style={styles.image}
              source={require('@/Assets/Images/onboarding/3.png')}
            />
          ),
          title: t('onboarding.title3'),
          subtitle: t('onboarding.subtitle3'),
        },
        {
          backgroundColor: Colors.background,
          image: (
            <Image
              resizeMode="contain"
              style={styles.image}
              source={require('@/Assets/Images/onboarding/4.png')}
            />
          ),
          title: t('onboarding.title4'),
          subtitle: t('onboarding.subtitle4'),
        },
      ]}
    />
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#0D1F3C',
    fontWeight: '500',
    fontSize: 30,
  },
  subTitle: {
    color: '#485068',
    fontSize: 18,
  },
  image: {
    width: 265,
    height: 265,
  },
});
