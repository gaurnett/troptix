/// <reference types="react" />
import { TextStyle } from "react-native";
import Animated from "react-native-reanimated";
interface TextProps {
    text: Animated.Node<string>;
    style?: TextStyle;
}
declare const _default: (props: TextProps) => JSX.Element;
export default _default;
