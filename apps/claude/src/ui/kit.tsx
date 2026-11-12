// Reusable, accessible components (UI-04 premium density). Text sizes
// multiply by the persisted text-scale setting (FW-29) and also respect
// system Dynamic Type.
import DateTimePicker from '@react-native-community/datetimepicker';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { Children, Fragment, isValidElement, useEffect, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo, ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
  type StyleProp, type TextInputProps, type TextStyle, type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDateLong, parseDate, toDateString, todayLocal } from '../domain/dates';
import { SYNC_STATUS_LABEL, type SyncStatus } from '../domain/types';
import { useApp } from '../state/session';
import { colors, minTouch, radius, space, typeScale } from './theme';

export function useScale() {
  return useApp().settings.textScale || 1;
}

type Variant = keyof typeof typeScale;

export function T({
  children, variant = 'body', color = colors.text, weight, style, numberOfLines, center, accessibilityLabel, selectable, tabular,
}: {
  children: ReactNode; variant?: Variant; color?: string; weight?: TextStyle['fontWeight']; style?: StyleProp<TextStyle>;
  numberOfLines?: number; center?: boolean; accessibilityLabel?: string; selectable?: boolean; tabular?: boolean;
}) {
  const scale = useScale();
  const size = typeScale[variant] * scale;
  const heading = variant === 'display' || variant === 'title' || variant === 'h2';
  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={Math.max(1, 2 / scale)}
      numberOfLines={numberOfLines}
      selectable={selectable}
      accessibilityRole={heading ? 'header' : undefined}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          color, fontSize: size, lineHeight: Math.round(size * (heading ? 1.22 : 1.34)),
          fontWeight: weight ?? (variant === 'display' || variant === 'title' ? '700' : variant === 'h2' || variant === 'h3' ? '600' : '400'),
          letterSpacing: variant === 'display' ? 0.2 : variant === 'caption' ? 0.1 : -0.1,
        },
        tabular && { fontVariant: ['tabular-nums'] },
        center && { textAlign: 'center' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Icon({ name, size = 18, color = colors.text, fallback }: { name: SFSymbol; size?: number; color?: string; fallback?: string }) {
  const scale = useScale();
  return (
    <SymbolView name={name} size={size * Math.min(scale, 1.5)} tintColor={color} weight="medium"
      fallback={<Text style={{ color, fontSize: size }}>{fallback ?? '•'}</Text>} />
  );
}

/** Scrollable, keyboard-aware screen body; content flows under the translucent header. */
export function Screen({ children, scroll = true, padded = true, footer }: { children: ReactNode; scroll?: boolean; padded?: boolean; footer?: ReactNode }) {
  const insets = useSafeAreaInsets();
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[padded && { paddingHorizontal: space.lg, paddingTop: space.sm }, { paddingBottom: space.xxl + (footer ? 0 : insets.bottom + 56), gap: space.md }]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.canvas }}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1, backgroundColor: colors.canvas }, padded && { padding: space.lg }]}>{children}</View>
  );
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.canvas }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {body}
      {footer ? <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.md) }]}>{footer}</View> : null}
    </KeyboardAvoidingView>
  );
}

export function Card({ children, style, onPress, accessibilityLabel, accessibilityHint }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; accessibilityLabel?: string; accessibilityHint?: string }) {
  if (onPress)
    return (
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} accessibilityHint={accessibilityHint}
        style={({ pressed }) => [styles.card, pressed && { backgroundColor: colors.surfacePressed }, style]}>
        {children}
      </Pressable>
    );
  return <View style={[styles.card, style]}>{children}</View>;
}

/** iOS inset-grouped container with hairline separators between rows. */
export function Group({ children, header, footer }: { children: ReactNode; header?: string; footer?: string }) {
  const items = Children.toArray(children).filter((c) => isValidElement(c));
  return (
    <View style={{ gap: 6 }}>
      {header ? <SectionLabel>{header}</SectionLabel> : null}
      <View style={styles.group}>
        {items.map((c, i) => (
          <Fragment key={i}>
            {i > 0 ? <View style={styles.separator} /> : null}
            {c}
          </Fragment>
        ))}
      </View>
      {footer ? <T variant="caption" color={colors.faint} style={{ paddingHorizontal: space.md }}>{footer}</T> : null}
    </View>
  );
}

