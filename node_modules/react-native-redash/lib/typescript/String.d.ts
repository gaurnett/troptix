import Animated from "react-native-reanimated";
export declare type Concatable = Animated.Adaptable<string> | Animated.Adaptable<number>;
export declare const string: (strings: readonly string[], ...values: readonly (string | number | Animated.Node<number> | readonly (number | Animated.Node<number> | readonly (number | Animated.Node<number>)[])[] | Animated.Node<string> | readonly (string | Animated.Node<string> | readonly (string | Animated.Node<string>)[])[])[]) => Animated.Node<string>;
