import { useState } from 'react';
import { Image, View } from 'react-native';
import { cloud, demoEnabled } from './cloud';
import { useApp } from './state';
import { Button, ErrorNote, Field, Kicker, Loading, Page, T, c, s } from './ui';

export function Welcome() {
  const app = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  if (app.loading) return <Loading />;
  async function submit() {
    if (waiting) return;
    setWaiting(true);
    setError(''); setMessage('');
    try { setMessage(await app.sign(email, password, register)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to connect. Try again.'); }
    finally { setWaiting(false); }
  }
  return <Page>
    <View style={{ gap: 12, paddingVertical: 12, marginBottom: 7 }}>
      <Image source={require('../assets/icon.png')} style={{ width: 65, height: 65, borderRadius: 18, borderWidth: 1, borderColor: c.rule }} accessibilityIgnoresInvertColors />
      <Kicker>THE TRAINING JOURNAL</Kicker>
      <T kind="hero" accessibilityRole="header">Formwork.</T>
      <T kind="label" color={c.muted}>Plan your lifts. Log the work. See what adds up.</T>
    </View>
    {cloud ? <View style={s.panel}>
      <T kind="sub">{register ? 'Create your account' : 'Sign in'}</T>
      <Field label="Email" autoCapitalize="none" autoComplete="email" inputMode="email" value={email} onChangeText={setEmail} />
      <Field label="Password" autoCapitalize="none" autoCorrect={false} secureTextEntry autoComplete={register ? 'new-password' : 'current-password'} value={password} onChangeText={setPassword} />
      <Button label={waiting ? 'Connecting…' : register ? 'Create account' : 'Sign in'} tone="primary" disabled={waiting} onPress={() => void submit()} />
      <Button label={register ? 'Back to sign in' : 'New here? Create an account'} tone="quiet" onPress={() => { setRegister(!register); setError(''); setMessage(''); }} />
      {message ? <T color={c.green}>{message}</T> : null}
    </View> : !demoEnabled ? <ErrorNote message="Set up Supabase before signing in. See README.md for local setup." /> : null}
    <ErrorNote message={error || app.authError} />
    {demoEnabled ? <View style={s.panel}>
      <Kicker>DEVELOPMENT DEMO</Kicker>
      <T color={c.muted}>Try the journal with two routines and sample training history. This workspace stays on this device.</T>
      <Button label="Open demo journal" testID="open-demo" tone="primary" onPress={app.enterDemo} />
    </View> : null}
  </Page>;
}
