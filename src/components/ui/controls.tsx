import { useState, type PropsWithChildren, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { colors, fontFamilies, layout } from '@/theme/tokens';
import { useCustomFonts } from '@/theme/FontContext';
import { AppText } from './AppText';
import { Action } from './Action';
import { Icon, type IconName } from './Icon';
import { PressableSurface } from './PressableSurface';

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[ui.card, style]}>{children}</View>;
}
export function Badge({
  label,
  tone = 'soft',
  icon,
}: {
  label: string;
  tone?: 'soft' | 'blue' | 'sage' | 'lavender' | 'peach';
  icon?: IconName;
}) {
  return (
    <View style={[ui.badge, { backgroundColor: colors[tone] }]}>
      {icon ? <Icon name={icon} size={14} /> : null}
      <AppText variant="overline" style={{ flexShrink: 1 }}>
        {label}
      </AppText>
    </View>
  );
}
export function StatusBadge({
  status,
  label,
}: {
  status: 'compatible' | 'barrier' | 'unknown';
  label: string;
}) {
  return (
    <Badge
      tone={status === 'compatible' ? 'sage' : status === 'barrier' ? 'peach' : 'blue'}
      icon={
        status === 'compatible'
          ? 'check-circle'
          : status === 'barrier'
            ? 'alert-triangle'
            : 'help-circle'
      }
      label={label}
    />
  );
}
export function InlineNotice({
  title,
  children,
  tone = 'blue',
}: {
  title?: string;
  children: ReactNode;
  tone?: 'blue' | 'peach' | 'sage';
}) {
  return (
    <View style={[ui.notice, { backgroundColor: colors[tone] }]}>
      <Icon name={tone === 'peach' ? 'alert-circle' : 'info'} size={20} />
      <View style={ui.grow}>
        {title ? <AppText variant="label">{title}</AppText> : null}
        {typeof children === 'string' ? <AppText variant="small">{children}</AppText> : children}
      </View>
    </View>
  );
}
export function ErrorLine({ message }: { message: string | null }) {
  return message ? (
    <View accessibilityRole="alert" accessibilityLiveRegion="assertive" style={ui.error}>
      <Icon name="alert-circle" size={18} color={colors.danger} />
      <AppText variant="small" style={{ color: colors.danger, flex: 1 }}>
        {message}
      </AppText>
    </View>
  ) : null;
}
export function FormField({
  label,
  help,
  error,
  ...props
}: TextInputProps & { label: string; help?: string; error?: string | null }) {
  const custom = useCustomFonts();
  const [focused, setFocused] = useState(false);
  return (
    <View style={ui.gap8}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
        style={[
          ui.input,
          { fontFamily: custom ? fontFamilies.regular : undefined },
          props.multiline && { minHeight: 112, textAlignVertical: 'top' },
          focused && { borderColor: colors.primary, borderWidth: 2 },
          error && { borderColor: colors.danger },
          props.style,
        ]}
      />
      {help ? (
        <AppText variant="small" muted>
          {help}
        </AppText>
      ) : null}
      <ErrorLine message={error ?? null} />
    </View>
  );
}
export function SearchField({
  value,
  onChangeText,
  label = 'Buscar local',
}: {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
}) {
  const custom = useCustomFonts();
  return (
    <View style={ui.search}>
      <Icon name="search" size={20} color={colors.muted} />
      <TextInput
        accessibilityLabel={label}
        placeholder={label}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
        style={{
          flex: 1,
          fontSize: 16,
          lineHeight: 24,
          color: colors.text,
          fontFamily: custom ? fontFamilies.regular : undefined,
          minHeight: 48,
          paddingVertical: 8,
        }}
        placeholderTextColor={colors.muted}
      />
      {value ? <IconButton name="x" label="Limpar busca" onPress={() => onChangeText('')} /> : null}
    </View>
  );
}
export function Chip({
  label,
  selected = false,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: IconName;
}) {
  return (
    <PressableSurface
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={StyleSheet.flatten([
        ui.chip,
        selected && {
          backgroundColor: colors.sage,
          borderColor: colors.primary,
        },
      ])}
    >
      {selected ? (
        <Icon name="check" size={16} color={colors.primary} />
      ) : icon ? (
        <Icon name={icon} size={16} />
      ) : null}
      <AppText
        variant="small"
        style={{
          color: selected ? colors.primary : colors.text,
          flexShrink: 1,
        }}
      >
        {label}
      </AppText>
    </PressableSurface>
  );
}
export function IconButton({
  name,
  label,
  onPress,
  disabled = false,
}: {
  name: IconName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <PressableSurface
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={ui.iconButton}
    >
      <Icon name={name} size={20} color={disabled ? colors.inputBorder : colors.primary} />
    </PressableSurface>
  );
}
export function CheckRow({
  label,
  description,
  checked,
  onPress,
  trailing,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onPress: () => void;
  trailing?: ReactNode;
}) {
  const largeText = useWindowDimensions().fontScale >= 1.4;
  const stackActions = largeText && Boolean(trailing);
  return (
    <View style={[ui.checkContainer, stackActions && { flexDirection: 'column' }]}>
      <PressableSurface
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked }}
        onPress={onPress}
        style={StyleSheet.flatten([
          ui.check,
          stackActions ? { flex: undefined, width: '100%' } : undefined,
        ])}
      >
        <View
          style={[
            ui.checkbox,
            checked && {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
        >
          {checked ? <Icon name="check" color={colors.white} size={16} /> : null}
        </View>
        <View style={ui.grow}>
          <AppText style={checked ? { color: colors.primary } : undefined}>{label}</AppText>
          {description ? (
            <AppText variant="small" muted>
              {description}
            </AppText>
          ) : null}
        </View>
      </PressableSurface>
      {trailing}
    </View>
  );
}
export function Segments({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const largeText = useWindowDimensions().fontScale >= 1.4;
  return (
    <View style={[ui.segments, largeText && { flexDirection: 'column' }]}>
      {options.map((option) => (
        <PressableSurface
          key={option.value}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === option.value }}
          accessibilityLabel={option.label}
          onPress={() => onChange(option.value)}
          style={StyleSheet.flatten([
            ui.segment,
            largeText && { flex: undefined, width: '100%' },
            value === option.value && {
              backgroundColor: colors.white,
              borderColor: colors.border,
            },
          ])}
        >
          <AppText
            variant="small"
            style={{
              textAlign: 'center',
              color: value === option.value ? colors.primary : colors.muted,
            }}
          >
            {option.label}
          </AppText>
        </PressableSurface>
      ))}
    </View>
  );
}
export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <View style={ui.scrim}>
        <View accessibilityViewIsModal style={ui.dialog}>
          <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={ui.gap16}>
            <AppText variant="heading">{title}</AppText>
            <AppText muted>{description}</AppText>
            <Action label={confirmLabel} onPress={onConfirm} />
            <Action label="Cancelar" appearance="text" onPress={onCancel} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
export function Loading({ label = 'Carregando…' }: { label?: string }) {
  return (
    <View style={{ padding: 24, alignItems: 'center', gap: 16 }}>
      <ActivityIndicator color={colors.primary} />
      <AppText muted>{label}</AppText>
    </View>
  );
}
export const ui = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.cardRadius,
    padding: 16,
    gap: 16,
  },
  gap8: { gap: 8 },
  gap16: { gap: 16 },
  grow: { flex: 1, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  notice: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  error: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 8,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    backgroundColor: colors.white,
  },
  search: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingLeft: 16,
    paddingRight: 4,
  },
  chip: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  iconButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  check: {
    flex: 1,
    minHeight: 64,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segments: {
    flexDirection: 'row',
    backgroundColor: colors.soft,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(20,35,27,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    maxHeight: '90%',
    width: '100%',
    maxWidth: 440,
    borderRadius: 20,
    padding: 24,
    gap: 16,
    backgroundColor: colors.white,
  },
});
