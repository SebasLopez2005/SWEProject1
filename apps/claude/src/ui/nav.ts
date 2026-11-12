import { colors } from './theme';

/** Native iOS large-title header on the canvas colour (UI-04). */
export const largeTitleOptions = {
  headerLargeTitle: true,
  headerLargeTitleShadowVisible: false,
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.canvas },
  headerLargeStyle: { backgroundColor: colors.canvas },
  headerTintColor: colors.accent,
  headerTitleStyle: { color: colors.text },
  headerLargeTitleStyle: { color: colors.text },
  headerBackButtonDisplayMode: 'minimal' as const,
  contentStyle: { backgroundColor: colors.canvas },
};

/** Standard header for pushed screens. */
export const pushedOptions = {
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.canvas },
  headerTintColor: colors.accent,
  headerTitleStyle: { color: colors.text },
  headerBackButtonDisplayMode: 'minimal' as const,
  contentStyle: { backgroundColor: colors.canvas },
};
