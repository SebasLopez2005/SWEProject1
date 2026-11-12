import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import {
  AccessibilityInfo, ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet,
  Text, TextInput, View, type TextInputProps, type TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  dateKey, formatDate, localDate, muscles, rootKey, searchExercises, typeLabels, type Exercise, type Root,
} from './domain';
import { useApp } from './session';

export const c = {
  bg: '#101115',
  surface: '#191B21',
  raised: '#252832',
  line: '#383B46',
  text: '#F5F2EE',
  muted: '#B6B9C4',
  accent: '#E3BF89',
  accentSurface: '#3B3026',
  accentLine: '#745A3E',
  chartPartial: '#A58966',
  error: '#FFB8B8',
  errorSurface: '#3B2228',
  warning: '#F6CB8F',
};
const buttonMaterial = {
  primary: { foreground: '#FFE8C5', fill: '#493623', pressed: '#5B442C', rim: '#795A3C', tint: '#936C42A8' },
  secondary: { foreground: c.text, fill: c.raised, pressed: '#333744', rim: '#454954', tint: '#53566488' },
  quiet: { foreground: c.text, fill: c.surface, pressed: c.raised, rim: c.line, tint: undefined },
  danger: { foreground: c.error, fill: c.errorSurface, pressed: '#532C35', rim: '#70434A', tint: '#75424A99' },
  dark: { foreground: c.accent, fill: c.surface, pressed: c.raised, rim: c.line, tint: undefined },
};

const GlassControls = createContext(false);
export function GlassControlsProvider({ children }: { children: ReactNode }) {
  const [useGlass, setUseGlass] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'ios' || !isGlassEffectAPIAvailable() || !isLiquidGlassAvailable()) return;
    let awaitingInitialPreference = true;
    const subscription = AccessibilityInfo.addEventListener('reduceTransparencyChanged', reduceTransparency => {
      awaitingInitialPreference = false;
      setUseGlass(!reduceTransparency);
    });
    void AccessibilityInfo.isReduceTransparencyEnabled().then(reduceTransparency => {
      if (awaitingInitialPreference) setUseGlass(!reduceTransparency);
    }, () => {
      // Keep the opaque treatment when the system preference cannot be read.
    });
    return () => {
      awaitingInitialPreference = false;
      subscription.remove();
    };
  }, []);
  return <GlassControls.Provider value={useGlass}>{children}</GlassControls.Provider>;
}

