export function toDateInputRange(
  startDate: string,
  endDate: string
): { startIso: string; endIso: string } {
  return {
    startIso: new Date(`${startDate}T00:00:00.000Z`).toISOString(),
    endIso: new Date(`${endDate}T23:59:59.999Z`).toISOString(),
  };
}

export function toLocaleDate(value: string): string {
  return new Date(value).toLocaleDateString();
}
