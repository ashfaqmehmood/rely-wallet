import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { MARGIN } from "./Config";
import Tile from "./Tile";
import SortableList from "./SortableList";
import { ScrollView } from "react-native";

const tiles = [
  {
    id: "google",
    uri: "https://google.com",
  },
  {
    id: "expo",
    uri: "https://expo.io",
  },
  {
    id: "facebook",
    uri: "https://facebook.com",
  },
  {
    id: "reanimated",
    uri: "https://docs.swmansion.com/react-native-reanimated/",
  }
];

const Chrome = () => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: 'transparent', paddingHorizontal: MARGIN }}
    >
      <SortableList
        editing={true}
        onDragEnd={(positions) =>
          console.log(JSON.stringify(positions, null, 2))
        }>
        {[...tiles].map((tile, index) => (
          <Tile
            onLongPress={() => true}
            key={tile.id + "-" + index}
            id={tile.id + "-" + index}
            uri={tile.uri}
          />
        ))}
      </SortableList>
    </ScrollView>
  );
};

export default Chrome;