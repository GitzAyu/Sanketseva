import { TranslationDictionary } from '../i18n/translations';
import { EventSeverity } from '../types/events';

export function eventLabel(type: string, t: TranslationDictionary): string {
  if (type.includes('GAS')) return t.filterGas;
  if (type.includes('FLAME') || type.includes('FIRE')) return t.filterFire;
  if (type.includes('SMOKE')) return t.filterSmoke;
  if (type.includes('POWER')) return t.filterPower;
  if (type.includes('VALVE')) return t.filterValve;
  if (type.includes('FAN')) return t.filterFan;
  return t.safetyEventsTab;
}

export function severityLabel(severity: EventSeverity, t: TranslationDictionary): string {
  if (severity === 'EMERGENCY' || severity === 'DANGER') return t.statusDanger;
  if (severity === 'WARNING') return t.statusWarning;
  return t.statusNormal;
}
