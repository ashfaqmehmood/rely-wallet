import React from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import Animated from "react-native-reanimated";
import { isTranslateY, interpolatePath } from "react-native-redash";

import Content from "./Content";
import { TabModel, OVERVIEW } from "./Model";

const perspective = 1000;
const { height } = Dimensions.get("window");
const { multiply, sin, abs } = Animated;

interface TabProps {
  tab: TabModel;
  selectedTab: number;
  index: number;
  closeTab: () => void;
  selectTab: () => void;
  transition: Animated.Value<number>;
}

export default ({
  transition,
  tab,
  selectedTab,
  index,
  selectTab: onPress,
  closeTab
}: TabProps) => {
  const H = -height / 2;
  const position = index > selectedTab ? height : 0;
  const top = selectedTab === OVERVIEW ? index * 150 : position;

  return (
    <TouchableWithoutFeedback {...{ onPress }}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          height,
          top,
          // transform
        }}
      >
        <Content {...{ closeTab, tab, selectedTab }} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
