export function startOfDay(value = new Date()) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function average(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

export function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}
