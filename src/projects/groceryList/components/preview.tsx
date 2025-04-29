import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Item } from "../types";

const GroceryPreview = ({
  items,
  isExpanded,
}: {
  items?: Item[];

  isExpanded: SharedValue<boolean>;
}) => {
  const rstyles = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateZ: withTiming(isExpanded.value ? "-30deg" : "-20deg") },
      ],
    };
  }, [isExpanded.value]);
  const rstyles2 = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: "-5deg" }],
    };
  }, [isExpanded.value]);
  const rstyles3 = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: "10deg" }],
    };
  }, [isExpanded.value]);

  const rcontainer = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isExpanded.value ? 0.5 : 0.9),
        },
      ],
      bottom: withSpring(isExpanded.value ? -300 : 0, { damping: 15 }),
      opacity: withSpring(isExpanded.value ? 0 : 1),
    };
  }, [isExpanded.value]);

  return (
    <Animated.View
      style={[
        rcontainer,
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignSelf: "center",
          width: "100%",
        },
      ]}
    >
      {items && items[0] && (
        <Animated.Image
          key={items[0].id}
          source={items[0].image}
          style={[styles.image, { right: -30, zIndex: 1 }, rstyles]}
          resizeMode={"contain"}
        />
      )}
      {items && items[1] && (
        <Animated.Image
          key={items[1].id}
          source={items[1].image}
          style={[
            { height: 250, width: 150, resizeMode: "contain", top: -40 },
            rstyles2,
          ]}
          resizeMode={"contain"}
        />
      )}
      {items && items[2] && (
        <Animated.Image
          key={items[2].id}
          source={items[2].image}
          style={[styles.image, { left: -25 }, rstyles3]}
          resizeMode={"contain"}
        />
      )}
    </Animated.View>
  );
};

export default GroceryPreview;

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 100,
    resizeMode: "contain",
    // position: "absolute",
  },
});
