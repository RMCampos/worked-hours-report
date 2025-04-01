import { PeriodAmount } from '../types/periodAmount';
import { TODAYS_TRACKER, CURRENT_THEME, PERIOD_AMOUNT } from './constants';

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
  clearStorage,
  saveTheme,
  getTheme,
  saveAmountForPeriod,
  loadAmountForPeriod
};
