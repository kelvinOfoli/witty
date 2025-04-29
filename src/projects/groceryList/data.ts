import { degressToRadians } from "@/src/utils";

export const GROCERY_LIST = [
  {
    id: "1",
    name: "Sunday Brunch Prep",
    desc: "Ready for fresh croissants and OJ!",
    dateCreated: "2 days ago",

    // const images = [
    //   {
    //     src: require("@/src/assets/images/groceries/lemonade.png"),
    //     x: 20,
    //     y: 100,
    //     rotation: degressToRadians(10),
    //   },
    //   {
    //     src: require("@/src/assets/images/groceries/draft.png"),
    //     x: 150,
    //     y: 200,
    //     rotation: degressToRadians(-10),
    //   },
    //   {
    //     src: require("@/src/assets/images/groceries/pesto.png"),
    //     x: 300,
    //     y: 150,
    //     rotation: degressToRadians(40),
    //   },
    // ];

    // const Dot = ({
    //   index,
    //   xPosition,
    //   yPosition,
    // }: {
    //   index: number;
    //   xPosition: SharedValue<number>;
    //   yPosition: SharedValue<number>;
    // }) => {

    items: [
      {
        id: "1",
        name: "lemonade",
        image: require("../../assets/images/groceries/lemonade.png"),
        quantity: 2,
        x: 20,
        y: 100,
        rotation: degressToRadians(10),
      },
      {
        id: "2",
        name: "draft",
        image: require("../../assets/images/groceries/draft.png"),
        quantity: 1,
        x: 100,
        y: 150,
        rotation: degressToRadians(-10),
      },
      {
        id: "3",
        name: "Pesto",
        image: require("../../assets/images/groceries/pesto.png"),
        quantity: 1,
        x: 200,
        y: 120,
        rotation: degressToRadians(40),
      },
      {
        id: "4",
        name: "alpro",
        image: require("../../assets/images/groceries/alpro.png"),
        quantity: 1,
        x: 400,
        y: 100,
        rotation: degressToRadians(20),
      },
      {
        id: "5",
        name: "cheese",
        image: require("../../assets/images/groceries/cheese.png"),
        quantity: 3,
        x: 0,
        y: 0,
        rotation: degressToRadians(30),
      },
      {
        id: "6",
        name: "jif",
        image: require("../../assets/images/groceries/jif.png"),
        quantity: 1,
        x: 300,
        y: 50,
        rotation: degressToRadians(10),
      },
      {
        id: "7",
        name: "pasta",
        image: require("../../assets/images/groceries/pasta.png"),
        quantity: 1,
        x: 200,
        y: 500,
        rotation: degressToRadians(-20),
      },
      {
        id: "8",
        name: "pringles",
        image: require("../../assets/images/groceries/pringles.png"),
        quantity: 1,
        x: 320,
        y: 200,
        rotation: degressToRadians(-20),
      },
      {
        id: "9",
        name: "spinat",
        image: require("../../assets/images/groceries/spinat.png"),
        quantity: 2,
        x: 200,
        y: 320,
        rotation: degressToRadians(20),
      },
      {
        id: "10",
        name: "tonys",
        image: require("../../assets/images/groceries/tonys.png"),
        quantity: 1,
        x: 300,
        y: 100,
        rotation: degressToRadians(30),
      },
    ],
  },
];
