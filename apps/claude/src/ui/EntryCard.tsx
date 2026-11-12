// Exercise card with a compact set table (FW-02, FW-03, FW-04, FW-05, FW-30,
// FW-31, TR-02, BL-06, UI-04). Drafts live in the card so a kg/lb switch can
// convert every typed row explicitly, and a check-mark tap records a row.
import * as Haptics from 'expo-haptics';
import { memo, useState } from 'react';
import { ActionSheetIOS, Alert, Platform, Pressable, TextInput, View } from 'react-native';
import { suggestActual, type PreviousPerformance } from '../domain/analytics';
import { formatDateShort } from '../domain/dates';
import type { Exercise, SetRow, Settings, Unit, Workout, WorkoutEntry } from '../domain/types';
import { convert, round1 } from '../domain/units';
import type { ActualInput } from '../domain/validation';
import { formatTarget } from './format';
import { Icon, IconButton, Row, T, useScale } from './kit';
import { colors, radius, space, typeScale } from './theme';

export interface SetActions {
  complete(setId: string, input: ActualInput): Promise<void>;
  skip(setId: string): Promise<void>;
  reopen(setId: string): Promise<void>;
  remove(setId: string): Promise<void>;
}

export type EntryMenuChoice = 'history' | 'info' | 'rest' | 'replace' | 'remove';
type Draft = { weight: string; reps: string; seconds: string; rir: string };

const COL = { set: 28, weight: 62, reps: 48, rir: 40, check: 38 };

function draftFor(s: SetRow, entry: WorkoutEntry, previous: PreviousPerformance | null, unit: Unit): Draft {
  if (s.state === 'done') {
    return { weight: s.weight != null ? String(s.weight) : '', reps: s.reps != null ? String(s.reps) : '', seconds: s.seconds != null ? String(s.seconds) : '', rir: s.rir != null ? String(s.rir) : '' };
  }
  const sug = suggestActual(entry, s, entry.phase === 'work' ? previous : null, unit);
  return { weight: sug.weight != null ? round1(sug.weight) : '', reps: sug.reps != null ? String(sug.reps) : '', seconds: sug.seconds != null ? String(sug.seconds) : '', rir: '' };
}

function prevLabel(s: SetRow | undefined, type: Exercise['type']): string {
  if (!s) return '–';
  if (type === 'seconds') return s.seconds != null ? `${s.seconds}s` : '–';
  if (type === 'reps') return s.reps != null ? `${s.reps}` : '–';
  return s.weight != null && s.unit ? `${round1(s.weight)}${s.unit === 'lb' ? ' lb' : ''} × ${s.reps}` : '–';
}

function Cell({ value, onChange, label, width, decimal, error, editable, done }: { value: string; onChange: (v: string) => void; label: string; width: number; decimal?: boolean; error?: boolean; editable: boolean; done?: boolean }) {
  const scale = useScale();
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      editable={editable}
      keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
      keyboardAppearance="dark"
      selectTextOnFocus
      accessibilityLabel={label}
      maxFontSizeMultiplier={1}
      placeholder="–"
      placeholderTextColor={colors.faint}
      style={{
        width: width * Math.min(scale, 1.5), height: 34, textAlign: 'center', fontSize: typeScale.body * Math.min(scale, 1.4), color: colors.text, fontWeight: '600',
        fontVariant: ['tabular-nums'], borderRadius: radius.sm, backgroundColor: done ? 'transparent' : colors.surfaceRaised, borderWidth: 1,
        borderColor: error ? colors.danger : 'transparent', padding: 0,
      }}
    />
  );
}

