import { TodayTrackerStore } from '../types/todayTrackerStore';
import { PeriodAmount } from '../types/periodAmount';
import { TODAYS_TRACKER, CURRENT_THEME, PERIOD_AMOUNT } from './constants';

function saveTodayTracker(obj: TodayTrackerStore, theDay: string): void {
  localStorage.setItem(`${TODAYS_TRACKER}-${theDay}`, JSON.stringify(obj));
}

/**
 * Load saved data for a given date.
 * @param {string} theDay The day to be searched in the format Year/Month/Day
 * @returns {TodayTrackerStore | undefined} The data for the day, if found.
 */
function loadTrackerForDate(theDay: string): TodayTrackerStore | undefined {
  const saved: string | null = localStorage.getItem(`${TODAYS_TRACKER}-${theDay}`);
  if (saved) {
    return JSON.parse(saved);
  }
}

/**
 * Save the amount of hours worked in a period.
 * @param {PeriodAmount} obj The object to be saved.
 */
function saveAmountForPeriod(obj: PeriodAmount): void {
  localStorage.setItem(`${PERIOD_AMOUNT}-${obj.period}`, JSON.stringify(obj));
}

/**
 * Load the amount of hours worked in a period.
 * @param {string} period The period to be loaded.
 * @returns {number | undefined} The amount of hours worked in the period, if found.
 */
function loadAmountForPeriod(period: string): number {
  const saved: string | null = localStorage.getItem(`${PERIOD_AMOUNT}-${period}`);
  if (saved) {
    return JSON.parse(saved).amountOfMinutes;
  }
  return 0;
}

/**
 * Clear all the storage for the current user.
 */
function clearStorage(): void {
  localStorage.removeItem(TODAYS_TRACKER);
  localStorage.removeItem(CURRENT_THEME);
}

function saveTheme(theme: string): void {
  localStorage.setItem(CURRENT_THEME, theme);
}

function getTheme(): string | null {
  return localStorage.getItem(CURRENT_THEME);
}

export {
  saveTodayTracker,
  clearStorage,
  loadTrackerForDate,
  saveTheme,
  getTheme,
  saveAmountForPeriod,
  loadAmountForPeriod
};
