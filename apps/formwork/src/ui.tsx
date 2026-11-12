import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AccessibilityInfo, ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, TextInputProps, TextProps, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, ChevronRight, X } from 'lucide-react-native';
import { dateKey, parseDay, prettyDay } from './model';

export const c = {
  bg: '#131412', panel: '#1d1f1b', raised: '#252720', rule: '#363830',
  ink: '#f5f1e8', muted: '#b5b6a9', accent: '#ebce9a', dark: '#1b170f',
  green: '#b7cb9e', danger: '#ffa99e', olive: '#282c21',
};
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.bg },
  page: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 34, gap: 18 },
  panel: { backgroundColor: c.panel, borderRadius: 22, padding: 17, borderWidth: 1, borderColor: c.rule, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  spread: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  wrap: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  column: { gap: 10 },
  flex: { flex: 1, minWidth: 0 },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: c.rule },
});

export const FontScale = createContext(1);
const Transparency = createContext(false);
export function UIEnvironment({ scale, children }: { scale: number; children: React.ReactNode }) {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    void AccessibilityInfo.isReduceTransparencyEnabled().then(setReduce);
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduce);
    return () => sub.remove();
  }, []);
  return <FontScale.Provider value={scale}><Transparency.Provider value={reduce}>{children}</Transparency.Provider></FontScale.Provider>;
}
const sizes = { tiny: 11, small: 13, body: 15, label: 16, sub: 21, title: 32, hero: 43, metric: 35 };
type TextKind = keyof typeof sizes;
export function T({ kind = 'body', color = c.ink, style, ...props }: TextProps & { kind?: TextKind; color?: string }) {
  const scale = useContext(FontScale);
  return <Text {...props} style={[{ color, fontSize: sizes[kind] * scale, fontWeight: ['label', 'sub', 'title', 'hero', 'metric'].includes(kind) ? '700' : '400',
    letterSpacing: kind === 'tiny' ? 1.2 : kind === 'hero' ? -2 : kind === 'title' ? -0.9 : undefined }, style]} />;
}
export const Kicker = ({ children, color = c.accent }: { children: React.ReactNode; color?: string }) =>
  <T kind="tiny" color={color} style={{ fontWeight: '700', textTransform: 'uppercase' }}>{children}</T>;

type Tone = 'primary' | 'secondary' | 'quiet' | 'danger';
export function Button({ label, onPress, tone = 'secondary', icon, disabled, testID, compact = false }: {
  label: string; onPress: () => void; tone?: Tone; icon?: React.ReactNode; disabled?: boolean; testID?: string; compact?: boolean;
}) {
  const reduce = useContext(Transparency);
  const glass = !disabled && !reduce && (tone === 'primary' || tone === 'secondary')
    && Platform.OS === 'ios' && isGlassEffectAPIAvailable();
  const foreground = disabled ? c.muted : tone === 'primary' && !glass ? c.dark : tone === 'danger' ? c.danger : tone === 'primary' ? c.ink : c.accent;
  const background = disabled ? c.raised : tone === 'primary' ? c.accent : tone === 'quiet' ? 'transparent' : tone === 'danger' ? '#352421' : c.raised;
  const shape = { borderRadius: compact ? 14 : 17, minHeight: compact ? 44 : 51 };
  const content = <View style={{ minHeight: shape.minHeight, paddingVertical: 10, paddingHorizontal: compact ? 12 : 16, gap: 8, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
    {icon}<T kind={compact ? 'small' : 'label'} color={foreground} style={{ flexShrink: 1, fontWeight: '700', textAlign: 'center' }}>{label}</T>
  </View>;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }} testID={testID} disabled={disabled}
    onPress={onPress} style={({ pressed }) => [shape, { opacity: pressed ? 0.72 : 1, backgroundColor: glass ? 'transparent' : background }]}>
    {glass ? <GlassView style={shape} glassEffectStyle="regular" isInteractive colorScheme="dark"
      tintColor={tone === 'primary' ? '#98754b88' : '#3a3c33aa'}>{content}</GlassView> : content}
  </Pressable>;
}

export function IconButton({ label, children, onPress }: { label: string; children: React.ReactNode; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
    style={({ pressed }) => ({ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: c.raised, opacity: pressed ? 0.7 : 1 })}>{children}</Pressable>;
}
export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: !!selected }} onPress={onPress}
    style={{ minHeight: 44, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, justifyContent: 'center',
      backgroundColor: selected ? '#4a3f2e' : c.raised, borderWidth: 1, borderColor: selected ? '#907752' : c.rule }}>
    <T kind="small" color={selected ? c.accent : c.muted}>{label}</T>
  </Pressable>;
}
export function Badge({ label, color = c.accent }: { label: string; color?: string }) {
  return <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: c.raised }}>
    <T kind="tiny" color={color} style={{ fontWeight: '700', letterSpacing: 0.5 }}>{label}</T>
  </View>;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const scale = useContext(FontScale);
  return <View style={{ gap: 5 }}>
    <T kind="small" color={c.muted}>{label}</T>
    <TextInput {...props} accessibilityLabel={label} placeholderTextColor="#a5a599" selectionColor={c.accent} keyboardAppearance="dark"
      style={[{ minHeight: 48, paddingVertical: 11, paddingHorizontal: 12, backgroundColor: c.raised, borderWidth: 1, borderColor: c.rule,
        borderRadius: 13, color: c.ink, fontSize: 16 * scale }, props.style]} />
  </View>;
}
export function NumberField({ label, value, onChangeText, decimal, placeholder }: {
  label: string; value: string; onChangeText: (s: string) => void; decimal?: boolean; placeholder?: string;
}) {
  return <Field label={label} value={value} onChangeText={onChangeText} keyboardType={decimal ? 'decimal-pad' : 'number-pad'} placeholder={placeholder} />;
}

