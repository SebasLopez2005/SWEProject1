// UI-01 palette with UI-04 density: graphite canvas, charcoal grouped
// surfaces, warm champagne accent, light text; iOS-like type sizes.
export const colors = {
  canvas: '#0E0E10',
  surface: '#1A1A1E',
  surfaceRaised: '#242429',
  surfacePressed: '#2B2B31',
  separator: 'rgba(255,255,255,0.08)',
  border: '#303037',
  text: '#F4F1EB', // 17.5:1 on canvas
  muted: '#A9A49B', // 7.9:1 on canvas
  faint: '#827D75', // 4.9:1 on canvas (secondary labels only)
  accent: '#E3C58F', // champagne, 11.6:1 on canvas
  accentText: '#17130C',
  accentSoft: 'rgba(227,197,143,0.12)',
  success: '#7FD3A2',
  successSoft: 'rgba(127,211,162,0.10)',
  warning: '#F2B266',
  danger: '#FF8A80',
  dangerSoft: 'rgba(255,138,128,0.12)',
  info: '#9CC3F0',
  // Muscle heat bands 1..4 (0 = untrained, drawn as the figure's base tone).
  heat: ['#2A2A30', '#5B4A2C', '#8A6E3D', '#B99257', '#E3C58F'],
  figureBase: '#2E2E35',
  figureSkin: '#3D3D45',
};

export const space = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 };
export const radius = { sm: 8, md: 10, lg: 14, xl: 18, pill: 999 };
export const minTouch = 44;

/** Close to iOS defaults (UI-04); multiplied by the text-scale setting. */
export const typeScale = {
  display: 30,
  title: 22,
  h2: 17,
  h3: 15,
  body: 15,
  small: 13,
  caption: 11.5,
};