export const EntryCard = memo(function EntryCard({
  workout, entry, exercise, previous, settings, actions, onAddSet, onEntryMenu,
}: {
  workout: Workout; entry: WorkoutEntry; exercise: Exercise | undefined; previous: PreviousPerformance | null; settings: Settings;
  actions: SetActions; onAddSet: (input?: ActualInput) => Promise<void>; onEntryMenu: (choice: EntryMenuChoice) => void;
}) {
  const scale = Math.min(useScale(), 1.5);
  const finished = workout.state === 'finished';
  const type = exercise?.type ?? 'weight_reps';
  const lastDone = [...entry.sets].reverse().find((s) => s.state === 'done' && s.unit);
  const [unit, setUnit] = useState<Unit>(lastDone?.unit ?? entry.sets.find((s) => s.targetUnit)?.targetUnit ?? settings.unit);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, { field?: string; message: string } | undefined>>({});
  const [addingDraft, setAddingDraft] = useState(false);

  const draftRow: SetRow | null = finished && addingDraft
    ? { id: `draft-${entry.id}`, entryId: entry.id, position: entry.sets.length + 1, state: 'pending', targetReps: null, targetSeconds: null, targetLoad: null, targetUnit: null,
        targetRirMin: null, targetRirMax: null, weight: null, unit: null, reps: null, seconds: null, rir: null, completedAt: null }
    : null;
  const draftOf = (s: SetRow) => drafts[s.id] ?? draftFor(s, entry, previous, unit);
  const isOpen = (s: SetRow) => s.id === draftRow?.id || s.state === 'pending' || !!editing[s.id];

  const toggleUnit = () => {
    const next: Unit = unit === 'kg' ? 'lb' : 'kg';
    const open = [...entry.sets, ...(draftRow ? [draftRow] : [])].filter(isOpen);
    const typed = open.filter((s) => draftOf(s).weight.trim() !== '');
    if (!typed.length) return setUnit(next);
    Alert.alert(`Enter weights in ${next}?`, `Convert the typed weights to ${next}, or keep the same numbers and read them as ${next}.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Keep numbers', onPress: () => setUnit(next) },
      {
        text: `Convert to ${next}`,
        onPress: () => {
          setDrafts((d) => {
            const out = { ...d };
            for (const s of typed) {
              const cur = d[s.id] ?? draftFor(s, entry, previous, unit);
              const n = Number(cur.weight.replace(',', '.'));
              out[s.id] = { ...cur, weight: Number.isFinite(n) ? round1(convert(n, unit, next)) : cur.weight };
            }
            return out;
          });
          setUnit(next);
        },
      },
    ]);
  };

  const submit = async (s: SetRow) => {
    const d = draftOf(s);
    const input: ActualInput = { weight: d.weight, unit, reps: d.reps, seconds: d.seconds, rir: d.rir };
    setErrors((e) => ({ ...e, [s.id]: undefined }));
    try {
      if (s.id === draftRow?.id) {
        await onAddSet(input);
        setAddingDraft(false);
      } else {
        await actions.complete(s.id, input);
        setEditing((x) => ({ ...x, [s.id]: false }));
      }
      setDrafts((x) => { const { [s.id]: _gone, ...rest } = x; return rest; });
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    } catch (e: any) {
      setErrors((x) => ({ ...x, [s.id]: { field: e?.field, message: e?.message ?? 'Not saved. Try again.' } }));
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    }
  };

  const rowMenu = (s: SetRow) => {
    const opts: { text: string; run: () => void; destructive?: boolean }[] = [];
    if (s.state === 'done') opts.push({ text: 'Edit values', run: () => setEditing((x) => ({ ...x, [s.id]: true })) });
    if (!finished && s.state !== 'pending') opts.push({ text: s.state === 'done' ? 'Undo completion' : 'Undo skip', run: () => void actions.reopen(s.id) });
    if (!finished && s.state === 'pending' && (s.targetReps != null || s.targetSeconds != null)) opts.push({ text: 'Skip this set', run: () => void actions.skip(s.id) });
    opts.push({ text: 'Delete set', destructive: true, run: () => void actions.remove(s.id) });
    if (Platform.OS === 'ios')
      ActionSheetIOS.showActionSheetWithOptions(
        { options: [...opts.map((o) => o.text), 'Cancel'], cancelButtonIndex: opts.length, destructiveButtonIndex: opts.findIndex((o) => o.destructive), title: `Set ${s.position}`, userInterfaceStyle: 'dark' },
        (i) => opts[i]?.run(),
      );
    else Alert.alert(`Set ${s.position}`, undefined, [...opts.map((o) => ({ text: o.text, onPress: o.run, style: o.destructive ? ('destructive' as const) : undefined })), { text: 'Cancel', style: 'cancel' }]);
  };

  const entryMenu = () => {
    const opts: { key: EntryMenuChoice; text: string }[] = [{ key: 'info', text: 'How to perform' }, { key: 'history', text: 'Exercise history' }];
    if (!finished && entry.phase === 'work') opts.push({ key: 'rest', text: 'Rest timer' });
    if (!finished && !entry.sets.some((s) => s.state === 'done')) opts.push({ key: 'replace', text: 'Substitute exercise' });
    opts.push({ key: 'remove', text: 'Remove exercise' });
    if (Platform.OS === 'ios')
      ActionSheetIOS.showActionSheetWithOptions(
        { options: [...opts.map((o) => o.text), 'Cancel'], cancelButtonIndex: opts.length, destructiveButtonIndex: opts.length - 1, title: exercise?.name, userInterfaceStyle: 'dark' },
        (i) => opts[i] && onEntryMenu(opts[i].key),
      );
    else Alert.alert(exercise?.name ?? 'Exercise', undefined, [...opts.map((o) => ({ text: o.text, onPress: () => onEntryMenu(o.key) })), { text: 'Cancel', style: 'cancel' }]);
  };

  const target = entry.sets.find((s) => s.targetReps != null || s.targetSeconds != null);
  const plannedCount = entry.sets.filter((s) => s.targetReps != null || s.targetSeconds != null).length;
  const meta = [
    target ? `${plannedCount} × ${formatTarget(target, false)}` : null,
    entry.phase === 'work' && entry.restMode === 'off' ? 'Rest off' : entry.phase === 'work' && entry.restMode === 'duration' ? `Rest ${entry.restSeconds}s` : null,
    exercise?.archived ? 'Archived' : null,
    entry.phase !== 'work' ? 'Preparation · no volume' : null,
  ].filter(Boolean).join(' · ') || (previous ? `Last time ${formatDateShort(previous.date)}` : 'No previous record');

  const renderRow = (s: SetRow) => {
    const d = draftOf(s);
    const open = isOpen(s);
    const done = s.state === 'done' && !open;
    const skipped = s.state === 'skipped';
    const err = errors[s.id];
    const setD = (k: keyof Draft, v: string) => setDrafts((x) => ({ ...x, [s.id]: { ...(x[s.id] ?? d), [k]: v } }));
    const prev = entry.phase === 'work' ? previous?.sets[s.position - 1] : undefined;
    const label = `Set ${s.position}`;
    return (
      <View key={s.id} style={{ gap: 2 }}>
        <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 6, borderRadius: radius.md }, done && { backgroundColor: colors.successSoft }, skipped && { opacity: 0.45 }]}>
          <Pressable onPress={() => s.id !== draftRow?.id && rowMenu(s)} accessibilityRole="button" accessibilityLabel={`${label} options`} hitSlop={6} style={{ width: COL.set, minHeight: 40, justifyContent: 'center' }}>
            <T variant="small" weight="700" color={done ? colors.success : entry.phase === 'work' ? colors.text : colors.muted} tabular>{entry.phase === 'work' ? s.position : `W${s.position}`}</T>
          </Pressable>
          <T variant="small" color={colors.faint} tabular numberOfLines={1} style={{ flex: 1 }}>{skipped ? 'Skipped' : prevLabel(prev, type)}</T>
          {type === 'weight_reps' ? (
            <View style={{ alignItems: 'center' }}>
              <Cell label={`Weight in ${unit}, ${label}`} value={done && s.weight != null ? round1(s.weight) : d.weight} onChange={(v) => setD('weight', v)} width={COL.weight} decimal editable={open} done={done} error={err?.field === 'weight'} />
              {done && settings.showEquivalent && s.weight != null && s.unit ? (
                <T variant="caption" color={colors.faint} tabular>{round1(convert(s.weight, s.unit, s.unit === 'kg' ? 'lb' : 'kg'))} {s.unit === 'kg' ? 'lb' : 'kg'}</T>
              ) : done && s.unit && s.unit !== unit ? <T variant="caption" color={colors.faint}>{s.unit}</T> : null}
            </View>
          ) : null}
          {type !== 'seconds' ? <Cell label={`Reps, ${label}`} value={d.reps} onChange={(v) => setD('reps', v)} width={COL.reps} editable={open} done={done} error={err?.field === 'reps'} /> : null}
          {type === 'seconds' ? <Cell label={`Seconds, ${label}`} value={d.seconds} onChange={(v) => setD('seconds', v)} width={COL.weight} editable={open} done={done} error={err?.field === 'seconds'} /> : null}
          {type !== 'seconds' ? <Cell label={`RIR (optional), ${label}`} value={d.rir} onChange={(v) => setD('rir', v)} width={COL.rir} editable={open} done={done} error={err?.field === 'rir'} /> : null}
          <View style={{ width: COL.check, alignItems: 'center' }}>
            {skipped && !finished ? (
              <IconButton icon="arrow.uturn.backward" label={`Undo skip of ${label}`} onPress={() => void actions.reopen(s.id)} size={14} color={colors.muted} fallback="↺" />
            ) : done ? (
              <IconButton icon="checkmark" label={`${label} recorded. Options`} onPress={() => rowMenu(s)} filled tint={colors.success} size={13} fallback="✓" />
            ) : (
              <IconButton icon="checkmark" label={`Record ${label}`} onPress={() => void submit(s)} size={14} color={colors.text} fallback="✓" />
            )}
          </View>
        </View>
        {err ? <T variant="caption" color={colors.danger} style={{ paddingLeft: COL.set + 12 }} accessibilityLabel={`Not saved: ${err.message}`}>Not saved: {err.message}</T> : null}
      </View>
    );
  };

  const headerCell = (text: string, width: number) => <T variant="caption" color={colors.faint} weight="600" style={{ width: width * scale, textAlign: 'center' }}>{text}</T>;

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, paddingVertical: space.md, paddingHorizontal: space.sm, gap: 4 }}>
      <Row style={{ flexWrap: 'nowrap', paddingHorizontal: 6, alignItems: 'flex-start' }}>
        <Pressable style={{ flex: 1, gap: 2 }} onPress={() => onEntryMenu('info')} accessibilityRole="button" accessibilityLabel={`${exercise?.name ?? 'Exercise'}. How to perform`}>
          <T variant="h3" color={colors.accent} numberOfLines={2}>{exercise?.name ?? 'Unknown exercise'}</T>
          <T variant="caption" color={colors.muted} numberOfLines={1}>{meta}</T>
        </Pressable>
        <IconButton icon="ellipsis" label={`Options for ${exercise?.name ?? 'exercise'}`} onPress={entryMenu} color={colors.muted} fallback="⋯" />
      </Row>
      {entry.sets.length || draftRow ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 6, marginTop: 2 }} accessible={false} importantForAccessibility="no-hide-descendants">
          <T variant="caption" color={colors.faint} weight="600" style={{ width: COL.set }}>SET</T>
          <T variant="caption" color={colors.faint} weight="600" style={{ flex: 1 }}>{previous && entry.phase === 'work' ? 'PREVIOUS' : ''}</T>
          {type === 'weight_reps' ? (
            <Pressable onPress={toggleUnit} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Weights in ${unit}. Switch unit`} style={{ width: COL.weight * scale, alignItems: 'center' }}>
              <Row gap={3} style={{ flexWrap: 'nowrap' }}>
                <T variant="caption" color={colors.accent} weight="700">{unit.toUpperCase()}</T>
                <Icon name="arrow.left.arrow.right" size={9} color={colors.accent} fallback="⇄" />
              </Row>
            </Pressable>
          ) : null}
          {type !== 'seconds' ? headerCell('REPS', COL.reps) : null}
          {type === 'seconds' ? headerCell('SEC', COL.weight) : null}
          {type !== 'seconds' ? headerCell('RIR', COL.rir) : null}
          <View style={{ width: COL.check }} />
        </View>
      ) : <T variant="small" color={colors.faint} style={{ paddingHorizontal: 6 }}>No sets yet.</T>}
      {entry.sets.map(renderRow)}
      {draftRow ? renderRow(draftRow) : null}
      <Pressable onPress={() => (finished ? setAddingDraft(true) : void onAddSet())} accessibilityRole="button" accessibilityLabel={`Add a set to ${exercise?.name ?? 'exercise'}`}
        style={({ pressed }) => [{ minHeight: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised, marginHorizontal: 6, marginTop: 4 }, pressed && { opacity: 0.6 }]}>
        <Row gap={4}><Icon name="plus" size={12} color={colors.text} /><T variant="small" weight="600">Add set</T></Row>
      </Pressable>
    </View>
  );
});
