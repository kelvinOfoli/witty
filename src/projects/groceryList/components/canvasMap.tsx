import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./canvas";

const CanvasMap = ({
  x,
  y,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
}) => {
  const rStyles = useAnimatedStyle(() => {
    const translateX = interpolate(-x.value, [0, CANVAS_WIDTH], [0, 70 / 2], {
      extrapolateRight: Extrapolation.CLAMP,
    });
    const translateY = interpolate(-y.value, [0, CANVAS_HEIGHT], [0, 70 / 2], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    return {
      transform: [{ translateX }, { translateY }],
    };
  });
  return (
    <View style={styles.shadow}>
      <View style={styles.container}>
        <Animated.View style={[styles.blueBox, rStyles]} />
      </View>
    </View>
  );
};

export default CanvasMap;

const styles = StyleSheet.create({
  blueBox: {
    width: 30,
    height: 30,
    borderColor: "#3c88c9",
    borderWidth: 1,
    borderRadius: 5,
    borderCurve: "continuous",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: 70,
    height: 70,
    borderRadius: 5,
    borderCurve: "continuous",
    zIndex: 100,
    overflow: "hidden",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 4,
    overflow: undefined,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
});
