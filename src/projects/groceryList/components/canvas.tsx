import { degressToRadians } from "@/src/utils";
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
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
  useAnimatedReaction,
  withSpring,
} from "react-native-reanimated";
import { Item } from "../types";
import CanvasMap from "./canvasMap";

const { width, height } = Dimensions.get("window");
export const CANVAS_WIDTH = width * 0.89;
export const CANVAS_HEIGHT = 400;
export const OFFSET = 50;

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
  const dotsForHeight = Math.round(height / 20);
  const numsArray = Array.from(Array(12 * dotsForHeight).keys());

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const xPosition = useSharedValue(-1);
  const yPosition = useSharedValue(-1);

  useEffect(() => {
    if (isExpanded.value == true) {
      translateX.value = 0;
      translateY.value = 0;
    }
  }, [isExpanded.value]);

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      translateX.value += e.changeX;
      translateY.value += e.changeY;
    })
    .onEnd((e) => {
      translateX.value = withDecay({
        velocity: e.velocityX,
        rubberBandEffect: true,
        rubberBandFactor: 0.6,
        clamp: [-CANVAS_WIDTH / 2 + OFFSET, CANVAS_WIDTH / 2 - OFFSET],
      });
      translateY.value = withDecay({
        velocity: e.velocityY,
        rubberBandEffect: true,
        rubberBandFactor: 0.6,
        clamp: [-CANVAS_HEIGHT / 2 + OFFSET, CANVAS_HEIGHT / 2 - OFFSET],
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const ranimatedStyle = useAnimatedStyle(
    () => ({
      position: "absolute",
      bottom: withTiming(isExpanded.value ? 0 : -403),
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
            }}
          >
            <Group>
              {images.map((img, index) => {
                const image = useImage(img.src);
                const x = useSharedValue(-100);
                const y = useSharedValue(-100);

                useAnimatedReaction(
                  () => {
                    return isExpanded.value;
                  },
                  (val) => {
                    if (val) {
                      x.value = withSpring(img.x);
                      y.value = withSpring(img.y);
                    } else {
                      x.value = withSpring(-100);
                      y.value = withSpring(-100);
                    }
                  }
                );

                return image ? (
                  <SkiaImage
                    key={index}
                    image={image}
                    x={x}
                    y={y}
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
      <CanvasMap x={translateX} y={translateY} />
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
