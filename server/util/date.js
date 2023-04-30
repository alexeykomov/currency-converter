export const getUTCDate = (inputDate) => {
  const date = inputDate ? new Date(inputDate) : new Date();
  const utcDate = new Date(date.toUTCString());
  return utcDate;
}

export const getDate12MonthAgo = () => {
  const today = getUTCDate();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  const twelveMonthsAgo = new Date(today);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  return twelveMonthsAgo;
}

export const getYesterday = () => {
  const today = getUTCDate();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return yesterday;
}

export function isPastInterval(targetDate, intervalMin) {
  const intervalMs = intervalMin * 60 * 1000;
  const now = getUTCDate();
  const diff = now.getTime() - new Date(targetDate).getTime();
  return diff > intervalMs;
}

export const isYesterday = (date) => {
  const yesterday = getYesterday();

  return date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();
};
