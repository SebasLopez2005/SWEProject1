import { router } from 'expo-router';
import { useMemo } from 'react';
import { goalProgress, monthlyReport, muscleActivity } from '../../../../domain/analytics';
import { addDays, monthKey, monthLabel, todayLocal } from '../../../../domain/dates';
import { MUSCLE_LABEL } from '../../../../domain/preparation';
import type { BodyFigure } from '../../../../domain/types';
import { formatAggregate } from '../../../../domain/units';
import { useLoad, useSession } from '../../../../state/session';
import { BodyMap } from '../../../../ui/BodyMap';
import { plural } from '../../../../ui/format';
import { Card, Group, ListItem, Loading, Row, Screen, Segmented, StatusPill, T } from '../../../../ui/kit';
import { colors } from '../../../../ui/theme';

export default function Profile() {
  const { repo, settings, identity, syncState } = useSession();
  const { data } = useLoad(async () => ({ ws: await repo.finishedWorkouts(), ex: await repo.exerciseMap(), goals: await repo.listGoals(), bw: await repo.listBodyweight() }), [], ['finished', 'exercises', 'profile']);
  const today = todayLocal();
  const act = useMemo(() => (data ? muscleActivity(data.ws, data.ex, addDays(today, -6), today) : null), [data, today]);
  const scores = useMemo(() => new Map([...(act?.regions ?? new Map())].map(([k, v]) => [k, v.score])), [act]);
  if (!data || !act) return <Loading />;
  const top = [...act.regions].sort((a, b) => b[1].score - a[1].score).slice(0, 3);
  const report = monthlyReport(data.ws, data.ex, monthKey(today), settings.unit);
  const achieved = data.goals.filter((g) => goalProgress(g, data.ws).achieved).length;
  const latestBw = data.bw[data.bw.length - 1];

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <T variant="small" color={colors.muted} numberOfLines={1} style={{ flexShrink: 1 }}>{identity.kind === 'cloud' ? identity.email : 'This device only'}</T>
        <StatusPill status={syncState.status} short />
      </Row>
      <Card>
        <T variant="h3">Muscle activity · last 7 days</T>
        <Segmented label="Body figure" value={settings.bodyFigure} onChange={(f: BodyFigure) => repo.updateSettings({ bodyFigure: f })}
          options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
        <BodyMap scores={scores} selected={null} onSelect={(m) => router.push({ pathname: '/profile/muscles', params: { region: m } })} figure={settings.bodyFigure} compact />
        <T variant="small" color={colors.muted}>{top.length ? `Most trained: ${top.map(([k, v]) => `${MUSCLE_LABEL[k] ?? k} ${v.score.toFixed(1)}`).join(' · ')}` : 'No completed working sets in the last 7 days.'}</T>
      </Card>
      <Group>
        <ListItem title="Muscle activity details" subtitle="Exact set-equivalents, periods and contributing sets" icon="figure.arms.open" onPress={() => router.push('/profile/muscles')} />
      </Group>
      <Group header="Progress">
        <ListItem title="Monthly report" subtitle={`${monthLabel(report.month)} · ${plural(report.current.sessions, 'session')} · ${formatAggregate(report.current.volume, settings.unit, false)}`} icon="doc.text.magnifyingglass" onPress={() => router.push('/profile/report')} />
        <ListItem title="Lift goals" subtitle={data.goals.length ? `${achieved} of ${data.goals.length} reached` : 'Set a target load and reps'} icon="target" onPress={() => router.push('/profile/goals')} />
        <ListItem title="Bodyweight" subtitle={latestBw ? `Latest ${formatAggregate(latestBw.weight, latestBw.unit, settings.showEquivalent)}` : 'Optional'} icon="scalemass" onPress={() => router.push('/profile/bodyweight')} />
      </Group>
      <Group header="Your data">
        <ListItem title="Export my data" subtitle="CSV files via the share sheet" icon="square.and.arrow.up" onPress={() => router.push('/profile/export')} />
        <ListItem title="Exercise library" icon="books.vertical" onPress={() => router.push('/exercises')} />
        <ListItem title="Settings" subtitle="Units, text size, reminders, account" icon="gearshape" onPress={() => router.push('/settings')} />
      </Group>
    </Screen>
  );
}
