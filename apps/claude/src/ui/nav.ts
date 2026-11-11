import { colors } from './theme';

/** Native iOS large-title header that blurs content scrolling beneath it (UI-04). */
export const largeTitleOptions = {
  headerLargeTitle: true,
  headerTransparent: true,
  headerBlurEffect: 'systemChromeMaterialDark' as const,
  headerLargeTitleShadowVisible: false,
  headerShadowVisible: false,
  headerTintColor: colors.accent,
  headerTitleStyle: { color: colors.text },
  headerLargeTitleStyle: { color: colors.text },
  headerBackButtonDisplayMode: 'minimal' as const,
  contentStyle: { backgroundColor: colors.canvas },
};

/** Standard translucent header for pushed screens. */
export const pushedOptions = {
  headerTransparent: true,
  headerBlurEffect: 'systemChromeMaterialDark' as const,
  headerShadowVisible: false,
  headerTintColor: colors.accent,
  headerTitleStyle: { color: colors.text },
  headerBackButtonDisplayMode: 'minimal' as const,
  contentStyle: { backgroundColor: colors.canvas },
};
