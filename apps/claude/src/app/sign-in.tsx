import { useState } from 'react';
import { View } from 'react-native';
import { CLOUD_CONFIGURED, DEVICE_PROFILES_ENABLED, AuthError, enterDeviceProfile, register, signIn } from '../auth/auth';
import { cloudHost } from '../auth/config';
import { useApp } from '../state/session';
import { Banner, Button, Card, Field, Screen, Segmented, T } from '../ui/kit';
import { colors, space } from '../ui/theme';

export default function SignIn() {
  const { open } = useApp();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setInfo(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Enter a valid email address.');
    if (!password) return setError('Enter your password.');
    try {
      if (mode === 'signin') await open(await signIn(email, password));
      else {
        const r = await register(email, password);
        if (r === 'confirm_email') setInfo('Check your inbox to confirm your email, then sign in.');
        else await open(r);
      }
    } catch (e) {
      setError(e instanceof AuthError ? e.message : 'Something went wrong. Check your connection and try again.');
    }
  };

  return (
    <Screen>
      <View style={{ height: 48 }} />
      <T variant="display" color={colors.accent}>Repwise</T>
      <T color={colors.muted}>Plan your sets, log what you lift, and see your progress — even offline.</T>
      {CLOUD_CONFIGURED ? (
        <Card>
          <Segmented label="Account" value={mode} onChange={setMode} options={[{ value: 'signin', label: 'Sign in' }, { value: 'register', label: 'Create account' }]} />
          <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" placeholder="you@example.com" />
          <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry textContentType={mode === 'signin' ? 'password' : 'newPassword'}
            hint={mode === 'register' ? 'At least 8 characters.' : undefined} onSubmitEditing={submit} returnKeyType="go" />
          {error ? <Banner tone="danger">{error}</Banner> : null}
          {info ? <Banner tone="success">{info}</Banner> : null}
          <Button title={mode === 'signin' ? 'Sign in' : 'Create account'} onPress={submit} />
          <T variant="caption" color={colors.faint}>Signing in or creating an account needs a connection. After that, logging works offline. Server: {cloudHost()}</T>
        </Card>
      ) : (
        <Banner tone="warning">Cloud accounts are not configured in this build, so data cannot be uploaded.</Banner>
      )}
      {DEVICE_PROFILES_ENABLED ? (
        <Card>
          <T variant="h3">Use without an account</T>
          <T color={colors.muted}>Keeps everything on this device only. Nothing is uploaded or backed up. Good for trying the app or a classroom demo.</T>
          <Button variant="secondary" title="Continue on this device only" onPress={async () => open(await enterDeviceProfile())} />
        </Card>
      ) : null}
      <View style={{ height: space.xl }} />
    </Screen>
  );
}
