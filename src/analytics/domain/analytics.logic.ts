import { DailyVisitData, TrafficData } from './types/analytics.types';

export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  const change = ((current - previous) / previous) * 100;
  return Math.round(change * 10) / 10;
}

export function calculateBounceRate(total: number, bounced: number): number {
  if (total === 0) return 0;
  const rate = (bounced / total) * 100;
  return Math.round(rate * 10) / 10;
}

export function fillEmptyDates(rawData: DailyVisitData[], days: number, startDate: Date) {
  const dataMap = new Map(rawData.map((item) => [item.date, item]));
  const result: TrafficData[] = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const dateStr = `${month}/${day}`;

    const data = dataMap.get(dateStr);
    result.push({
      date: dateStr,
      pv: data ? parseInt(data.pv, 10) : 0,
      uv: data ? parseInt(data.uv, 10) : 0,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

export function getStartDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - (daysAgo - 1));
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getTodayComparisonRanges() {
  const todayEnd = new Date();
  const todayStart = getStartDate(1);
  const yesterdayStart = getStartDate(2);
  const yesterdayEnd = new Date(todayStart);
  yesterdayEnd.setMilliseconds(-1);

  return { todayStart, todayEnd, yesterdayStart, yesterdayEnd };
}
