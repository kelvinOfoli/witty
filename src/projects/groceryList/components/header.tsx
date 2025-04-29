import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GroceryHeader = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn}>
        <AntDesign name="arrowleft" size={20} color="black" />
      </TouchableOpacity>
      <Text style={styles.text}>My Lists</Text>
      <TouchableOpacity style={styles.btn}>
        <Image
          source={require("@/src/assets/images/setting.png")}
          style={{ width: 25, height: 25, alignSelf: "flex-end" }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default GroceryHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  btn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    // alignItems: "center",
  },
  text: {
    fontSize: 25,
    fontWeight: "400",
    color: "black",
  },
});
