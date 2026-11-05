import { useState } from 'react';
import { defaults, type Unit } from '../src/domain';
import { demoEnabled, hasCloud, useApp } from '../src/session';
import { Busy, Button, Card, c, Field, Icon, message, Notice, Page, Txt } from '../src/ui';

export default function Welcome() {
  const app = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  async function run(work: () => Promise<unknown>) {
    setBusy(true); setError(''); setNote('');
    try { const info = await work(); if (typeof info === 'string') setNote(info); }
    catch (e) { setError(message(e)); }
    finally { setBusy(false); }
  }
  function choose(unit: Unit) {
    try { app.save({ ...defaults, unit }); } catch (e) { setError(message(e)); }
  }
  if (app.loading) return <Busy />;
  return <Page kicker="FITNESS & WORKOUT LOG" title={app.owner ? 'Choose your unit' : 'Your training log'}
    subtitle={app.owner ? 'Use the unit you train in most often. You can enter either unit on any weighted set.' : undefined}>
    {!app.owner && <Card dark>
      <Icon name="barbell-outline" size={40} color={c.accent} />
      <Txt variant="display" color={c.surface}>Know what you lifted.</Txt>
      <Txt color={c.onDark}>Record sets between lifts, see what you did last time, and follow your training over time.</Txt>
    </Card>}
    <Notice message={app.bootError || error} error />
    <Notice message={note} />
    {app.owner ? <>
      <Button label="Kilograms (kg)" onPress={() => choose('kg')} />
      <Button label="Pounds (lb)" tone="secondary" onPress={() => choose('lb')} />
    </> : demoEnabled ? <Card>
      <Txt variant="h2">Classroom demo</Txt>
      <Txt color={c.muted}>Explore six workouts, two templates, and all three exercise types. Changes stay on this device.</Txt>
      <Button label="Open classroom demo" icon="arrow-forward" disabled={busy} onPress={() => void run(app.demo)} />
    </Card> : hasCloud ? <Card>
      <Txt variant="h2">{register ? 'Create an account' : 'Sign in'}</Txt>
      <Field label="Email" defaultValue={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"
        autoCorrect={false} autoComplete="email" />
      <Field label="Password" defaultValue={password} onChangeText={setPassword} secureTextEntry
        autoCapitalize="none" autoComplete="off" textContentType="none" autoCorrect={false} />
      <Button label={busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'} disabled={busy || !email.trim() || !password}
        onPress={() => void run(() => app.login(email, password, register))} />
      <Button label={register ? 'Back to sign in' : 'Create an account'} tone="quiet" disabled={busy}
        onPress={() => { setRegister(!register); setError(''); setNote(''); }} />
      <Txt variant="small" color={c.muted}>The first sign-in requires an internet connection.</Txt>
    </Card> : <Notice message="Supabase is required for account access. Configure the project URL and publishable key." error />}
  </Page>;
}
