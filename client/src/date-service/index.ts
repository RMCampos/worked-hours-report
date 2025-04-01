/**
 * Get the day of the week.
 * @param {number} day The day to be used.
 * @returns {string} The day of the week.
 */
export function getDayOfTheWeek(day: number): string {
  switch (day) {
    case 0: return 'Sunday';
    case 1: return 'Monday';
    case 2: return 'Tuesday';
    case 3: return 'Wednesday';
    case 4: return 'Thursday';
    case 5: return 'Friday';
    case 6: return 'Saturday';
    default: return '';
  }
}

/**
 * Get the month name.
 * @param {number} month The month to be used.
 * @returns {string} The month name.
 */
export function getMonthName(month: number): string {
  switch (month) {
    case 0: return 'January';
    case 1: return 'February';
    case 2: return 'March';
    case 3: return 'April';
    case 4: return 'May';
    case 5: return 'Jun';
    case 6: return 'July';
    case 7: return 'August';
    case 8: return 'September';
    case 9: return 'October';
    case 10: return 'November';
    case 11: return 'December';
    default: return '';
  }
}

/**
 * Get the day extension.
 * @param {number} day The day to be used.
 * @returns {string} The day extension.
 */
export function getDayExtension(day: number): string {
  switch (day) {
    case 1:
    case 21:
    case 31: return 'st';
    case 2:
    case 22: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Get the amount of days in a month.
 * @param {number} month The month to be used.
 * @returns {number} The amount of days in the month.
 */
export function getDaysInMonth(month: number): number {
  switch (month) {
    case 1: return 28;
    case 3:
    case 5:
    case 8:
    case 10: return 30;
    default: return 31;
  }
}

/**
 * Get the last period based on current month-1 and year.
 * @param {number} selectedMonthId The selected month id.
 * @param {number} selectedYearId The selected year id.
 * @returns {string} The last period.
 */
export function getLastPeriod(selectedMonthId: number, selectedYearId: number): string {
  let lastMonth = selectedMonthId - 1;
  let lastYear = selectedYearId;
  if (selectedMonthId === 0) {
    lastMonth = 11;
    lastYear = selectedYearId - 1;
  }
  return `${lastYear}/${lastMonth}`;
}
