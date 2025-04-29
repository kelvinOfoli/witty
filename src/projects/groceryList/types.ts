import { ImageSourcePropType } from "react-native";

export type ListItem = {
  id: string;
  name: string;
  dateCreated: string;
  desc: string;
  items: Item[];
};

export type Item = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  quantity: number;
};