export function ListItem({
  title, subtitle, value, icon, iconColor = colors.accent, onPress, chevron = !!onPress, destructive, right, accessibilityLabel, numberOfLines = 1,
}: {
  title: string; subtitle?: string | null; value?: string | null; icon?: SFSymbol; iconColor?: string; onPress?: () => void; chevron?: boolean;
  destructive?: boolean; right?: ReactNode; accessibilityLabel?: string; numberOfLines?: number;
}) {
  const content = (
    <View style={styles.listItem}>
      {icon ? (
        <View style={[styles.listIcon, { backgroundColor: destructive ? colors.dangerSoft : colors.accentSoft }]}>
          <Icon name={icon} size={15} color={destructive ? colors.danger : iconColor} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 1 }}>
        <T weight="500" color={destructive ? colors.danger : colors.text} numberOfLines={numberOfLines}>{title}</T>
        {subtitle ? <T variant="small" color={colors.muted} numberOfLines={2}>{subtitle}</T> : null}
      </View>
      {value ? <T variant="small" color={colors.muted} tabular numberOfLines={1} style={{ maxWidth: '45%', textAlign: 'right' }}>{value}</T> : null}
      {right}
      {chevron ? <Icon name="chevron.right" size={12} color={colors.faint} fallback="›" /> : null}
    </View>
  );
  const label = accessibilityLabel ?? [title, subtitle, value].filter(Boolean).join(', ');
  if (!onPress) return <View accessible accessibilityLabel={label}>{content}</View>;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => pressed && { backgroundColor: colors.surfacePressed }}>
      {content}
    </Pressable>
  );
}

function useGlass() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceTransparencyEnabled().then(setReduce).catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduce);
    return () => sub.remove();
  }, []);
  let available = false;
  try {
    available = Platform.OS === 'ios' && isLiquidGlassAvailable();
  } catch {
    available = false;
  }
  return available && !reduce;
}

export function Button({
  title, onPress, variant = 'primary', disabled, loading, icon, accessibilityHint, accessibilityLabel, compact, style, testID,
}: {
  title: string; onPress: () => void | Promise<void>; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; disabled?: boolean; loading?: boolean;
  icon?: SFSymbol; accessibilityHint?: string; accessibilityLabel?: string; compact?: boolean; style?: StyleProp<ViewStyle>; testID?: string;
}) {
  const glass = useGlass();
  const [busy, setBusy] = useState(false);
  const isDisabled = disabled || loading || busy;
  const fg = variant === 'primary' ? colors.accentText : variant === 'danger' ? colors.danger : variant === 'ghost' ? colors.accent : colors.text;
  const handle = async () => {
    if (isDisabled) return;
    setBusy(true);
    try {
      await onPress();
    } finally {
      setBusy(false);
    }
  };
  const content = (
    <View style={[styles.btnInner, compact && { paddingVertical: 6, paddingHorizontal: space.md }]}>
      {loading ? <ActivityIndicator color={fg} size="small" /> : icon ? <Icon name={icon} size={compact ? 13 : 15} color={fg} /> : null}
      <T variant={compact ? 'small' : 'body'} weight="600" color={fg} center>{title}</T>
    </View>
  );
  const base: StyleProp<ViewStyle> = [styles.btn, compact && { minHeight: 34, borderRadius: radius.pill, alignSelf: 'flex-start' }, isDisabled && !busy && { opacity: 0.4 }, style];
  const a11y = { accessibilityRole: 'button' as const, accessibilityLabel: accessibilityLabel ?? title, accessibilityHint, testID, accessibilityState: { disabled: !!isDisabled, busy: busy || !!loading } };
  const hit = compact ? { top: 6, bottom: 6, left: 4, right: 4 } : undefined;
  if (variant === 'secondary' && glass && !isDisabled) {
    return (
      <Pressable onPress={handle} hitSlop={hit} {...a11y} style={base}>
        <GlassView glassEffectStyle="regular" isInteractive colorScheme="dark" style={[StyleSheet.absoluteFill, { borderRadius: compact ? radius.pill : radius.lg }]} />
        {content}
      </Pressable>
    );
  }
  const bg = variant === 'primary' ? colors.accent : variant === 'danger' ? colors.dangerSoft : variant === 'ghost' ? 'transparent' : colors.surfaceRaised;
  return (
    <Pressable onPress={handle} disabled={isDisabled} hitSlop={hit} {...a11y}
      style={({ pressed }) => [base, { backgroundColor: bg }, pressed && { opacity: 0.7, transform: [{ scale: 0.985 }] }]}>
      {content}
    </Pressable>
  );
}

