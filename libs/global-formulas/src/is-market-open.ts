/**
 * Returns true if the current date/time is a weekday (Mon-Fri) between 9:00am and 4:30pm Eastern Time.
 */
export function isMarketOpenNow(): boolean {
  // Get current time in UTC
  const now = new Date();

  // Convert to Eastern Time (ET = UTC-5 or UTC-4 depending on DST)
  // US Eastern Time observes DST: UTC-4 during DST, UTC-5 otherwise
  // We'll use Intl.DateTimeFormat to get the offset
  const etFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = etFormatter.formatToParts(now);
  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '0';

  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');
  const hour = getPart('hour');
  const minute = getPart('minute');
  const second = getPart('second');

  const etDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );

  const dayOfWeek = etDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false; // Weekend
  }

  const hourNum = etDate.getHours();
  const minuteNum = etDate.getMinutes();

  // Market opens at 9:00, closes at 16:30
  const isAfterOpen = hourNum > 9 || (hourNum === 9 && minuteNum >= 0);
  const isBeforeClose = hourNum < 16 || (hourNum === 16 && minuteNum <= 30);

  return isAfterOpen && isBeforeClose;
}
