import { StyleSheet, Text, useWindowDimensions, type TextProps, type TextStyle } from 'react-native';
import { useCustomFonts } from '@/theme/FontContext';
import { colors, fontFamilies } from '@/theme/tokens';
const variants = {
  hero: { fontSize: 30, lineHeight: 36, weight: 'semibold' },
  display: { fontSize: 24, lineHeight: 32, weight: 'semibold' },
  header: { fontSize: 20, lineHeight: 28, weight: 'semibold' },
  heading: { fontSize: 18, lineHeight: 24, weight: 'semibold' },
  title: { fontSize: 18, lineHeight: 24, weight: 'semibold' },
  body: { fontSize: 16, lineHeight: 24, weight: 'regular' },
  label: { fontSize: 16, lineHeight: 24, weight: 'semibold' },
  small: { fontSize: 14, lineHeight: 20, weight: 'regular' },
  overline: { fontSize: 12, lineHeight: 16, weight: 'semibold' },
  tab: { fontSize: 12, lineHeight: 16, weight: 'medium' },
} as const;
const weights = { regular: '400', medium: '500', semibold: '600' } as const;
type AppTextProps = TextProps & { variant?: keyof typeof variants; muted?: boolean };
export function AppText({
  variant = 'body',
  muted = false,
  style,
  allowFontScaling = true,
  maxFontSizeMultiplier = variant === 'tab' ? 1.4 : variant === 'header' ? 1.6 : 2,
  ...props
}: AppTextProps) {
  const custom = useCustomFonts();
  const { fontScale } = useWindowDimensions();
  const { weight, ...typography } = variants[variant];
  const font: TextStyle = custom
    ? { fontFamily: fontFamilies[weight] }
    : { fontWeight: weights[weight] };
  const scaleLimit = maxFontSizeMultiplier ?? 0;
  const clamped = allowFontScaling && scaleLimit > 0 && fontScale > scaleLimit;
  // iOS can measure line height at the full system scale even when the font size is capped.
  const resolvedStyle = clamped ? StyleSheet.flatten([typography, style]) : undefined;
  const clampedStyle = resolvedStyle && {
    fontSize: (resolvedStyle.fontSize ?? typography.fontSize) * scaleLimit,
    lineHeight: (resolvedStyle.lineHeight ?? typography.lineHeight) * scaleLimit,
  };
  return (
    <Text
      accessibilityLanguage="pt-BR"
      allowFontScaling={allowFontScaling && !clamped}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      accessibilityRole={
        ['hero', 'display', 'header', 'heading'].includes(variant) ? 'header' : undefined
      }
      {...props}
      style={[{ color: muted ? colors.muted : colors.text }, typography, font, style, clampedStyle]}
    />
  );
}