type IconName = ComponentProps<typeof Ionicons>['name'];
export function Icon({ name, size = 22, color = c.text }: { name: IconName; size?: number; color?: string }) {
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <Ionicons name={name} size={size} color={color} accessible={false} />
  </View>;
}
const variants = {
  display: { fontSize: 40, fontWeight: '700', letterSpacing: -1.7 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -1.2 },
  h2: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  body: { fontSize: 16, fontWeight: '400' },
  strong: { fontSize: 16, fontWeight: '700' },
  small: { fontSize: 14, fontWeight: '500' },
  label: { fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
} satisfies Record<string, TextStyle>;
export function Txt({ children, variant = 'body', color = c.text, style, live }: {
  children: ReactNode; variant?: keyof typeof variants; color?: string; style?: TextStyle; live?: boolean;
}) {
  const scale = useApp()?.model?.settings.scale ?? 1;
  const base = variants[variant];
  return <Text accessibilityRole={['display', 'title', 'h2'].includes(variant) ? 'header' : undefined}
    accessibilityLiveRegion={live ? 'polite' : undefined}
    style={[base, { color, fontSize: base.fontSize * scale }, style]}>{children}</Text>;
}
export function Row({ children, between = false }: { children: ReactNode; between?: boolean }) {
  return <View style={[styles.row, between && { justifyContent: 'space-between' }]}>{children}</View>;
}
export function Card({ children, featured = false }: { children: ReactNode; featured?: boolean }) {
  return <View style={[styles.card, featured && styles.featured]}>
    {featured && <LinearGradient colors={['#362C25', '#222127', '#191B21']}
      start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} pointerEvents="none" style={StyleSheet.absoluteFill} />}
    {children}
  </View>;
}
export function Button({ label, onPress, icon, tone = 'primary', disabled, compact }: {
  label: string; onPress(): void; icon?: IconName; tone?: keyof typeof buttonMaterial;
  disabled?: boolean; compact?: boolean;
}) {
  const useGlass = useContext(GlassControls) && !disabled;
  const { foreground, fill, pressed, rim, tint } = buttonMaterial[tone];
  const alignment = compact ? styles.compactControl : styles.fullControl;
  const control = <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }}
    disabled={disabled} onPress={onPress}
    style={({ pressed: isPressed }) => [
      styles.button,
      !useGlass && [alignment, styles.opaqueButton, {
        backgroundColor: isPressed ? pressed : fill, borderColor: rim, opacity: disabled ? .48 : 1,
      }],
    ]}>
    {icon && <Icon name={icon} size={19} color={foreground} />}
    <Txt variant="strong" color={foreground} style={{ flexShrink: 1, textAlign: 'center' }}>{label}</Txt>
  </Pressable>;

  if (!useGlass) return control;
  return <GlassView style={[alignment, styles.glass]} colorScheme="dark" tintColor={tint} isInteractive>
    {control}
  </GlassView>;
}
export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress(): void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: !!selected }} onPress={onPress}
    style={[styles.chip, selected && { backgroundColor: c.accentSurface, borderColor: c.accentLine }]}>
    <Txt variant="small" color={selected ? c.accent : c.text}>{label}</Txt>
  </Pressable>;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const initialValue = useRef(props.defaultValue);
  const scale = useApp()?.model?.settings.scale ?? 1;
  return <View style={{ gap: 6 }}>
    <Txt variant="small" color={c.muted}>{label}</Txt>
    <TextInput accessibilityLabel={label} placeholderTextColor={c.muted} keyboardAppearance="dark" selectionColor={c.accent} {...props} defaultValue={initialValue.current}
      style={[styles.input, { fontSize: 16 * scale }, props.style]} />
  </View>;
}
export function DateField({ label, value, onChange, clear }: {
  label: string; value: string; onChange(value: string): void; clear?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value || dateKey());
  return <View style={{ gap: 6 }}>
    <Txt variant="small" color={c.muted}>{label}</Txt>
    <Row>
      <Button label={value ? formatDate(value) : 'Choose date'} tone="secondary" icon="calendar-outline" compact
        onPress={() => { setDraft(value || dateKey()); setOpen(true); }} />
      {clear && !!value && <Button label={'Clear ' + label.toLowerCase()} tone="quiet" compact onPress={() => onChange('')} />}
    </Row>
    {open && (Platform.OS === 'android'
      ? <DateTimePicker value={localDate(draft)} maximumDate={new Date()} mode="date" onChange={(_, selected) => {
        setOpen(false);
        if (selected) onChange(dateKey(selected));
      }} />
      : <View style={{ gap: 8 }}>
        <DateTimePicker value={localDate(draft)} maximumDate={new Date()} mode="date" display="inline" themeVariant="dark" accentColor={c.accent}
          onChange={(_, selected) => { if (selected) setDraft(dateKey(selected)); }} />
        <Row><Button label="Use date" compact onPress={() => { onChange(draft); setOpen(false); }} />
          <Button label="Cancel date" compact tone="quiet" onPress={() => setOpen(false)} /></Row>
      </View>)}
  </View>;
}

export function Page({ title, kicker, subtitle, back = false, children, onEnd }: {
  title: string; kicker?: string; subtitle?: string; back?: boolean; children: ReactNode; onEnd?(): void;
}) {
  const router = useRouter();
  return <SafeAreaView style={styles.page} edges={back ? ['top', 'bottom'] : ['top']}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
        onScroll={onEnd ? e => {
          const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 200) onEnd();
        } : undefined} scrollEventThrottle={onEnd ? 200 : undefined}>
        {back && <Button label="Back" icon="chevron-back" compact tone="quiet"
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />}
        <View style={{ gap: 7 }}>
          {kicker && <Txt variant="label" color={c.accent}>{kicker}</Txt>}
          <Txt variant="title">{title}</Txt>
          {subtitle && <Txt color={c.muted}>{subtitle}</Txt>}
        </View>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
