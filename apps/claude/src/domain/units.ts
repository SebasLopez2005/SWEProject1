import type { Unit } from './types';

/** Source-selected conversion factor: 1 kg = 2.20462 lb. */
export const LB_PER_KG = 2.20462;

export function convert(value: number, from: Unit, to: Unit): number {
  if (from === to) return value;
  return from === 'kg' ? value * LB_PER_KG : value / LB_PER_KG;
}

export function otherUnit(unit: Unit): Unit {
  return unit === 'kg' ? 'lb' : 'kg';
}

/** Round only for display: one decimal, trailing ".0" removed. */
export function round1(value: number): string {
  const r = Math.round(value * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

export function formatWeight(value: number, unit: Unit): string {
  return `${round1(value)} ${unit}`;
}

/**
 * Display a stored weight. The primary value is shown in the unit it was
 * entered; the equivalent in the other unit is appended when enabled,
 * e.g. "60 kg (132.3 lb)".
 */
export function formatStoredWeight(value: number, unit: Unit, showEquivalent: boolean): string {
  const primary = formatWeight(value, unit);
  if (!showEquivalent) return primary;
  const other = otherUnit(unit);
  return `${primary} (${formatWeight(convert(value, unit, other), other)})`;
}

/** Display an aggregate already expressed in the display unit. */
export function formatAggregate(value: number, displayUnit: Unit, showEquivalent: boolean): string {
  return formatStoredWeight(value, displayUnit, showEquivalent);
}
