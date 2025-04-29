import {
  Canvas,
  Circle,
  DataSourceParam,
  Group,
  Image as SkiaImage,
  useFont,
  useImage,
} from "@shopify/react-native-skia";
import React, { Fragment, useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Item } from "../types";
import CanvasMap from "./canvasMap";

const { width, height } = Dimensions.get("window");
export const CANVAS_WIDTH = width * 0.89;
export const CANVAS_HEIGHT = 400;
export const OFFSET = 50;

const Dot = ({ index }: { index: number }) => {
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
  const font = useFont(require("@/src/assets/fonts/SpaceMono-Regular.ttf"), 12);
  const images = items;

  const dotsForHeight = Math.round(height / 20);
  const numsArray = Array.from(Array(12 * dotsForHeight).keys());

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

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
          return <Dot key={index} index={index} />;
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
              {images?.map((img, index) => {
                const image = useImage(img.image as DataSourceParam);
                const x = useSharedValue(-100);
                const y = useSharedValue(-100);
                const qx = useSharedValue(-100);
                const qy = useSharedValue(-100);
                // const opacity = useSharedValue(0);

                const pivotX = 150 / 2;
                const pivotY = 150 / 2;

                useAnimatedReaction(
                  () => {
                    return isExpanded.value;
                  },
                  (val) => {
                    if (val) {
                      x.value = withSpring(img.x);
                      y.value = withSpring(img.y);

                      qx.value = withSpring(img.x + 150);
                      qy.value = withSpring(img.y + 150);
                    } else {
                      x.value = withSpring(
                        img.x + (index % 2 == 0 ? -100 : 100)
                      );
                      y.value = withSpring(img.y + 100);

                      qx.value = withSpring(-100);
                      qy.value = withSpring(-100);
                    }
                  }
                );

                return (
                  <Fragment key={img.id}>
                    {/* <Circle
                      cx={img.x + 150}
                      key={img.name + "circle"}
                      cy={img.y + 150}
                      r={10}
                      color={"black"}
                      opacity={opacity}
                    >
                      <Text
                        x={img.x + 150}
                        key={img.name + "text"}
                        y={img.y + 150}
                        text={img.quantity.toString()}
                        font={font}
                        color={"white"}
                      />
                    </Circle> */}
                    <SkiaImage
                      key={img.id + "img"}
                      image={image}
                      x={x}
                      y={y}
                      width={150}
                      height={150}
                      transform={[
                        { translateX: pivotX, translateY: pivotY },
                        { translateX: -pivotX, translateY: -pivotY },
                        { rotate: img.rotation },
                      ]}
                    />
                  </Fragment>
                );
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
