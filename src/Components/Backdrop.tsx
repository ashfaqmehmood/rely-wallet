import React, { useMemo } from "react";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTheme } from "@/Hooks";
import { Pressable, Text, TouchableOpacity } from "react-native";

// const CustomBackdrop = ({ animatedIndex, style, dismissModal }: BottomSheetBackdropProps) => {
const CustomBackdrop = ({ animatedIndex, style, dismissModal }: any) => {
    const { darkMode, NavigationTheme } = useTheme();
    const { colors } = NavigationTheme;

    // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View style={containerStyle}>
        <Pressable onPress={() => dismissModal()} style={{ backgroundColor: colors.transparent, width: '100%', height: '100%' }} />
    </Animated.View>
  );
};

export default CustomBackdrop;