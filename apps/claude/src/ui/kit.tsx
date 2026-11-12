// Reusable, accessible components. Text sizes multiply by the persisted
// text-scale setting (FW-29) and also respect system Dynamic Type.
import DateTimePicker from '@react-native-community/datetimepicker';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { useEffect, useState, type ReactNode } from 'react';
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
  children, variant = 'body', color = colors.text, weight, style, numberOfLines, center, accessibilityLabel, selectable,
}: {
  children: ReactNode; variant?: Variant; color?: string; weight?: TextStyle['fontWeight']; style?: StyleProp<TextStyle>;
  numberOfLines?: number; center?: boolean; accessibilityLabel?: string; selectable?: boolean;
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
      style={[{ color, fontSize: size, lineHeight: Math.round(size * 1.3), fontWeight: weight ?? (heading ? '700' : variant === 'h3' ? '600' : '400') }, center && { textAlign: 'center' }, style]}
    >
      {children}
    </Text>
  );
}

export function Icon({ name, size = 20, color = colors.text, fallback }: { name: SFSymbol; size?: number; color?: string; fallback?: string }) {
  const scale = useScale();
  return (
    <SymbolView
      name={name}
      size={size * Math.min(scale, 1.5)}
      tintColor={color}
      fallback={<Text style={{ color, fontSize: size }}>{fallback ?? '•'}</Text>}
    />
  );
}

/** Scrollable, keyboard-aware screen body with safe-area bottom padding. */
export function Screen({ children, scroll = true, padded = true, footer }: { children: ReactNode; scroll?: boolean; padded?: boolean; footer?: ReactNode }) {
  const insets = useSafeAreaInsets();
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[padded && { padding: space.lg }, { paddingBottom: space.xxl + (footer ? 0 : insets.bottom), gap: space.md }]}
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
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.canvas }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      {body}
      {footer ? <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.md) }]}>{footer}</View> : null}
    </KeyboardAvoidingView>
  );
}

export function Card({ children, style, onPress, accessibilityLabel, accessibilityHint }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; accessibilityLabel?: string; accessibilityHint?: string }) {
  if (onPress)
    return (
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} accessibilityHint={accessibilityHint}
        style={({ pressed }) => [styles.card, pressed && { backgroundColor: colors.surfaceRaised }, style]}>
        {children}
      </Pressable>
    );
  return <View style={[styles.card, style]}>{children}</View>;
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
    <View style={[styles.btnInner, compact && { paddingVertical: space.sm, paddingHorizontal: space.md }]}>
      {loading || busy ? <ActivityIndicator color={fg} /> : icon ? <Icon name={icon} size={17} color={fg} /> : null}
      <T variant={compact ? 'small' : 'body'} weight="600" color={fg} center>
        {title}
      </T>
    </View>
  );
  const base: StyleProp<ViewStyle> = [styles.btn, compact && { minHeight: minTouch }, isDisabled && { opacity: 0.45 }, style];
  if (variant === 'secondary' && glass && !isDisabled) {
    return (
      <Pressable onPress={handle} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? title} accessibilityHint={accessibilityHint} testID={testID}
        accessibilityState={{ disabled: !!isDisabled, busy: busy || !!loading }} style={base}>
        <GlassView glassEffectStyle="regular" isInteractive colorScheme="dark" style={[StyleSheet.absoluteFill, { borderRadius: radius.md }]} />
        {content}
      </Pressable>
    );
  }
  const bg = variant === 'primary' ? colors.accent : variant === 'danger' ? colors.dangerFill : variant === 'ghost' ? 'transparent' : colors.surfaceRaised;
  return (
    <Pressable onPress={handle} disabled={isDisabled} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? title} accessibilityHint={accessibilityHint} testID={testID}
      accessibilityState={{ disabled: !!isDisabled, busy: busy || !!loading }}
      style={({ pressed }) => [base, { backgroundColor: bg }, variant === 'secondary' && { borderWidth: 1, borderColor: colors.border }, pressed && { opacity: 0.75 }]}>
      {content}
    </Pressable>
  );
}

export function IconButton({ icon, label, onPress, color = colors.text, disabled, fallback, filled }: { icon: SFSymbol; label: string; onPress: () => void; color?: string; disabled?: boolean; fallback?: string; filled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} hitSlop={6}
      style={({ pressed }) => [styles.iconBtn, filled && { backgroundColor: colors.accent }, pressed && { opacity: 0.6 }, disabled && { opacity: 0.35 }]}>
      <Icon name={icon} color={filled ? colors.accentText : color} fallback={fallback} />
    </Pressable>
  );
}

