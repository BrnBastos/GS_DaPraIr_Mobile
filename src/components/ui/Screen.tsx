import { router, type Href } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, layout } from '@/theme/tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { PressableSurface } from './PressableSurface';
type Props = PropsWithChildren<{
  title: string;
  description?: string;
  eyebrow?: string;
  backHref?: Href;
  tab?: boolean;
  footer?: ReactNode;
  headerRight?: ReactNode;
  scroll?: boolean;
}>;
export function Screen({
  title,
  description,
  backHref,
  tab = false,
  footer,
  headerRight,
  children,
  scroll = true,
}: Props) {
  const largeText = useWindowDimensions().fontScale >= 1.4;
  return (
    <SafeAreaView
      style={styles.safe}
      edges={tab ? ['top', 'left', 'right'] : ['top', 'left', 'right', 'bottom']}
    >
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          {backHref ? (
            <PressableSurface
              style={styles.back}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={() => (router.canGoBack() ? router.back() : router.replace(backHref))}
            >
              <Icon name="arrow-left" />
            </PressableSurface>
          ) : null}
          {!backHref && title === 'Dá Pra Ir?' ? (
            <View style={styles.brand}>
              <Icon name="navigation" size={20} color={colors.white} />
            </View>
          ) : null}
          <AppText variant="header" style={styles.headerTitle}>
            {title}
          </AppText>
          {!largeText ? headerRight : null}
        </View>
        {largeText && headerRight ? <View style={styles.headerExtra}>{headerRight}</View> : null}
      </View>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            style={styles.fill}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {description ? <AppText muted>{description}</AppText> : null}
            {children}
          </ScrollView>
        ) : (
          <View style={styles.fill}>{children}</View>
        )}
        {footer ? (
          <View style={styles.footer}>
            <View style={styles.footerContent}>{footer}</View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  fill: { flex: 1, backgroundColor: colors.background },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  headerExtra: { paddingHorizontal: 16, paddingBottom: 8, alignItems: 'flex-start' },
  header: {
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
  },
  headerTitle: { flex: 1, flexShrink: 1 },
  back: {
    width: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  brand: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  content: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 32,
    gap: 24,
  },
  footer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
  },
  footerContent: {
    width: '100%',
    maxWidth: layout.maxContentWidth - 32,
    alignSelf: 'center',
    gap: 8,
  },
});
