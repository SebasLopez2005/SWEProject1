// Inline set row (FW-02, FW-03, FW-05, FW-31, TR-02, BL-06): planned target on
// the left, editable actual fields, and a single check-mark tap to record.
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { ActionSheetIOS, Alert, Platform, Pressable, TextInput, View } from 'react-native';
import type { Suggestion } from '../domain/analytics';
import type { ExerciseType, SetRow, Unit } from '../domain/types';
import { convert, round1 } from '../domain/units';
import { formatActual, formatTarget } from './format';
import { Icon, IconButton, T, useScale } from './kit';
import { colors, radius, space, typeScale } from './theme';

export interface SetRowActions {
  complete(setId: string, input: { weight?: string; unit?: Unit; reps?: string; seconds?: string; rir?: string }): Promise<void>;
  skip(setId: string): Promise<void>;
  reopen(setId: string): Promise<void>;
  remove(setId: string): Promise<void>;
}

function NumField({ value, onChange, label, caption, width, decimal, error }: { value: string; onChange: (v: string) => void; label: string; caption: string; width: number; decimal?: boolean; error?: boolean }) {
  const scale = useScale();
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
        keyboardAppearance="dark"
        selectTextOnFocus
        accessibilityLabel={label}
        maxFontSizeMultiplier={Math.max(1, 2 / scale)}
        placeholder="—"
        placeholderTextColor={colors.faint}
        style={{
          width: width * Math.min(scale, 1.6), minHeight: 44, textAlign: 'center', fontSize: typeScale.body * scale, color: colors.text, fontWeight: '600',
          backgroundColor: colors.surfaceRaised, borderRadius: radius.sm, borderWidth: 1, borderColor: error ? colors.danger : colors.border,
        }}
      />
      <T variant="caption" color={colors.faint}>{caption}</T>
    </View>
  );
}

