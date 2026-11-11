import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import type { UndoToken } from '../data/repository';
import type { Workout, WorkoutEntry } from '../domain/types';
import { setPickerTarget } from '../state/picker';
import { useSession } from '../state/session';
import type { SetRowActions } from './SetRowEditor';

/** Shared set/entry handlers for the active workout and finished-workout editing. */
export function useEntryActions(w: Workout | null, hooks: { afterComplete?: (setId: string) => Promise<void>; afterReopen?: (setId: string) => Promise<void> } = {}) {
  const { repo, rest } = useSession();
  const [undo, setUndo] = useState<UndoToken | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => setUndo(null), 10000);
    return () => clearTimeout(t);
  }, [undo]);

  const guard = async (fn: () => Promise<void>) => {
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const setActions: SetRowActions = useMemo(
    () => ({
      complete: async (setId, input) => {
        setUndo(null);
        await repo.completeSet(setId, input); // errors surface inline on the row; nothing is acknowledged on failure
        await hooks.afterComplete?.(setId);
      },
      skip: (setId) => guard(async () => { setUndo(null); await repo.skipSet(setId); await rest.clearIfSource(setId); }),
      reopen: (setId) => guard(async () => { setUndo(null); await repo.reopenSet(setId); await hooks.afterReopen?.(setId); }),
      remove: async (setId) =>
        new Promise<void>((resolve) =>
          Alert.alert('Delete this set?', 'You can undo right after deleting.', [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve() },
            { text: 'Delete', style: 'destructive', onPress: () => guard(async () => { setUndo(await repo.deleteSet(setId)); await rest.clearIfSource(setId); }).then(resolve) },
          ]),
        ),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [repo, rest, hooks.afterComplete, hooks.afterReopen],
  );

  const addSet = (entryId: string, input?: Parameters<SetRowActions['complete']>[1]) =>
    input ? repo.addSet(entryId, input).then(() => undefined) : guard(async () => { setUndo(null); await repo.addSet(entryId); });

  const entryMenu = (entry: WorkoutEntry, choice: 'history' | 'info' | 'rest' | 'replace' | 'remove') => {
    if (!w) return;
    if (choice === 'history' || choice === 'info') return router.push({ pathname: '/exercises/[id]', params: { id: entry.exerciseId, tab: choice } });
    if (choice === 'rest') {
      const set = (mode: 'inherit' | 'duration' | 'off', s: number | null) => guard(() => repo.setEntryRest(entry.id, mode, s));
      return Alert.alert('Rest timer', `Workout default: ${w.defaultRestSeconds ?? 90} s`, [
        { text: 'Use workout default', onPress: () => set('inherit', null) },
        { text: '60 seconds', onPress: () => set('duration', 60) },
        { text: '2 minutes', onPress: () => set('duration', 120) },
        { text: '3 minutes', onPress: () => set('duration', 180) },
        { text: 'No automatic rest', onPress: () => set('off', null) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
    if (choice === 'replace') {
      setPickerTarget((id) => repo.replaceEntryExercise(entry.id, id), 'Substitute exercise');
      return router.push('/picker');
    }
    Alert.alert('Remove this exercise?', 'Its sets will be removed from this workout. You can undo right after.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => guard(async () => setUndo(await repo.deleteEntry(entry.id))) },
    ]);
  };

  const runUndo = () => guard(async () => { if (undo) await repo.undo(undo.id); setUndo(null); });

  return { setActions, addSet, entryMenu, undo, runUndo, error, setError };
}
