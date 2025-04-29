import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GroceryHeader from "./components/header";
import ListItem from "./components/listItem";
import { GROCERY_LIST } from "./data";

const GroceryList = () => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: top,
        backgroundColor: "#fff",
        overflow: "visible",
      }}
    >
      <GroceryHeader />

      <Animated.FlatList
        data={GROCERY_LIST}
        renderItem={({ item }) => <ListItem key={item.id} {...item} />}
        showsVerticalScrollIndicator={false}
        style={{
          width: "100%",
          paddingHorizontal: "5%",
        }}
      />
    </View>
  );
};

export default GroceryList;

const styles = StyleSheet.create({});