export function SetRowEditor({
  set, type, suggestion, defaultUnit, showEquivalent, actions, finished, allowReopen = true,
}: {
  set: SetRow; type: ExerciseType; suggestion: Suggestion | null; defaultUnit: Unit; showEquivalent: boolean; actions: SetRowActions; finished?: boolean; allowReopen?: boolean;
}) {
  const [editing, setEditing] = useState(set.state === 'pending');
  const initialUnit: Unit = set.unit ?? (set.targetUnit && suggestion?.weight == null ? set.targetUnit : defaultUnit);
  const [unit, setUnit] = useState<Unit>(initialUnit);
  const [weight, setWeight] = useState(set.weight != null ? String(set.weight) : suggestion?.weight != null ? round1(suggestion.weight) : '');
  const [reps, setReps] = useState(set.reps != null ? String(set.reps) : suggestion?.reps != null ? String(suggestion.reps) : '');
  const [seconds, setSeconds] = useState(set.seconds != null ? String(set.seconds) : suggestion?.seconds != null ? String(suggestion.seconds) : '');
  const [rir, setRir] = useState(set.rir != null ? String(set.rir) : '');
  const [error, setError] = useState<{ field?: string; message: string } | null>(null);

  const toggleUnit = () => {
    const next: Unit = unit === 'kg' ? 'lb' : 'kg';
    const n = Number(weight.replace(',', '.'));
    if (!weight || !Number.isFinite(n)) return setUnit(next);
    const converted = round1(convert(n, unit, next));
    Alert.alert(`Switch to ${next}`, `Convert ${weight} ${unit} to ${converted} ${next}, or keep the number ${weight} and enter it in ${next}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: `Keep ${weight} ${next}`, onPress: () => setUnit(next) },
      { text: `Convert to ${converted} ${next}`, onPress: () => { setUnit(next); setWeight(converted); } },
    ]);
  };

  const submit = async () => {
    setError(null);
    try {
      await actions.complete(set.id, { weight, unit, reps, seconds, rir });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      setEditing(false);
    } catch (e: any) {
      setError({ field: e?.field, message: e?.message ?? 'Not saved. Try again.' });
    }
  };

  const target = formatTarget(set, showEquivalent);
  const label = `Set ${set.position}`;

  const menu = () => {
    const opts: { text: string; run: () => void; destructive?: boolean }[] = [];
    if (set.state === 'done') opts.push({ text: 'Edit values', run: () => setEditing(true) });
    if (!finished && set.state !== 'pending' && allowReopen) opts.push({ text: set.state === 'done' ? 'Undo completion' : 'Undo skip', run: () => void actions.reopen(set.id) });
    if (!finished && set.state === 'pending' && (set.targetReps != null || set.targetSeconds != null)) opts.push({ text: 'Skip this set', run: () => void actions.skip(set.id) });
    opts.push({ text: 'Delete set', destructive: true, run: () => void actions.remove(set.id) });
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: [...opts.map((o) => o.text), 'Cancel'], cancelButtonIndex: opts.length, destructiveButtonIndex: opts.findIndex((o) => o.destructive), title: label, userInterfaceStyle: 'dark' },
        (i) => opts[i]?.run(),
      );
    } else Alert.alert(label, undefined, [...opts.map((o) => ({ text: o.text, onPress: o.run, style: o.destructive ? ('destructive' as const) : undefined })), { text: 'Cancel', style: 'cancel' }]);
  };

  const stateColor = set.state === 'done' ? colors.success : set.state === 'skipped' ? colors.faint : colors.muted;

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: space.sm, gap: space.xs }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' }}>
        <Pressable onPress={menu} accessibilityRole="button" accessibilityLabel={`${label} options`} style={{ minWidth: 44, minHeight: 44, justifyContent: 'center' }}>
          <T weight="700" color={stateColor}>{set.position}</T>
          {set.state === 'done' ? <Icon name="checkmark" size={12} color={colors.success} /> : null}
        </Pressable>
        {editing ? (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.sm, flex: 1, flexWrap: 'wrap' }}>
            {type === 'weight_reps' ? (
              <>
                <NumField label={`Weight in ${unit}, ${label}`} caption="Weight" value={weight} onChange={setWeight} width={68} decimal error={error?.field === 'weight'} />
                <Pressable onPress={toggleUnit} accessibilityRole="button" accessibilityLabel={`Unit ${unit}. Switch unit`} style={{ minHeight: 44, minWidth: 40, justifyContent: 'center', alignItems: 'center', borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border }}>
                  <T weight="700" color={colors.accent}>{unit}</T>
                </Pressable>
              </>
            ) : null}
            {type !== 'seconds' ? <NumField label={`Reps, ${label}`} caption="Reps" value={reps} onChange={setReps} width={54} error={error?.field === 'reps'} /> : null}
            {type === 'seconds' ? <NumField label={`Seconds, ${label}`} caption="Seconds" value={seconds} onChange={setSeconds} width={70} error={error?.field === 'seconds'} /> : null}
            {type !== 'seconds' ? <NumField label={`RIR (optional), ${label}`} caption="RIR" value={rir} onChange={setRir} width={46} error={error?.field === 'rir'} /> : null}
          </View>
        ) : (
          <Pressable onPress={() => (set.state === 'done' ? setEditing(true) : undefined)} accessibilityRole={set.state === 'done' ? 'button' : 'text'}
            accessibilityLabel={`${label}: ${set.state === 'skipped' ? 'skipped' : formatActual(set, type, showEquivalent)}${set.state === 'done' ? '. Tap to edit' : ''}`} style={{ flex: 1, minHeight: 44, justifyContent: 'center' }}>
            <T weight="600" color={set.state === 'skipped' ? colors.faint : colors.text}>
              {set.state === 'skipped' ? 'Skipped' : formatActual(set, type, showEquivalent)}
            </T>
          </Pressable>
        )}
        {editing ? (
          <IconButton icon="checkmark" label={`Record ${label}`} onPress={submit} filled fallback="✓" />
        ) : set.state === 'skipped' && !finished ? (
          <IconButton icon="arrow.uturn.backward" label={`Undo skip of ${label}`} onPress={() => void actions.reopen(set.id)} fallback="↺" />
        ) : null}
      </View>
      {target ? <T variant="caption" color={colors.faint}>Target: {target}</T> : null}
      {error ? <T variant="small" color={colors.danger} accessibilityLabel={`Not saved: ${error.message}`}>Not saved: {error.message}</T> : null}
    </View>
  );
}
