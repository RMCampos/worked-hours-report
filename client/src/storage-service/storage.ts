import { TodayTrackerStore } from '../types/todayTrackerStore';
import { TODAYS_TRACKER } from './constants';

const formatTodayDate = (): string => {
  const today = new Date();
  return `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
};

function saveTodayTracker(obj: TodayTrackerStore): void {
  localStorage.setItem(`${TODAYS_TRACKER}-${formatTodayDate()}`, JSON.stringify(obj));
}

function loadTodayTracker(): TodayTrackerStore | undefined {
  const saved: string | null = localStorage.getItem(`${TODAYS_TRACKER}-${formatTodayDate()}`);
  if (saved) {
    return JSON.parse(saved);
  }
}

/**
 * Clear all the storage for the current user.
 */
function clearStorage(): void {
  localStorage.removeItem(TODAYS_TRACKER);
}

export { saveTodayTracker, clearStorage, loadTodayTracker };
