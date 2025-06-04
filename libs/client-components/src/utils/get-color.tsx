export const getColor = (value: number, colorize?: boolean) => {
  if (!colorize) return 'inherit';
  if (value > 0) return 'var(--color-green-600)'; // green-600
  if (value < 0) return 'var(--color-red-600)'; // red-600
  return 'inherit';
};
