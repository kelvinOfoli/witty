# CLAUDE.md - Witty Codebase Guide for AI Assistants

> **Last Updated**: 2026-01-09
> **Project**: Witty - Interactive Grocery List App
> **Tech Stack**: React Native + Expo + TypeScript

## Table of Contents

1. [Project Overview](#project-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflows](#development-workflows)
4. [Architecture & Patterns](#architecture--patterns)
5. [Key Conventions](#key-conventions)
6. [AI Assistant Guidelines](#ai-assistant-guidelines)
7. [Common Tasks](#common-tasks)
8. [Testing & Quality](#testing--quality)

---

## Project Overview

**Witty** is a React Native mobile application for managing grocery lists with an interactive canvas-based visualization. The app provides:

- **Expandable grocery list cards** with smooth animations
- **Interactive canvas** using Skia for rendering grocery items with pan/zoom gestures
- **Canvas minimap** for spatial navigation
- **Animated previews** of top items when cards are collapsed
- **Cross-platform support** for iOS, Android, and Web

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.76.9 | Mobile framework |
| **React** | 18.3.1 | UI library |
| **Expo** | ~52.0.46 | Development platform |
| **TypeScript** | ^5.3.3 | Type safety |
| **React Native Reanimated** | ~3.16.1 | Advanced animations |
| **React Native Skia** | ~1.12.4 | Canvas rendering |
| **React Native Gesture Handler** | ~2.20.2 | Gesture detection |
| **React Navigation** | ~7.0.14 | Navigation (native stack) |

### Project Metadata

- **Bundle ID (iOS)**: `com.kelvinportuphy.witty`
- **Package (Android)**: `com.kelvinportuphy.witty`
- **New Architecture**: Enabled (`newArchEnabled: true`)
- **Typed Routes**: Enabled (experimental)

---

## Codebase Structure

### Directory Layout

```
/home/user/witty/
├── android/                    # Android native code
├── ios/                        # iOS native code
├── scripts/                    # Build and setup scripts
│   └── reset-project.js       # Reset to blank project
├── src/                       # Main source code
│   ├── assets/                # Static assets
│   │   ├── fonts/            # Custom fonts (SpaceMono)
│   │   └── images/           # Images & icons
│   │       └── groceries/    # 10 grocery item images
│   ├── components/            # Reusable components
│   │   └── buttons/
│   │       └── pinButtons.tsx # (Empty placeholder)
│   ├── constants/             # App-wide constants
│   │   └── Colors.ts         # Color definitions (light/dark mode)
│   ├── projects/              # Feature modules (project-based organization)
│   │   └── groceryList/      # Grocery list feature
│   │       ├── components/   # Feature-specific components
│   │       │   ├── canvas.tsx      # Interactive Skia canvas
│   │       │   ├── canvasMap.tsx   # Canvas minimap
│   │       │   ├── header.tsx      # Header component
│   │       │   ├── listItem.tsx    # Expandable list card
│   │       │   └── preview.tsx     # Animated item preview
│   │       ├── data.ts       # Static grocery data
│   │       ├── types.ts      # TypeScript type definitions
│   │       └── index.tsx     # Main grocery list screen
│   ├── routes/                # Navigation configuration
│   │   └── index.tsx         # React Navigation setup
│   └── utils/                 # Utility functions
│       ├── index.ts          # Helper functions (e.g., degressToRadians)
│       └── styles/
│           └── index.ts      # Shared style constants (rowStyle)
├── App.tsx                    # Root component
├── index.js                   # Expo entry point
├── app.json                   # Expo configuration
├── package.json               # Dependencies & scripts
└── tsconfig.json              # TypeScript configuration
```

### Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Root component that renders RootNavigator |
| `src/routes/index.tsx` | Navigation setup (React Navigation Native Stack) |
| `src/projects/groceryList/index.tsx` | Main grocery list screen with FlatList |
| `src/projects/groceryList/components/listItem.tsx` | Core component: expandable grocery card |
| `src/projects/groceryList/components/canvas.tsx` | Interactive Skia canvas with pan gestures |
| `src/projects/groceryList/data.ts` | Static grocery list data |
| `src/projects/groceryList/types.ts` | TypeScript types for ListItem & Item |
| `src/constants/Colors.ts` | Light/dark mode color definitions |

---

## Development Workflows

### Setup & Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Run on specific platforms
npm run android      # Android emulator
npm run ios          # iOS simulator
npm run web          # Web browser
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run in web browser |
| `npm test` | Run Jest tests in watch mode |
| `npm run lint` | Run Expo linter |
| `npm run reset-project` | Reset to blank project template |

### Development Server

- The app uses **Expo Go** or **development builds** for testing
- Metro bundler runs on default port (usually 8081)
- Supports hot reloading and fast refresh

---

## Architecture & Patterns

### Navigation Architecture

**Current Setup**: React Navigation Native Stack (NOT expo-router)

```typescript
// src/routes/index.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="groceryList" component={GroceryList} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
```

**Note**: `expo-router` is installed but **not currently used**. The project uses React Navigation's stack navigator instead.

### State Management

**Pattern**: Local component state using `react-native-reanimated` SharedValues

- **No global state management** (Redux, Context API, Zustand, etc.)
- **SharedValues** for animation state that needs to be reactive
- **useState** for non-animated component state

**Example Pattern**:

```typescript
// src/projects/groceryList/components/listItem.tsx
const listItem = (props: ListItem) => {
  let expanded = useSharedValue(false);  // Animation state
  let height = useSharedValue(200);      // Animated height

  const rstyles = useAnimatedStyle(() => ({
    height: height.value,
  }));

  // Toggle expansion with spring animation
  const toggleExpand = () => {
    if (expanded.value) {
      height.value = withSpring(200, { damping: 13, mass: 0.5 });
    } else {
      height.value = withSpring(500, { damping: 13, mass: 0.5 });
    }
    expanded.value = !expanded.value;
  };
};
```

### Data Architecture

**Current**: Static data in `data.ts` files

```typescript
// src/projects/groceryList/data.ts
export const GROCERY_LIST = [
  {
    id: "1",
    name: "Sunday Brunch Prep",
    desc: "Ready for fresh croissants and OJ!",
    dateCreated: "2 days ago",
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
      // ... more items
    ],
  },
];
```

**Type Definitions**:

```typescript
// src/projects/groceryList/types.ts
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
  // Canvas positioning (optional fields in real usage)
  x?: number;
  y?: number;
  rotation?: number;
};
```

### Animation Patterns

**Primary Animation Library**: `react-native-reanimated`

**Common Patterns**:

1. **Spring Animations** (smooth, physics-based):
```typescript
height.value = withSpring(500, { damping: 13, mass: 0.5 });
```

2. **Timing Animations** (linear transitions):
```typescript
bottom: withTiming(isExpanded.value ? 0 : -403)
```

3. **Decay Animations** (gesture momentum):
```typescript
translateX.value = withDecay({
  velocity: e.velocityX,
  rubberBandEffect: true,
  rubberBandFactor: 0.6,
  clamp: [-CANVAS_WIDTH / 2 + OFFSET, CANVAS_WIDTH / 2 - OFFSET],
});
```

4. **Animated Reactions** (respond to SharedValue changes):
```typescript
useAnimatedReaction(
  () => isExpanded.value,
  (expanded) => {
    if (expanded) {
      opacity.value = withTiming(1);
    }
  }
);
```

### Gesture Handling

**Library**: `react-native-gesture-handler`

**Pattern**: Pan gesture with decay on release

```typescript
const panGesture = Gesture.Pan()
  .onChange((e) => {
    translateX.value += e.changeX;
    translateY.value += e.changeY;
  })
  .onEnd((e) => {
    translateX.value = withDecay({
      velocity: e.velocityX,
      rubberBandEffect: true,
      clamp: [-maxX, maxX],
    });
  });

// Wrap with GestureDetector
<GestureDetector gesture={panGesture}>
  <Animated.View style={animatedStyle}>
    {/* content */}
  </Animated.View>
</GestureDetector>
```

### Canvas Rendering

**Library**: `@shopify/react-native-skia`

**Pattern**: Skia Canvas with images, circles, and text

```typescript
import { Canvas, Circle, Image as SkiaImage, useFont, useImage } from "@shopify/react-native-skia";

const GroceryCanvas = ({ items }) => {
  const font = useFont(require("@/src/assets/fonts/SpaceMono-Regular.ttf"), 12);
  const image = useImage(require("@/src/assets/images/groceries/lemonade.png"));

  return (
    <Canvas style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <Group transform={[{ translateX }, { translateY }]}>
        {/* Dot grid background */}
        {dotsArray.map((_, index) => <Dot key={index} index={index} />)}

        {/* Grocery images */}
        {items.map((item) => (
          <SkiaImage
            image={useImage(item.image)}
            x={item.x}
            y={item.y}
            width={60}
            height={60}
            transform={[{ rotate: item.rotation }]}
          />
        ))}
      </Group>
    </Canvas>
  );
};
```

---

## Key Conventions

### TypeScript Configuration

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Import Alias**: Use `@/` to reference from project root

```typescript
import { rowStyle } from "@/src/utils/styles";
import { degressToRadians } from "@/src/utils";
```

### Component Structure

**Pattern**: Functional components with hooks

```typescript
// Component file naming: camelCase (e.g., listItem.tsx)
// Component export: default export

const ComponentName = (props: PropsType) => {
  // 1. Hooks at top
  const expanded = useSharedValue(false);

  // 2. Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  // 3. Event handlers
  const handlePress = () => {
    expanded.value = !expanded.value;
  };

  // 4. Return JSX
  return (
    <View style={styles.container}>
      {/* content */}
    </View>
  );
};

export default ComponentName;

// 5. Styles at bottom
const styles = StyleSheet.create({
  container: {
    // styles
  },
});
```

### Styling Conventions

**Method**: React Native StyleSheet API

```typescript
const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#f3f2f2",
    borderRadius: 15,
    paddingTop: 15,
    overflow: "hidden",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.8,
    textAlign: "center",
  },
});
```

**Shared Styles**:

```typescript
// src/utils/styles/index.ts
export const rowStyle = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "space-between" as const,
};

// Usage
<View style={[rowStyle, { gap: 3 }]}>
```

**Color System**:

```typescript
// src/constants/Colors.ts
export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: "#0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#fff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
  },
};
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| **Components** | camelCase | `listItem.tsx`, `canvasMap.tsx` |
| **Types** | camelCase | `types.ts` |
| **Data** | camelCase | `data.ts` |
| **Constants** | PascalCase | `Colors.ts` |
| **Utilities** | camelCase | `index.ts` |

### Import Order

```typescript
// 1. External libraries
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

// 2. Project utilities/constants
import { rowStyle } from "@/src/utils/styles";
import { degressToRadians } from "@/src/utils";

// 3. Types
import { ListItem } from "../types";

// 4. Components
import GroceryCanvas from "./canvas";
import GroceryPreview from "./preview";
```

---

## AI Assistant Guidelines

### General Principles

1. **Always read files before modifying** - Never propose changes to code you haven't read
2. **Maintain consistency** - Follow existing patterns and conventions
3. **TypeScript strict mode** - All code must pass strict type checking
4. **Avoid over-engineering** - Only implement what's requested
5. **Preserve animations** - Be cautious when modifying animation code
6. **Test on multiple platforms** - Consider iOS, Android, and Web

### When Adding Features

**DO**:
- ✅ Use SharedValues for animated state
- ✅ Follow the component structure pattern (hooks → styles → handlers → JSX)
- ✅ Place feature-specific components in `src/projects/{feature}/components/`
- ✅ Define types in `types.ts` files
- ✅ Use the `@/` import alias
- ✅ Keep animations smooth (use spring for natural feel)
- ✅ Consider safe area insets for iOS

**DON'T**:
- ❌ Add global state management without discussion
- ❌ Use inline styles for static values (use StyleSheet)
- ❌ Create generic utilities for one-time use
- ❌ Add unnecessary abstractions
- ❌ Skip TypeScript types
- ❌ Use `any` type
- ❌ Mix animation libraries (stick to Reanimated)

### Working with Animations

**Key Points**:
- All animations use `react-native-reanimated`
- Use `useSharedValue` for values that need to be animated
- Use `useAnimatedStyle` to create animated styles
- Use `useAnimatedReaction` to respond to SharedValue changes
- Common animations: `withSpring` (natural), `withTiming` (linear), `withDecay` (momentum)

**Animation Performance**:
- Animations run on UI thread (60fps)
- Avoid heavy calculations in animated styles
- Use `worklet` directive for functions that run on UI thread

### Working with Skia Canvas

**Important**:
- Skia runs on a separate thread for high performance
- Use `useImage` hook to load images for Skia
- Use `useFont` hook to load fonts for text
- Dimensions are in pixels
- Transforms apply to Groups, not individual elements
- Use `Group` to apply transforms to multiple elements

**Canvas Constants** (`src/projects/groceryList/components/canvas.tsx`):
```typescript
export const CANVAS_WIDTH = width * 0.89;
export const CANVAS_HEIGHT = 400;
export const OFFSET = 50;
```

### Common Pitfalls to Avoid

1. **Don't use regular state for animated values**
   ```typescript
   // ❌ Wrong
   const [height, setHeight] = useState(200);

   // ✅ Correct
   const height = useSharedValue(200);
   ```

2. **Don't forget to type component props**
   ```typescript
   // ❌ Wrong
   const MyComponent = (props) => { ... }

   // ✅ Correct
   const MyComponent = (props: MyComponentProps) => { ... }
   ```

3. **Don't use absolute imports without @/ alias**
   ```typescript
   // ❌ Avoid
   import { rowStyle } from "../../utils/styles";

   // ✅ Prefer
   import { rowStyle } from "@/src/utils/styles";
   ```

4. **Don't modify data structure without updating types**
   ```typescript
   // Always update types.ts when changing data shape
   ```

### Debugging Tips

1. **React Native Debugger**: Use for inspecting component hierarchy
2. **Reanimated DevTools**: Available in Expo dev menu
3. **Console Logs**: Use `console.log` (appears in terminal)
4. **Expo DevTools**: Access via dev menu (shake device or press 'd' in terminal)

---

## Common Tasks

### Adding a New Grocery List Screen

1. Create component in `src/projects/groceryList/components/`
2. Import and use in `src/projects/groceryList/index.tsx`
3. Follow existing patterns (SharedValues for animation, StyleSheet for styles)

### Adding a New Route

1. Open `src/routes/index.tsx`
2. Import new screen component
3. Add `<Stack.Screen>` to navigator
4. Update navigation types if using TypeScript navigation

### Adding New Grocery Item Images

1. Place image in `src/assets/images/groceries/`
2. Update `data.ts` with new item:
   ```typescript
   {
     id: "11",
     name: "newItem",
     image: require("../../assets/images/groceries/newItem.png"),
     quantity: 1,
     x: 100,
     y: 100,
     rotation: degressToRadians(0),
   }
   ```

### Modifying Animation Parameters

**Collapse/Expand Animation** (`listItem.tsx:41-45`):
```typescript
height.value = withSpring(targetHeight, {
  damping: 13,    // Lower = more bouncy
  mass: 0.5,      // Higher = slower
});
```

**Canvas Slide Animation** (`canvas.tsx:89`):
```typescript
bottom: withTiming(isExpanded.value ? 0 : -403, {
  duration: 300,  // Milliseconds
})
```

### Adding Safe Area Support

```typescript
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MyComponent = () => {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top, paddingBottom: bottom }}>
      {/* content */}
    </View>
  );
};
```

---

## Testing & Quality

### Testing Setup

**Framework**: Jest with `jest-expo` preset

**Configuration** (package.json):
```json
{
  "jest": {
    "preset": "jest-expo"
  }
}
```

**Run Tests**:
```bash
npm test          # Run in watch mode
npm test -- --coverage  # With coverage report
```

**Current State**: No test files exist yet (testing infrastructure is set up but unused)

### Linting

**Tool**: Expo's built-in linter

```bash
npm run lint
```

**Note**: No custom ESLint or Prettier config files found. Using Expo defaults.

### Code Quality Checklist

Before committing code, ensure:

- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] Linter passes (`npm run lint`)
- [ ] Animations are smooth on both iOS and Android
- [ ] No console warnings in development
- [ ] Safe area insets are respected
- [ ] Images are optimized (compressed)
- [ ] No hardcoded values that should be constants

---

## Project-Specific Notes

### Current Development Status

**Completed**:
- ✅ Basic grocery list display with FlatList
- ✅ Expandable list items with smooth animations
- ✅ Interactive Skia canvas with pan gestures
- ✅ Canvas minimap for navigation
- ✅ Animated preview of grocery items
- ✅ Dot grid background on canvas

**In Progress / Placeholder**:
- 🚧 Header component (exists but commented out in main screen)
- 🚧 Settings functionality
- 🚧 Button components (empty file: `src/components/buttons/pinButtons.tsx`)

**Future Considerations**:
- Backend integration for data persistence
- User authentication
- Multiple grocery lists
- Sharing lists with others
- Real-time collaboration
- Analytics/tracking

### Recent Changes (Git History)

| Commit | Date | Changes |
|--------|------|---------|
| `646c1f0` | Recent | Canvas map updates, added grocery images |
| `bd2ab75` | Recent | Refined CanvasMap positioning |
| `c5484a3` | Recent | Major refactor: Added CanvasMap, improved animations |
| `d5a8a68` | Earlier | Basic functionality working |
| `93df2d4` | Initial | Project scaffolding |

### Known Issues / Technical Debt

1. **expo-router installed but unused** - Consider removing if React Navigation is the chosen solution
2. **Header component commented out** - Decide if needed or remove
3. **Empty button component file** - Implement or remove
4. **No tests** - Testing infrastructure exists but no tests written
5. **Static data** - Consider migration path to backend/database
6. **No error handling** - Add error boundaries and error states
7. **No loading states** - Consider skeleton loaders for better UX

---

## Quick Reference

### Important Paths

```
Main Screen: src/projects/groceryList/index.tsx
List Card: src/projects/groceryList/components/listItem.tsx
Canvas: src/projects/groceryList/components/canvas.tsx
Data: src/projects/groceryList/data.ts
Types: src/projects/groceryList/types.ts
Navigation: src/routes/index.tsx
Colors: src/constants/Colors.ts
Utils: src/utils/index.ts
```

### Key Constants

```typescript
// Canvas dimensions (canvas.tsx)
CANVAS_WIDTH = width * 0.89
CANVAS_HEIGHT = 400
OFFSET = 50

// Animation values (listItem.tsx)
COLLAPSED_HEIGHT = 200
EXPANDED_HEIGHT = 500
SPRING_CONFIG = { damping: 13, mass: 0.5 }
```

### Useful Commands

```bash
# Development
npx expo start            # Start dev server
npx expo start --clear    # Clear cache and start

# Platform-specific
npx expo run:ios          # Build and run iOS
npx expo run:android      # Build and run Android

# Debugging
npx expo start --devClient  # Use dev client
npx expo doctor            # Check for issues

# Cleanup
rm -rf node_modules .expo  # Clean install
npm install
```

---

## Contact & Resources

### Official Documentation

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Skia](https://shopify.github.io/react-native-skia/)
- [React Navigation](https://reactnavigation.org/)

### Project-Specific Resources

- **Repository**: /home/user/witty
- **Current Branch**: `claude/add-claude-documentation-GTg3i`
- **Main Branch**: (To be determined)

---

**Document Version**: 1.0
**Created**: 2026-01-09
**AI Assistant**: Claude (Sonnet 4.5)

---

## Appendix: TypeScript Types Reference

```typescript
// src/projects/groceryList/types.ts

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
  x?: number;         // Canvas position
  y?: number;         // Canvas position
  rotation?: number;  // In radians
};
```

```typescript
// src/constants/Colors.ts

export const Colors = {
  light: {
    text: string;
    background: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
  };
  dark: {
    text: string;
    background: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
  };
};
```

---

*This document is intended for AI assistants (like Claude) to understand the Witty codebase and provide better assistance to developers. Keep it updated as the project evolves.*
