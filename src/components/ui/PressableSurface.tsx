import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

type PressableSurfaceProps = Omit<ComponentProps<typeof Pressable>, 'style'> & {
  style?: StyleProp<ViewStyle>;
};

// Link asChild combina objetos de estilo. A função de estado pressionado fica
// dentro desta superfície para não ser descartada pelo Slot do Expo Router.
export function PressableSurface({ style, ...props }: PressableSurfaceProps) {
  return <Pressable {...props} style={({ pressed }) => [style, pressed && styles.pressed]} />;
}

const styles = StyleSheet.create({ pressed: { opacity: 0.65 } });