export function DayField({ label, value, onChange, future, optional }: {
  label: string; value: string; onChange: (value: string) => void; future?: boolean; optional?: boolean;
}) {
  const [show, setShow] = useState(false);
  return <View style={s.column}>
    <T kind="small" color={c.muted}>{label}</T>
    <View style={s.wrap}>
      <Chip label={value ? prettyDay(value) : 'Choose date'} onPress={() => setShow(!show)} selected={show} />
      {optional && value ? <Button label="Clear" compact tone="quiet" onPress={() => { onChange(''); setShow(false); }} /> : null}
    </View>
    {show ? <DateTimePicker accessibilityLabel={label} value={parseDay(value || dateKey())} themeVariant="dark"
      mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} maximumDate={future ? undefined : parseDay(dateKey())}
      accentColor={c.accent} onChange={(event, date) => {
        if (date && event.type !== 'dismissed') onChange(dateKey(date));
        if (Platform.OS !== 'ios') setShow(false);
      }} /> : null}
  </View>;
}

export function Header({ eyebrow, title, subtitle, action, back }: {
  eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode; back?: () => void;
}) {
  return <View style={{ gap: 8 }}>
    {back ? <View style={s.row}><IconButton label="Go back" onPress={back}><ArrowLeft size={21} color={c.accent} /></IconButton>{eyebrow ? <Kicker>{eyebrow}</Kicker> : null}</View> : eyebrow ? <Kicker>{eyebrow}</Kicker> : null}
    <View style={s.spread}><T kind="title" style={s.flex} accessibilityRole="header">{title}</T>{action}</View>
    {subtitle ? <T color={c.muted}>{subtitle}</T> : null}
  </View>;
}
export function Page({ children, top = true, onNearEnd }: { children: React.ReactNode; top?: boolean; onNearEnd?: () => void }) {
  return <SafeAreaView style={s.screen} edges={top ? ['top', 'left', 'right'] : ['left', 'right']}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        onScroll={onNearEnd ? ({ nativeEvent: n }) => {
          if (n.contentOffset.y > 0 && n.layoutMeasurement.height + n.contentOffset.y > n.contentSize.height - 160) onNearEnd();
        } : undefined} scrollEventThrottle={250}>{children}</ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <Modal animationType="slide" presentationStyle="pageSheet" visible onRequestClose={onClose}>
    <SafeAreaView style={s.screen}>
      <View style={{ ...s.spread, paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.rule }}>
        <T kind="sub" style={s.flex} accessibilityRole="header">{title}</T>
        <IconButton label="Close" onPress={onClose}><X color={c.accent} size={22} /></IconButton>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">{children}</ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </Modal>;
}
export function Item({ title, subtitle, onPress, lead, end }: {
  title: string; subtitle?: string; onPress: () => void; lead?: React.ReactNode; end?: React.ReactNode;
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={subtitle ? title + ', ' + subtitle : title} onPress={onPress}
    style={({ pressed }) => [s.row, { minHeight: 61, paddingVertical: 9, opacity: pressed ? 0.7 : 1 }]}>
    {lead}<View style={[s.flex, { gap: 4 }]}><T kind="label">{title}</T>{subtitle ? <T kind="small" color={c.muted}>{subtitle}</T> : null}</View>
    {end ?? <ChevronRight color={c.muted} size={18} />}
  </Pressable>;
}
export function Empty({ title, detail }: { title: string; detail: string }) {
  return <View style={s.panel}><T kind="sub">{title}</T><T color={c.muted}>{detail}</T></View>;
}
export function ErrorNote({ message }: { message?: string }) {
  return message ? <View style={[s.panel, { backgroundColor: '#382724' }]} accessibilityRole="alert"><T color={c.danger}>{message}</T></View> : null;
}
export function Loading() {
  return <View style={[s.screen, { alignItems: 'center', justifyContent: 'center', gap: 10 }]}>
    <ActivityIndicator color={c.accent} /><T color={c.muted}>Opening your journal…</T>
  </View>;
}
export function useAction() {
  const [error, setError] = useState('');
  const run = (action: () => void) => {
    try { action(); setError(''); return true; }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Something went wrong.'); return false; }
  };
  return { error, setError, run };
}
export const confirm = (title: string, message: string, label: string, action: () => void) =>
  Alert.alert(title, message, [{ text: 'Cancel', style: 'cancel' }, { text: label, style: 'destructive', onPress: action }]);
