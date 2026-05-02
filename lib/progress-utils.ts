export function startOfDay(value = new Date()) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function finiteValues(values: unknown[]) {
  return Array.isArray(values) ? values.filter((value): value is number => typeof value === "number" && Number.isFinite(value)) : [];
}

export function average(values: unknown[]) {
  const numbers = finiteValues(values);
  return numbers.length ? Math.round(numbers.reduce((sum, value) => sum + value, 0) / numbers.length) : 0;
}

export function sum(values: unknown[]) {
  return finiteValues(values).reduce((total, value) => total + value, 0);
}
