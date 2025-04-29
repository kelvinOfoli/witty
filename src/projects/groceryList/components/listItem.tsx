import { rowStyle } from "@/src/utils/styles";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ListItem } from "../types";
import GroceryCanvas from "./canvas";
import GroceryPreview from "./preview";

const listItem = (props: ListItem) => {
  let expanded = useSharedValue(false);
  let height = useSharedValue(200);

  let rstyles = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        //   activeOpacity={1}
        pointerEvents={expanded.value ? "none" : "auto"}
        style={[styles.container, rstyles]}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            height: 100,
            position: "absolute",
            zIndex: 100,
          }}
          onPress={(e) => {
            if (expanded.value) {
              expanded.value = false;
              height.value = withSpring(200, { damping: 13, mass: 0.5 });
            } else {
              expanded.value = true;
              height.value = withSpring(500, { damping: 13, mass: 0.5 });
            }
          }}
        />
        <View style={[styles.top, { paddingHorizontal: 15 }]}>
          <View style={[rowStyle, { gap: 3 }]}>
            <Octicons name="history" size={10} color="#00000080" />
            <Text style={styles.dateCreated}>{props.dateCreated}</Text>
          </View>

          <View style={[rowStyle, { gap: 3 }]}>
            <MaterialCommunityIcons name="food" size={10} color="#00000070" />
            <Text>
              {props.items.reduce((acc, item) => acc + item.quantity, 0)}
            </Text>
          </View>
        </View>
        <Text style={styles.title}>{props.name}</Text>
        <Text style={styles.desc}>{props.desc}</Text>

        <GroceryPreview items={props.items} isExpanded={expanded} />
        <GroceryCanvas items={props.items} isExpanded={expanded} />
      </Animated.View>
    </View>
  );
};

export default listItem;

const styles = StyleSheet.create({
  wrapper: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "100%",
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 4,
  },
  container: {
    width: "100%",
    backgroundColor: "#f3f2f2",
    borderRadius: 15,
    paddingTop: 15,
    overflow: "hidden",
  },

  top: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    ...rowStyle,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.8,
    textAlign: "center",
  },
  desc: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 4,
    textAlign: "center",
    letterSpacing: -0.8,
  },
  dateCreated: {
    fontSize: 13,
    letterSpacing: -0.8,
  },
});
