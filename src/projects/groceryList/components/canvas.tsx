import {
  Canvas,
  Circle,
  Group,
  Image as SkiaImage,
  useImage,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
  useAnimatedReaction,
} from "react-native-reanimated";
import { Item } from "../types";
import { degressToRadians } from "@/src/utils";

const { width, height } = Dimensions.get("window");

const images = [
  {
    src: require("@/src/assets/images/groceries/lemonade.png"),
    x: 20,
    y: 100,
    rotation: degressToRadians(10),
  },
  {
    src: require("@/src/assets/images/groceries/draft.png"),
    x: 150,
    y: 200,
    rotation: degressToRadians(-10),
  },
  {
    src: require("@/src/assets/images/groceries/pesto.png"),
    x: 300,
    y: 150,
    rotation: degressToRadians(40),
  },
];

const Dot = ({
  index,
  xPosition,
  yPosition,
}: {
  index: number;
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
}) => {
  const currentRow = Math.floor(index / 21) * 20;
  const currentColumn = Math.floor(index % 21) * 20;

  return <Circle cx={currentColumn} cy={currentRow} r={1} color={"#ccc"} />;
};
const GroceryCanvas = ({
  items,
  isExpanded,
}: {
  items?: Item[];
  isExpanded: SharedValue<boolean>;
}) => {
  const CANVAS_WIDTH = width * 0.89;
  const CANVAS_HEIGHT = 400;
  const dotsForHeight = Math.round(height / 20);
  const numsArray = Array.from(Array(12 * dotsForHeight).keys());

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const xPosition = useSharedValue(-1);
  const yPosition = useSharedValue(-1);

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      // console.log("translationX: ", translateX.value + e.changeX);
      // console.log("translationY: ", translateY.value + e.changeY);
      translateX.value += e.changeX;
      translateY.value += e.changeY;
    })
    .onEnd((e) => {
      // const clampedX = Math.min(
      //   Math.max(translateX.value, -CANVAS_WIDTH * 1.5),
      //   CANVAS_WIDTH / 2
      // );
      // const clampedY = Math.min(
      //   Math.max(translateY.value, -CANVAS_HEIGHT / 2),
      //   CANVAS_HEIGHT / 2
      // );

      translateX.value = withDecay({
        velocity: e.velocityX,
        // clamp: [-CANVAS_WIDTH * 1.5, CANVAS_WIDTH / 2],
      });
      translateY.value = withDecay({
        velocity: e.velocityY,
        // clamp: [-CANVAS_HEIGHT / 2, CANVAS_HEIGHT / 2],
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    // backgroundColor: "red",
  }));

  const ranimatedStyle = useAnimatedStyle(
    () => ({
      position: "absolute",
      bottom: withTiming(isExpanded.value ? 0 : -400),
      height: CANVAS_HEIGHT,
      width: CANVAS_WIDTH,
      backgroundColor: "white",
      alignSelf: "center",
      borderRadius: 14,
      borderCurve: "circular",
      zIndex: 100,
      overflow: "hidden",
      marginBottom: "0.5%",
    }),
    [isExpanded]
  );

  return (
    <Animated.View style={ranimatedStyle}>
      <Canvas style={styles.container}>
        {numsArray.map((index) => {
          return (
            <Dot
              key={index}
              index={index}
              xPosition={xPosition}
              yPosition={yPosition}
            />
          );
        })}
      </Canvas>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            { width: CANVAS_WIDTH * 2, height: CANVAS_HEIGHT * 2 },
            animatedStyle,
          ]}
        >
          <Canvas
            style={{
              flex: 1,
              //  backgroundColor: "red"
            }}
          >
            <Group
            // transform={[
            //   { translateX: translateX.value },
            //   { translateY: translateY.value },
            // ]}
            >
              {images.map((img, index) => {
                const image = useImage(img.src);
                // const pivotX = 150 / 2;
                // const pivotY = 150 / 2;
                return image ? (
                  <SkiaImage
                    key={index}
                    image={image}
                    x={img.x}
                    y={img.y}
                    width={150}
                    height={150}
                    transform={[
                      // { translateX: pivotX, translateY: pivotY },
                      { rotate: img.rotation },
                      // { translateX: -pivotX, translateY: -pivotY },
                    ]}
                  />
                ) : null;
              })}
            </Group>
          </Canvas>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export default GroceryCanvas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignSelf: "center",
    // alignItems: "center",
    // backgroundColor: "red",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});