export function Field({ label, error, hint, style, ...props }: TextInputProps & { label: string; error?: string | null; hint?: string }) {
  const scale = useScale();
  return (
    <View style={{ gap: space.xs }}>
      <T variant="small" color={colors.muted} weight="600">{label}</T>
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
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!selected }} accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.chip, selected && { backgroundColor: colors.accent, borderColor: colors.accent }, pressed && { opacity: 0.7 }]}>
      <T variant="small" weight="600" color={selected ? colors.accentText : colors.text}>
        {selected ? '✓ ' : ''}{label}
      </T>
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
            style={[styles.segmentItem, sel && { backgroundColor: colors.accent }]}>
            <T variant="small" weight="600" color={sel ? colors.accentText : colors.text} center>{o.label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Row({ children, style, gap = space.sm }: { children: ReactNode; style?: StyleProp<ViewStyle>; gap?: number }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap, flexWrap: 'wrap' }, style]}>{children}</View>;
}

export function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <View style={{ gap: space.sm, marginTop: space.sm }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <T variant="small" weight="700" color={colors.muted} style={{ textTransform: 'uppercase', letterSpacing: 0.6 }} accessibilityLabel={title}>{title}</T>
        {action}
      </Row>
      {children}
    </View>
  );
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <View style={styles.empty} accessible accessibilityLabel={`${title}. ${body}`}>
      <T variant="h3" center>{title}</T>
      <T color={colors.muted} center>{body}</T>
      {action}
    </View>
  );
}

export function Banner({ tone = 'info', children }: { tone?: 'info' | 'warning' | 'danger' | 'success'; children: ReactNode }) {
  const c = { info: colors.info, warning: colors.warning, danger: colors.danger, success: colors.success }[tone];
  return (
    <View style={[styles.banner, { borderColor: c }]} accessibilityRole="alert">
      <T variant="small" color={c}>{children}</T>
    </View>
  );
}

export function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas, padding: space.xl }}>
      <ActivityIndicator color={colors.accent} size="large" accessibilityLabel="Loading" />
    </View>
  );
}

const STATUS_COLOR: Record<SyncStatus, string> = {
  device_only: colors.muted, saved_on_device: colors.info, waiting: colors.warning, uploaded: colors.success,
  needs_sign_in: colors.warning, needs_attention: colors.danger, not_saved: colors.danger,
};

export function StatusPill({ status, label }: { status: SyncStatus; label?: string }) {
  const c = STATUS_COLOR[status];
  const text = label ?? SYNC_STATUS_LABEL[status];
  return (
    <View style={[styles.pill, { borderColor: c }]} accessible accessibilityLabel={`Upload status: ${text}`}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c }} />
      <View style={{ flexShrink: 1 }}><T variant="caption" color={c} weight="600">{text}</T></View>
    </View>
  );
}

/** Calendar date picker; future dates cannot be chosen when maxToday is set. */
export function DateField({ label, value, onChange, maxToday = true, minimum }: { label: string; value: string; onChange: (d: string) => void; maxToday?: boolean; minimum?: string }) {
  const [open, setOpen] = useState(false);
  const d = parseDate(value);
  const local = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const max = maxToday ? (() => { const t = parseDate(todayLocal()); return new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()); })() : undefined;
  const min = minimum ? (() => { const t = parseDate(minimum); return new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()); })() : undefined;
  return (
    <View style={{ gap: space.xs }}>
      <T variant="small" color={colors.muted} weight="600">{label}</T>
      <Pressable onPress={() => setOpen((o) => !o)} accessibilityRole="button" accessibilityLabel={`${label}: ${formatDateLong(value)}`} accessibilityHint="Opens a date picker"
        style={[styles.input, { justifyContent: 'center' }]}>
        <T>{formatDateLong(value)}</T>
      </Pressable>
      {open && (
        <DateTimePicker
          value={local}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          maximumDate={max}
          minimumDate={min}
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
    <Row style={{ justifyContent: 'space-between' }}>
      <T color={colors.muted}>{k}</T>
      <T weight="600" style={{ flexShrink: 1, textAlign: 'right' }}>{v}</T>
    </Row>
  );
}

export const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg, gap: space.sm, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  btn: { minHeight: 50, borderRadius: radius.md, overflow: 'hidden', justifyContent: 'center' },
  btnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, paddingVertical: space.md, paddingHorizontal: space.lg },
  iconBtn: { minWidth: minTouch, minHeight: minTouch, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  input: { minHeight: minTouch + 4, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceRaised, color: colors.text, paddingHorizontal: space.md, paddingVertical: space.sm },
  chip: { minHeight: 36, paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center' },
  segment: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, padding: 3, borderWidth: 1, borderColor: colors.border },
  segmentItem: { flex: 1, minHeight: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  empty: { alignItems: 'center', gap: space.sm, padding: space.xl, backgroundColor: colors.surface, borderRadius: radius.lg },
  banner: { borderWidth: 1, borderRadius: radius.md, padding: space.md, backgroundColor: colors.surface },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', maxWidth: '100%', flexShrink: 1 },
  footer: { paddingHorizontal: space.lg, paddingTop: space.md, backgroundColor: colors.canvas, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, gap: space.sm },
});
