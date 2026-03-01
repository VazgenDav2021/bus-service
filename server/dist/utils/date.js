export function normalizeStartOfDayUtc(value) {
    const date = new Date(value);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
export function normalizeEndOfDayUtc(value) {
    const date = new Date(value);
    date.setUTCHours(23, 59, 59, 999);
    return date;
}
export function isWorkingDayUtc(value) {
    const day = value.getUTCDay();
    return day >= 1 && day <= 5;
}
