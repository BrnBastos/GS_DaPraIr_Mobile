import { Link, type Href } from 'expo-router';
import { ActivityIndicator, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, layout } from '@/theme/tokens';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { PressableSurface } from './PressableSurface';
type Props = {
  label: string;
  appearance?: 'solid' | 'outline' | 'text';
  icon?: IconName;
  accessibilityHint?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
} & ({ href: Href; onPress?: never } | { onPress: () => void; href?: never });
export function Action({
  label,
  href,
  onPress,
  appearance = 'solid',
  icon,
  accessibilityHint,
  disabled = false,
  loading = false,
  style,
}: Props) {
  const foreground = appearance === 'solid' ? colors.white : colors.primary;
  const control = (
    <PressableSurface
      accessibilityRole={href ? 'link' : 'button'}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.base,
        styles[appearance],
        (disabled || loading) && styles.disabled,
        style,
      ])}
    >
      {loading ? (
        <ActivityIndicator color={foreground} />
      ) : icon ? (
        <Icon name={icon} size={20} color={foreground} />
      ) : null}
      <AppText variant="label" style={{ color: foreground, flexShrink: 1, textAlign: 'center' }}>
        {label}
      </AppText>
    </PressableSurface>
  );
  return href ? (
    <Link href={href} asChild>
      {control}
    </Link>
  ) : (
    control
  );
}
const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: layout.radius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  solid: { backgroundColor: colors.primary },
  outline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.white },
  text: { minHeight: 48 },
  disabled: { opacity: 0.55 },
});