export function IconButton({ icon, label, onPress, color = colors.text, disabled, fallback, filled, size = 18, tint }: { icon: SFSymbol; label: string; onPress: () => void; color?: string; disabled?: boolean; fallback?: string; filled?: boolean; size?: number; tint?: string }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} hitSlop={6}
      style={({ pressed }) => [styles.iconBtn, filled && { backgroundColor: tint ?? colors.accent }, pressed && { opacity: 0.55 }, disabled && { opacity: 0.3 }]}>
      <Icon name={icon} size={size} color={filled ? colors.accentText : color} fallback={fallback} />
    </Pressable>
  );
}

export function Field({ label, error, hint, style, ...props }: TextInputProps & { label: string; error?: string | null; hint?: string }) {
  const scale = useScale();
  return (
    <View style={{ gap: 5 }}>
      <T variant="small" color={colors.muted} weight="500">{label}</T>
      <TextInput
        placeholderTextColor={colors.faint}
        keyboardAppearance="dark"
        accessibilityLabel={label}
        accessibilityHint={error ?? hint}
        maxFontSizeMultiplier={Math.max(1, 2 / scale)}
        style={[styles.input, { fontSize: typeScale.body * scale }, error ? { borderColor: colors.danger } : null, style]}
        {...props}
      />
      {error ? <T variant="small" color={colors.danger} accessibilityLabel={`Error: ${error}`}>{error}</T> : hint ? <T variant="caption" color={colors.faint}>{hint}</T> : null}
    </View>
  );
}

export function Chip({ label, selected, onPress, accessibilityLabel }: { label: string; selected?: boolean; onPress: () => void; accessibilityLabel?: string }) {
  return (
    <Pressable onPress={onPress} hitSlop={{ top: 6, bottom: 6 }} accessibilityRole="button" accessibilityState={{ selected: !!selected }} accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.chip, selected && { backgroundColor: colors.accent, borderColor: colors.accent }, pressed && { opacity: 0.7 }]}>
      <T variant="small" weight="500" color={selected ? colors.accentText : colors.text}>{label}</T>
    </Pressable>
  );
}

export function Segmented<V extends string>({ options, value, onChange, label }: { options: { value: V; label: string }[]; value: V; onChange: (v: V) => void; label: string }) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.segment}>
      {options.map((o) => {
        const sel = o.value === value;
        return (
          <Pressable key={o.value} onPress={() => onChange(o.value)} accessibilityRole="radio" accessibilityState={{ checked: sel }} accessibilityLabel={`${label}: ${o.label}`}
            style={[styles.segmentItem, sel && styles.segmentSelected]}>
            <T variant="small" weight={sel ? '600' : '500'} color={sel ? colors.text : colors.muted} center numberOfLines={2}>{o.label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Row({ children, style, gap = space.sm }: { children: ReactNode; style?: StyleProp<ViewStyle>; gap?: number }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap, flexWrap: 'wrap' }, style]}>{children}</View>;
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <T variant="caption" weight="600" color={colors.faint} style={{ textTransform: 'uppercase', letterSpacing: 0.6, paddingHorizontal: space.md }} accessibilityLabel={children}>
      {children}
    </T>
  );
}

export function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <View style={{ gap: 6, marginTop: space.xs }}>
      <Row style={{ justifyContent: 'space-between', minHeight: 22 }}>
        <SectionLabel>{title}</SectionLabel>
        {action}
      </Row>
      {children}
    </View>
  );
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={{ flex: 1, minWidth: 90, gap: 2 }} accessible accessibilityLabel={`${label}: ${value}${sub ? `, ${sub}` : ''}`}>
      <T variant="caption" color={colors.faint} weight="600" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</T>
      <T variant="h2" tabular>{value}</T>
      {sub ? <T variant="caption" color={colors.muted}>{sub}</T> : null}
    </View>
  );
}

export function Empty({ title, body, action, icon = 'sparkles' }: { title: string; body: string; action?: ReactNode; icon?: SFSymbol }) {
  return (
    <View style={styles.empty} accessible accessibilityLabel={`${title}. ${body}`}>
      <Icon name={icon} size={22} color={colors.faint} />
      <T variant="h3" center>{title}</T>
      <T variant="small" color={colors.muted} center>{body}</T>
      {action}
    </View>
  );
}

export function Banner({ tone = 'info', children }: { tone?: 'info' | 'warning' | 'danger' | 'success'; children: ReactNode }) {
  const c = { info: colors.info, warning: colors.warning, danger: colors.danger, success: colors.success }[tone];
  return (
    <View style={[styles.banner, { borderLeftColor: c }]} accessibilityRole="alert">
      <T variant="small" color={colors.text}>{children}</T>
    </View>
  );
}

