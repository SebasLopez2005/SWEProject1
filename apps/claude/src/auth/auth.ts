// AuthService: email/password via Supabase, offline reopen of a previously
// authenticated owner, and explicitly gated device-only profiles.
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { CLOUD_CONFIGURED, DEVICE_PROFILES_ENABLED, supabase } from './config';

export type Identity =
  | { kind: 'cloud'; ownerId: string; email: string; sessionValid: boolean }
  | { kind: 'device'; ownerId: string; label: string };

const LAST_OWNER = 'repwise.lastOwner';
const DEVICE_PROFILE = 'repwise.deviceProfile';

export class AuthError extends Error {}

async function remember(identity: Identity | null) {
  if (identity) await AsyncStorage.setItem(LAST_OWNER, JSON.stringify(identity));
  else await AsyncStorage.removeItem(LAST_OWNER);
}

export async function restoreIdentity(): Promise<Identity | null> {
  const raw = await AsyncStorage.getItem(LAST_OWNER);
  const last = raw ? (JSON.parse(raw) as Identity) : null;
  if (last?.kind === 'device') return DEVICE_PROFILES_ENABLED ? last : null;
  const sb = supabase();
  if (!sb) return null;
  try {
    const { data } = await sb.auth.getSession();
    const user = data.session?.user;
    if (user) {
      const id: Identity = { kind: 'cloud', ownerId: user.id, email: user.email ?? '', sessionValid: true };
      await remember(id);
      return id;
    }
  } catch {
    // network failure while refreshing: fall through to the cached owner
  }
  // A previously authenticated owner may reopen local data offline; uploads wait for sign-in.
  if (last?.kind === 'cloud') return { ...last, sessionValid: false };
  return null;
}

export async function signIn(email: string, password: string): Promise<Identity> {
  const sb = supabase();
  if (!sb) throw new AuthError('Cloud accounts are not configured in this build.');
  const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  if (error) {
    if (/network|fetch/i.test(error.message)) throw new AuthError('Signing in needs a connection. Check your network and try again.');
    throw new AuthError(error.message === 'Invalid login credentials' ? 'Email or password is incorrect.' : error.message);
  }
  const id: Identity = { kind: 'cloud', ownerId: data.user.id, email: data.user.email ?? email, sessionValid: true };
  await remember(id);
  return id;
}

export async function register(email: string, password: string): Promise<Identity | 'confirm_email'> {
  const sb = supabase();
  if (!sb) throw new AuthError('Cloud accounts are not configured in this build.');
  if (password.length < 8) throw new AuthError('Use a password of at least 8 characters.');
  const { data, error } = await sb.auth.signUp({ email: email.trim(), password });
  if (error) {
    if (/network|fetch/i.test(error.message)) throw new AuthError('Creating an account needs a connection.');
    throw new AuthError(error.message);
  }
  if (!data.session || !data.user) return 'confirm_email';
  const id: Identity = { kind: 'cloud', ownerId: data.user.id, email: data.user.email ?? email, sessionValid: true };
  await remember(id);
  return id;
}

export async function enterDeviceProfile(): Promise<Identity> {
  if (!DEVICE_PROFILES_ENABLED) throw new AuthError('Device-only profiles are disabled in this build.');
  let ownerId = await AsyncStorage.getItem(DEVICE_PROFILE);
  if (!ownerId) {
    ownerId = `device-${Crypto.randomUUID()}`;
    await AsyncStorage.setItem(DEVICE_PROFILE, ownerId);
  }
  const id: Identity = { kind: 'device', ownerId, label: 'This device only' };
  await remember(id);
  return id;
}

/** Clears the session. Callers must first check for unsynced work (SUP-01). */
export async function signOut(identity: Identity): Promise<void> {
  if (identity.kind === 'cloud') {
    try {
      await supabase()?.auth.signOut({ scope: 'local' });
    } catch {
      /* local session is cleared regardless */
    }
  }
  await remember(null);
}

export { CLOUD_CONFIGURED, DEVICE_PROFILES_ENABLED };
