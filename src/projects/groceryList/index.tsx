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
        paddingHorizontal: "5%",
        backgroundColor: "#fff",
      }}
    >
      <GroceryHeader />

      <Animated.FlatList
        data={GROCERY_LIST}
        renderItem={({ item }) => <ListItem key={item.id} {...item} />}
        showsVerticalScrollIndicator={false}
        // style={{ flex: 1 }}
      />
    </View>
  );
};

export default GroceryList;

const styles = StyleSheet.create({});
