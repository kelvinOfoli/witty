import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

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
