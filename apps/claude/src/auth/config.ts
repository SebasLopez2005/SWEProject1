import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

// Public configuration only. The publishable/anon key is designed to ship in
// clients; service-role keys must never be placed here.
const URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

/**
 * Device-only profiles let the app run with no cloud account (for example a
 * classroom demo without a configured backend). They never touch the server
 * and are labelled as such everywhere. Enabled only by an explicit flag.
 */
export const DEVICE_PROFILES_ENABLED = process.env.EXPO_PUBLIC_ENABLE_DEVICE_PROFILES === 'true';

export const CLOUD_CONFIGURED = /^https?:\/\//.test(URL) && KEY.length > 20;

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient | null {
  if (!CLOUD_CONFIGURED) return null;
  if (!client) {
    client = createClient(URL, KEY, {
      auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
    });
    // Refresh tokens only while the app is in the foreground (Supabase RN guidance).
    AppState.addEventListener('change', (state) => {
      if (state === 'active') client?.auth.startAutoRefresh();
      else client?.auth.stopAutoRefresh();
    });
  }
  return client;
}

export function cloudHost(): string | null {
  if (!CLOUD_CONFIGURED) return null;
  try {
    return new globalThis.URL(URL).host;
  } catch {
    return null;
  }
}
