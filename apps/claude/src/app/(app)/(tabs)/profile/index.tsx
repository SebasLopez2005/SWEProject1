import { router } from 'expo-router';
import { goalProgress, monthlyReport, muscleActivity } from '../../../../domain/analytics';
import { addDays, monthKey, monthLabel, todayLocal } from '../../../../domain/dates';
import { MUSCLE_LABEL } from '../../../../domain/preparation';
import { formatAggregate } from '../../../../domain/units';
import { useLoad, useSession } from '../../../../state/session';
import { BodyMap } from '../../../../ui/BodyMap';
import { plural } from '../../../../ui/format';
import { Card, Loading, Row, Screen, Section, StatusPill, T } from '../../../../ui/kit';
import { colors } from '../../../../ui/theme';

export default function Profile() {
  const { repo, settings, identity, syncState } = useSession();
  const { data } = useLoad(async () => ({ ws: await repo.finishedWorkouts(), ex: await repo.exerciseMap(), goals: await repo.listGoals(), bw: await repo.listBodyweight() }));
  if (!data) return <Loading />;
  const today = todayLocal();
  const act = muscleActivity(data.ws, data.ex, addDays(today, -6), today);
  const scores = new Map([...act.regions].map(([k, v]) => [k, v.score]));
  const top = [...act.regions].sort((a, b) => b[1].score - a[1].score).slice(0, 3);
  const report = monthlyReport(data.ws, data.ex, monthKey(today), settings.unit);
  const achieved = data.goals.filter((g) => goalProgress(g, data.ws).achieved).length;
  const latestBw = data.bw[data.bw.length - 1];

  return (
    <Screen>
      <Card>
        <T variant="h3">{identity.kind === 'cloud' ? identity.email : 'This device only'}</T>
        <StatusPill status={syncState.status} />
      </Card>
      <Section title="Muscle activity · last 7 days">
        <Card onPress={() => router.push('/profile/muscles')} accessibilityLabel="Muscle activity details">
          <BodyMap scores={scores} selected={null} onSelect={() => router.push('/profile/muscles')} />
          <T variant="small" color={colors.muted}>{top.length ? `Most trained: ${top.map(([k, v]) => `${MUSCLE_LABEL[k] ?? k} ${v.score.toFixed(1)}`).join(', ')}` : 'No completed working sets in the last 7 days.'}</T>
          <T color={colors.accent} weight="600">Details and exact totals ›</T>
        </Card>
      </Section>
      <Section title="Progress">
        <Card onPress={() => router.push('/profile/report')} accessibilityLabel="Monthly report">
          <Row style={{ justifyContent: 'space-between' }}><T variant="h3">Monthly report</T><T color={colors.accent}>›</T></Row>
          <T variant="small" color={colors.muted}>{monthLabel(report.month)} (in progress): {plural(report.current.sessions, 'session')}, {plural(report.current.workingSets, 'working set')}, {formatAggregate(report.current.volume, settings.unit, false)}</T>
        </Card>
        <Card onPress={() => router.push('/profile/goals')} accessibilityLabel="Lift goals">
          <Row style={{ justifyContent: 'space-between' }}><T variant="h3">Lift goals</T><T color={colors.accent}>›</T></Row>
          <T variant="small" color={colors.muted}>{data.goals.length ? `${achieved} of ${data.goals.length} reached` : 'Set a target load and reps for a lift.'}</T>
        </Card>
        <Card onPress={() => router.push('/profile/bodyweight')} accessibilityLabel="Bodyweight, optional">
          <Row style={{ justifyContent: 'space-between' }}><T variant="h3">Bodyweight (optional)</T><T color={colors.accent}>›</T></Row>
          <T variant="small" color={colors.muted}>{latestBw ? `Latest: ${formatAggregate(latestBw.weight, latestBw.unit, settings.showEquivalent)}` : 'Not tracking. The app works fully without it.'}</T>
        </Card>
      </Section>
      <Section title="Your data">
        <Card onPress={() => router.push('/profile/export')} accessibilityLabel="Export my data">
          <Row style={{ justifyContent: 'space-between' }}><T variant="h3">Export my data</T><T color={colors.accent}>›</T></Row>
          <T variant="small" color={colors.muted}>CSV files for a spreadsheet or analysis tool, via the share sheet.</T>
        </Card>
        <Card onPress={() => router.push('/exercises')} accessibilityLabel="Exercise library">
          <Row style={{ justifyContent: 'space-between' }}><T variant="h3">Exercise library</T><T color={colors.accent}>›</T></Row>
        </Card>
        <Card onPress={() => router.push('/settings')} accessibilityLabel="Settings">
          <Row style={{ justifyContent: 'space-between' }}><T variant="h3">Settings</T><T color={colors.accent}>›</T></Row>
          <T variant="small" color={colors.muted}>Units, text size, reminders, sync and account.</T>
        </Card>
      </Section>
    </Screen>
  );
}
