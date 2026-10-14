export function formatRelativeTime(timestamp: number, locale = 'en', neverLabel = 'Never'): string {
  if (!timestamp || timestamp <= 0) return neverLabel;
  const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  const [value, unit] = diffSec < 60
    ? [Math.max(1, diffSec), 'second'] as const
    : diffSec < 3600
      ? [Math.floor(diffSec / 60), 'minute'] as const
      : diffSec < 86400
        ? [Math.floor(diffSec / 3600), 'hour'] as const
        : [Math.floor(diffSec / 86400), 'day'] as const;
  try {
    const formatter = new Intl.RelativeTimeFormat(locale === 'bho' ? 'hi' : locale, { numeric: 'auto' });
    return formatter.format(-value, unit);
  } catch {
    return formatterFallback(value, unit);
  }
}

function formatterFallback(value: number, unit: 'second' | 'minute' | 'hour' | 'day'): string {
  const labels = { second: 'seconds', minute: 'minutes', hour: 'hours', day: 'days' };
  return `${value} ${labels[unit]} ago`;
}

export function formatTimestamp(timestamp: number): string {
  if (!timestamp || timestamp <= 0) return '—';
  const d = new Date(timestamp);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function formatDateTime(timestamp: number): string {
  if (!timestamp || timestamp <= 0) return '—';
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const time = formatTimestamp(timestamp);
  return `${year}-${month}-${day} ${time}`;
}
