import { useState } from 'react';
import { allSets, finishWorkout, formatDate, isDeleted, setLabel, type Conflict, type Root, type Settings, type Unit, type Workout } from '../../src/domain';
import { useApp } from '../../src/session';
import { Button, Card, c, Chip, confirm, Field, Item, message, Notice, Page, Row, Sheet, Txt } from '../../src/ui';

export default function SettingsScreen() {
  const app = useApp();
  const { model, owner, status, syncMessage, retry, signOut, save } = app;
  const settings = model!.settings;
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [conflictId, setConflictId] = useState('');
  const [reauth, setReauth] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const selected = model!.conflicts.find(q => q.kind + ':' + q.id === conflictId);
  const pending = model!.pending.size;
  function change(patch: Partial<Settings>) {
    try { save({ ...settings, ...patch }, settings); setNote('Display settings saved.'); setError(''); }
    catch (e) { setError('Not saved. ' + message(e)); }
  }
  async function leave(discard = false) {
    setBusy(true);
    try { await signOut(discard); }
    catch (e) { setError(message(e)); }
    finally { setBusy(false); }
  }
  return <Page title="Settings" kicker="YOUR PREFERENCES" subtitle="Adjust your display and check your account.">
    <Notice message={error} error />
    <Notice message={note} />
    <Card>
      <Txt variant="h2">Weight display</Txt>
      <Row>{(['kg', 'lb'] as Unit[]).map(unit => <Chip key={unit} label={unit === 'kg' ? 'Kilograms (kg)' : 'Pounds (lb)'}
        selected={settings.unit === unit} onPress={() => change({ unit })} />)}</Row>
      <Txt color={c.muted}>Show the equivalent in the other unit beside each weight.</Txt>
      <Row><Chip label="Show both units" selected={settings.equivalents} onPress={() => change({ equivalents: true })} />
        <Chip label="Show one unit" selected={!settings.equivalents} onPress={() => change({ equivalents: false })} /></Row>
    </Card>
    <Card>
      <Txt variant="h2">Text size</Txt>
      <Txt color={c.muted}>Adjust text throughout the log.</Txt>
      <Row>{[1, 1.25, 1.5, 1.75, 2].map(scale => <Chip key={scale} label={(scale * 100) + '%'}
        selected={settings.scale === scale} onPress={() => change({ scale })} />)}</Row>
    </Card>
    <Card>
      <Txt variant="h2">{owner?.demo ? 'Classroom demo' : 'Account & sync'}</Txt>
      <Txt>{owner?.email}</Txt>
      {owner?.demo ? <Txt color={c.muted}>Demo data and changes are saved on this device.</Txt> : <>
        <Txt variant="strong">{status === 'Idle' ? pending ? 'Waiting to upload' : 'Up to date' : status}</Txt>
        <Txt color={c.muted}>{pending} {pending === 1 ? 'record' : 'records'} waiting to upload · {model!.conflicts.length} need attention</Txt>
        {!!syncMessage && <Txt color={c.muted}>{syncMessage}</Txt>}
        <Button label="Sync now" icon="sync-outline" tone="secondary" disabled={status === 'Syncing'} onPress={retry} />
        {status === 'Needs sign-in' && <Button label="Sign in again" onPress={() => { setPassword(''); setReauth(true); }} />}
      </>}
      <Button label={owner?.demo ? 'Exit classroom demo' : 'Sign out'} tone="quiet" disabled={busy} onPress={() => {
        setError('');
        if (pending || model!.conflicts.length) {
          confirm('Discard unsynced changes and sign out?',
            'This clears this account’s local cache, pending changes, and conflicts. Previously uploaded records can download again.',
            'Discard and sign out', () => void leave(true));
        } else void leave();
      }} />
    </Card>
    {!!model!.conflicts.length && <Txt variant="h2">Needs attention</Txt>}
    {model!.conflicts.map(q => <Item key={q.kind + ':' + q.id} title={describe(app.conflictLocal(q))}
      detail={q.reason} onPress={() => setConflictId(q.kind + ':' + q.id)} />)}
    {selected && <ConflictReview key={conflictId} conflict={selected} onClose={() => setConflictId('')} />}
    {reauth && <Sheet title="Sign in again" onClose={() => setReauth(false)}>
      <Txt>{owner?.email}</Txt>
      <Field label="Password" secureTextEntry autoComplete="off" textContentType="none" autoCorrect={false} defaultValue={password} onChangeText={setPassword} />
      <Notice message={error} error />
      <Button label="Sign in" disabled={!password || busy} onPress={async () => {
        setError(''); setBusy(true);
        try { await app.login(owner!.email, password, false); setReauth(false); setPassword(''); }
        catch (e) { setError(message(e)); }
        finally { setBusy(false); }
      }} />
    </Sheet>}
  </Page>;
}
function describe(root?: Root | null) {
  if (!root) return 'No server record';
  if (root.kind === 'workout') return formatDate(root.date) + ' · ' + allSets(root).length + ' sets · ' +
    (isDeleted(root) ? 'Removed' : root.state === 'active' ? 'Active' : 'Finished');
  if (root.kind === 'settings') return root.unit + ' · ' + root.scale * 100 + '% text · ' + (root.equivalents ? 'Both units' : 'One unit');
  return root.name + (isDeleted(root) ? ' · Removed' : root.kind === 'exercise' && root.archived ? ' · Archived' : '');
}
function ConflictReview({ conflict, onClose }: { conflict: Conflict; onClose(): void }) {
  const app = useApp();
  const local = app.conflictLocal(conflict);
  const remote = conflict.remote?.root;
  const [name, setName] = useState(local?.kind === 'exercise' || local?.kind === 'template' ? local.name : '');
  const [error, setError] = useState('');
  const competing = [remote, conflict.blocker?.root].some(r => r?.kind === 'workout' && r.state === 'active' && !isDeleted(r));
  const needsFinish = local?.kind === 'workout' && local.state === 'active' && competing;
  function run(choice: 'remote' | 'local' | 'copy') {
    try {
      const copy = choice === 'copy' && needsFinish && local?.kind === 'workout' ? finishWorkout(local) : undefined;
      const reviewed = local?.kind === 'exercise' || local?.kind === 'template' ? { ...local, name: name.trim() } : undefined;
      app.resolve(conflict, choice, copy, reviewed); onClose();
    } catch (e) { setError(message(e)); }
  }
  function snapshot(title: string, root?: Root | null) {
    return <Card>
      <Txt variant="label" color={c.green}>{title}</Txt>
      <Txt variant="strong">{describe(root)}</Txt>
      {root?.kind === 'workout' && root.entries.map(e => <Txt key={e.id}>
        {app.model!.exercises.find(x => x.id === e.exerciseId)?.name ?? 'Exercise'}{'\n'}
        {e.sets.map(s => setLabel(s, app.model!.settings)).join(' / ') || 'No sets'}
      </Txt>)}
      {root?.kind === 'template' && <Txt>{root.exercises.map(id =>
        app.model!.exercises.find(x => x.id === id)?.name ?? 'Exercise').join(', ')}</Txt>}
      {root?.kind === 'exercise' && <Txt>{root.muscle} · {root.type.replaceAll('_', ' ')}</Txt>}
    </Card>;
  }
  return <Sheet title="Review sync conflict" onClose={onClose}>
    <Notice message={conflict.reason} />
    {snapshot('ON THIS DEVICE', local)}
    {snapshot('ON THE SERVER', remote)}
    {conflict.blocker && snapshot('ACTIVE SESSION FROM ANOTHER DEVICE', conflict.blocker.root)}
    <Notice message={error} error />
    {(local?.kind === 'exercise' || local?.kind === 'template') && !isDeleted(local) &&
      <Field label="Name to keep on upload" defaultValue={name} onChangeText={setName} />}
    {local?.kind === 'workout' && !isDeleted(local) &&
      <Button label={needsFinish ? 'Finish and save local copy' : 'Save local changes as a copy'} onPress={() => run('copy')} />}
    {local && local.kind !== 'workout' &&
      <Button label="Keep reviewed local changes" onPress={() => run('local')} />}
    <Button label="Keep server version" tone="danger" onPress={() =>
      confirm('Keep the server version?', 'Your conflicting changes on this device will be discarded.', 'Keep server version', () => run('remote'))} />
  </Sheet>;
}