export function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose(): void }) {
  return <Modal animationType="slide" presentationStyle="pageSheet" visible onRequestClose={onClose}>
    <SafeAreaView style={styles.page} edges={['top', 'bottom']} accessibilityViewIsModal>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Row between>
            <View style={{ flex: 1 }}><Txt variant="h2">{title}</Txt></View>
            <Button label="Close" icon="close" tone="quiet" onPress={onClose} compact />
          </Row>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </Modal>;
}
export function Notice({ message, error = false }: { message: string; error?: boolean }) {
  if (!message) return null;
  return <View style={[styles.notice, { backgroundColor: error ? c.errorSurface : c.raised }]}>
    <Icon name={error ? 'alert-circle-outline' : 'information-circle-outline'} color={error ? c.error : c.accent} />
    <Txt live color={error ? c.error : c.accent} style={{ flex: 1 }}>{message}</Txt>
  </View>;
}
export function Empty({ title, detail, icon = 'file-tray-outline' }: { title: string; detail: string; icon?: IconName }) {
  return <Card>
    <Icon name={icon} color={c.accent} size={28} />
    <Txt variant="h2">{title}</Txt>
    <Txt color={c.muted}>{detail}</Txt>
  </Card>;
}
export function Item({ title, detail, icon, onPress }: { title: string; detail?: string; icon?: IconName; onPress(): void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={detail ? title + ', ' + detail : title} onPress={onPress}
    style={({ pressed }) => [styles.item, { opacity: pressed ? .68 : 1 }]}>
    {icon && <View style={styles.tile}><Icon name={icon} color={c.accent} /></View>}
    <View style={{ flex: 1, gap: 4 }}>
      <Txt variant="strong">{title}</Txt>
      {!!detail && <Txt variant="small" color={c.muted}>{detail}</Txt>}
    </View>
    <Icon name="chevron-forward" size={17} color={c.muted} />
  </Pressable>;
}
export function SyncLabel({ root }: { root: Root }) {
  const { owner, model, status } = useApp();
  const conflict = model?.conflicts.some(q => q.id === root.id && q.kind === root.kind);
  const pending = model?.pending.has(rootKey(root.kind, root.id));
  const text = owner?.demo ? 'Saved on this device · Demo' : conflict ? 'Needs attention' :
    pending ? (status === 'Needs sign-in' ? 'Saved on this device · Needs sign-in' : 'Saved on this device · Waiting to upload') : 'Uploaded';
  return <Txt variant="small" color={conflict ? c.warning : c.accent}>{text}</Txt>;
}
export function ExercisePicker({ title = 'Choose an exercise', onPick, onClose, onCreate, showArchived = false }: {
  title?: string; onPick(exercise: Exercise): void; onClose(): void; onCreate?(): void; showArchived?: boolean;
}) {
  const { model } = useApp();
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState('');
  const [archived, setArchived] = useState(false);
  const results = searchExercises(model!, query, muscle, archived);
  return <Sheet title={title} onClose={onClose}>
    <Field label="Search exercise names" defaultValue={query} onChangeText={setQuery}
      autoCorrect={false} spellCheck={false} autoCapitalize="none" returnKeyType="search" placeholder="Try row or squat" />
    <Row>{['All', ...muscles].map(m => <Chip key={m} label={m} selected={(muscle || 'All') === m} onPress={() => setMuscle(m === 'All' ? '' : m)} />)}</Row>
    {showArchived && <Chip label="Archived exercises" selected={archived} onPress={() => setArchived(!archived)} />}
    {!results.length && <Empty title="No matching exercises" detail="Try a different search or muscle group." />}
    {onCreate && <Button label="Create custom exercise" icon="add" tone="secondary" onPress={onCreate} />}
    {results.map(e => <Item key={e.id} title={e.name} detail={e.muscle + ' · ' + typeLabels[e.type]}
      icon="barbell-outline" onPress={() => onPick(e)} />)}
  </Sheet>;
}
export function Busy() {
  return <View style={[styles.page, { alignItems: 'center', justifyContent: 'center' }]}><ActivityIndicator color={c.accent} /></View>;
}
export function confirm(title: string, body: string, label: string, action: () => void) {
  Alert.alert(title, body, [{ text: 'Cancel', style: 'cancel' }, { text: label, style: 'destructive', onPress: action }]);
}
export const message = (error: unknown) => error instanceof Error ? error.message : 'Try again.';
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: c.bg },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, gap: 14 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  card: { padding: 17, gap: 11, backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: 21 },
  featured: { padding: 23, gap: 15, borderRadius: 26, borderColor: '#534437', overflow: 'hidden' },
  button: { minHeight: 48, minWidth: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 16, paddingVertical: 11, gap: 8 },
  glass: { borderRadius: 999 },
  opaqueButton: { borderRadius: 999, borderWidth: 1 },
  compactControl: { alignSelf: 'flex-start', maxWidth: '100%' },
  fullControl: { alignSelf: 'stretch' },
  chip: { alignSelf: 'flex-start', minHeight: 44, minWidth: 44, paddingHorizontal: 13, paddingVertical: 9,
    justifyContent: 'center', borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, borderRadius: 22 },
  input: { minHeight: 48, color: c.text, borderWidth: 1, borderColor: c.line, borderRadius: 13,
    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: c.surface },
  notice: { padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12 },
  item: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 11,
    padding: 12, borderRadius: 15, backgroundColor: c.surface, borderColor: c.line, borderWidth: 1 },
  tile: { width: 37, height: 37, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: c.raised },
});
