// UI-01: graphite canvas, charcoal surfaces, warm champagne accents, light text.
// Solid pairings were chosen for >= 4.5:1 contrast against their surfaces.
export const colors = {
  canvas: '#121214',
  surface: '#1C1C20',
  surfaceRaised: '#25252B',
  border: '#34343C',
  text: '#F2EFE9', // 15.9:1 on canvas
  muted: '#B4AEA4', // 8.4:1 on canvas, 7.6:1 on surface
  faint: '#8C877F', // 5.3:1 on canvas (labels only)
  accent: '#E3C58F', // champagne, 11.1:1 on canvas
  accentText: '#1A1610', // on champagne fills
  accentSoft: 'rgba(227,197,143,0.14)',
  success: '#86D3A9',
  warning: '#F2B266',
  danger: '#FF8A80',
  dangerFill: '#4A1F1D',
  info: '#9CC3F0',
  chart: ['#E3C58F', '#9CC3F0', '#86D3A9', '#F2B266', '#C9A7F0'],
  heat: ['transparent', '#4B3F2A', '#7A6338', '#B08D4F', '#E3C58F'],
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 12, lg: 18, pill: 999 };
export const minTouch = 44;

export const typeScale = {
  display: 32,
  title: 26,
  h2: 20,
  h3: 17,
  body: 16,
  small: 14,
  caption: 12.5,
};
