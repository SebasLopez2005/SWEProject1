import { router } from 'expo-router';
import { useState } from 'react';
import { monthlyReport } from '../../../domain/analytics';
import { formatDateShort, monthKey, monthLabel, previousMonthKey, todayLocal, addDays, monthEnd } from '../../../domain/dates';
import { formatAggregate, formatStoredWeight } from '../../../domain/units';
import { useLoad, useSession } from '../../../state/session';
import { Button, Card, Empty, KeyValue, Loading, Row, Screen, Section, T } from '../../../ui/kit';
import { colors } from '../../../ui/theme';

function delta(cur: number, prev: number, fmt: (n: number) => string) {
  const d = cur - prev;
  if (d === 0) return 'same as before';
  return `${d > 0 ? '+' : '−'}${fmt(Math.abs(d))}`;
}

/** TR-08: monthly report with equal-elapsed-day comparison for the current month. */
export default function Report() {
  const { repo, settings } = useSession();
  const today = todayLocal();
  const [month, setMonth] = useState(monthKey(today));
  const { data } = useLoad(async () => ({ ws: await repo.finishedWorkouts(), ex: await repo.exerciseMap() }));
  if (!data) return <Loading />;
  const r = monthlyReport(data.ws, data.ex, month, settings.unit);
  const next = monthKey(addDays(monthEnd(month), 1));
  const v = (n: number) => formatAggregate(n, settings.unit, false);
  const sparse = r.current.sessions === 0;
  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <Button title="‹ Previous" compact variant="ghost" onPress={() => setMonth(previousMonthKey(month))} accessibilityLabel="Previous month" />
        <T variant="h2">{monthLabel(month)}</T>
        <Button title="Next ›" compact variant="ghost" disabled={next > monthKey(today)} onPress={() => setMonth(next)} accessibilityLabel="Next month" />
      </Row>
      {r.inProgress ? <T color={colors.warning}>In progress · comparing the first {r.comparedDays} days with the same days of {monthLabel(previousMonthKey(month))}.</T> : null}
      {sparse ? <Empty title="No finished workouts" body={`Nothing was logged in ${monthLabel(month)}${r.inProgress ? ' yet' : ''}.`} /> : null}
      <Card>
        <T variant="small" color={colors.muted}>{formatDateShort(r.current.from)} – {formatDateShort(r.current.to)}</T>
        <KeyValue k="Sessions" v={`${r.current.sessions} (${delta(r.current.sessions, r.previous.sessions, String)})`} />
        <KeyValue k="Working sets" v={`${r.current.workingSets} (${delta(r.current.workingSets, r.previous.workingSets, String)})`} />
        <KeyValue k="Weighted volume" v={`${v(r.current.volume)} (${delta(r.current.volume, r.previous.volume, v)})`} />
        <KeyValue k="Bodyweight reps" v={String(r.current.totalReps)} />
        <KeyValue k="Timed work" v={`${r.current.totalSeconds} s`} />
        <T variant="caption" color={colors.faint}>Previous period: {formatDateShort(r.previous.from)} – {formatDateShort(r.previous.to)} · {r.previous.sessions} sessions, {v(r.previous.volume)}</T>
      </Card>
      <Section title="Lift milestones">
        {r.milestones.length === 0 ? <T color={colors.faint}>No new heaviest working sets this month.</T> : null}
        {r.milestones.map((m) => (
          <Card key={m.exerciseId} onPress={() => router.push(`/workout/${m.workoutId}`)} accessibilityLabel={`New best ${data.ex.get(m.exerciseId)?.name}, open workout`}>
            <T weight="600">{data.ex.get(m.exerciseId)?.name}</T>
            <T variant="small" color={colors.muted}>New heaviest set: {formatStoredWeight(m.weight, settings.unit, settings.showEquivalent)} × {m.reps} on {formatDateShort(m.date)}</T>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
