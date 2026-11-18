import type { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon, type IconName } from '@/components/ui/Icon';
import { colors, layout, spacing } from '@/theme/tokens';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const icons: Record<string, IconName> = {
  index: 'search',
  visitas: 'calendar',
  preferencias: 'sliders',
};

export function AppTabBar({ state, descriptors, navigation, insets }: TabBarProps) {
  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, spacing.xs),
          paddingLeft: Math.max(insets.left, spacing.xs),
          paddingRight: Math.max(insets.right, spacing.xs),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const selected = state.index === index;
        const { options } = descriptors[route.key];
        const title = options.title ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={title}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!selected && !event.defaultPrevented)
                navigation.navigate(route.name, route.params);
            }}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            <View style={[styles.iconArea, selected && styles.selected]}>
              <Icon
                name={icons[route.name] ?? 'circle'}
                size={24}
                color={selected ? colors.primary : colors.muted}
              />
            </View>
            <AppText
              variant="tab"
              style={[styles.label, { color: selected ? colors.primary : colors.muted }]}
            >
              {title}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingTop: spacing.xs,
    gap: spacing.xs,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: 4,
    gap: spacing.xs,
    borderRadius: layout.radius,
  },
  iconArea: {
    minWidth: 56,
    minHeight: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.sage },
  label: { textAlign: 'center' },
  pressed: { opacity: 0.65 },
});