export function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas, padding: space.xl }}>
      <ActivityIndicator color={colors.accent} accessibilityLabel="Loading" />
    </View>
  );
}

const STATUS_COLOR: Record<SyncStatus, string> = {
  device_only: colors.muted, saved_on_device: colors.info, waiting: colors.warning, uploaded: colors.success,
  needs_sign_in: colors.warning, needs_attention: colors.danger, not_saved: colors.danger,
};
const STATUS_SHORT: Record<SyncStatus, string> = {
  device_only: 'On this device', saved_on_device: 'Saved', waiting: 'Waiting to upload', uploaded: 'Uploaded',
  needs_sign_in: 'Needs sign-in', needs_attention: 'Needs attention', not_saved: 'Not saved',
};

export function StatusPill({ status, label, short }: { status: SyncStatus; label?: string; short?: boolean }) {
  const c = STATUS_COLOR[status];
  const text = label ?? (short ? STATUS_SHORT[status] : SYNC_STATUS_LABEL[status]);
  return (
    <View style={styles.pill} accessible accessibilityLabel={`Upload status: ${SYNC_STATUS_LABEL[status]}`}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c }} />
      <View style={{ flexShrink: 1 }}><T variant="caption" color={colors.muted} weight="500">{text}</T></View>
    </View>
  );
}

/** Calendar date picker; future dates cannot be chosen when maxToday is set. */
export function DateField({ label, value, onChange, maxToday = true, minimum }: { label: string; value: string; onChange: (d: string) => void; maxToday?: boolean; minimum?: string }) {
  const [open, setOpen] = useState(false);
  const toLocal = (s: string) => { const d = parseDate(s); return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); };
  return (
    <View style={{ gap: 5 }}>
      <T variant="small" color={colors.muted} weight="500">{label}</T>
      <Pressable onPress={() => setOpen((o) => !o)} accessibilityRole="button" accessibilityLabel={`${label}: ${formatDateLong(value)}`} accessibilityHint="Opens a date picker"
        style={[styles.input, { justifyContent: 'center' }]}>
        <T>{formatDateLong(value)}</T>
      </Pressable>
      {open && (
        <DateTimePicker
          value={toLocal(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          maximumDate={maxToday ? toLocal(todayLocal()) : undefined}
          minimumDate={minimum ? toLocal(minimum) : undefined}
          themeVariant="dark"
          accentColor={colors.accent}
          onChange={(_e, date) => {
            if (Platform.OS !== 'ios') setOpen(false);
            if (date) onChange(toDateString(date));
          }}
        />
      )}
    </View>
  );
}

export function KeyValue({ k, v }: { k: string; v: string }) {
  return (
    <Row style={{ justifyContent: 'space-between', minHeight: 26 }}>
      <T variant="small" color={colors.muted}>{k}</T>
      <T variant="small" weight="600" tabular style={{ flexShrink: 1, textAlign: 'right' }}>{v}</T>
    </Row>
  );
}

export const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md + 2, gap: space.sm },
  group: { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden' },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.separator, marginLeft: space.lg },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: minTouch + 4, paddingVertical: 9, paddingHorizontal: space.lg },
  listIcon: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  btn: { minHeight: 46, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'center' },
  btnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: space.lg },
  iconBtn: { minWidth: 36, minHeight: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  input: { minHeight: 42, borderRadius: radius.md, backgroundColor: colors.surfaceRaised, color: colors.text, paddingHorizontal: space.md, paddingVertical: 8, borderWidth: 1, borderColor: 'transparent' },
  chip: { minHeight: 30, paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.pill, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center' },
  segment: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, padding: 2 },
  segmentItem: { flex: 1, minHeight: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, paddingVertical: 4 },
  segmentSelected: { backgroundColor: colors.surfaceRaised, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  empty: { alignItems: 'center', gap: 6, paddingVertical: space.xl, paddingHorizontal: space.lg, backgroundColor: colors.surface, borderRadius: radius.lg },
  banner: { borderLeftWidth: 3, borderRadius: radius.sm, padding: space.md, backgroundColor: colors.surface },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start', backgroundColor: colors.surface, maxWidth: '100%', flexShrink: 1 },
  footer: { paddingHorizontal: space.lg, paddingTop: space.sm, backgroundColor: colors.canvas, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.separator, gap: space.sm },
});
