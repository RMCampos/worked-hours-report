/* Private functions */
const getParsedTime = (inputValue: string): number[] => {
  if (!inputValue) {
    return [0, 0];
  }
  if (inputValue.includes(':')) {
    const timeStr: string[] = inputValue.split(':');
    return [parseInt(timeStr[0]), parseInt(timeStr[1])];
  }
  else {
    return [parseInt(inputValue), 0];
  }
};

const sumTimes = (start: number[], end: number[]) => {
  const startH = start[0];
  const startM = start[1];
  const endH = end[0];
  const endM = end[1];

  if (endM >= startM) {
    return [endH - startH, endM - startM];
  }

  const h = endH - startH - 1;
  const m = endM - startM + 60;
  return [h, m];
};

/* Public function */
/**
 * Get the hours and minutes left to complete the 8 hours of work.
 * @param {number} totalMinutes The total minutes worked.
 * @returns {number[]} The hours and minutes left to complete the 8 hours of work.
 */
function getHourMinuteLeftArrayFromMinutes(totalMinutes: number): number[] {
  let minutesLeft = 8 * 60 - totalMinutes;
  let hours = 0;
  while (minutesLeft >= 60) {
    hours += 1;
    minutesLeft -= 60;
  }
  return [hours, minutesLeft];
};

/**
 * Calculate the total worked hours and minutes.
 * @param {string[]} values The values to be calculated.
 * @returns {number[]} The total worked hours and minutes.
 */
function calculateWorkedHours(values: string[]): number[] {
  let totalWorkedHours = 0;
  let totalWorkedMinutes = 0;
  for (let i = 1, len = values.length; i <= len; i += 2) {
    const start = getParsedTime(values[i - 1]);
    const end = getParsedTime(values[i]);

    if (end[0] > 0 && end[1] >= 0) {
      const sum = sumTimes(start, end);
      totalWorkedHours += sum[0];
      totalWorkedMinutes += sum[1];
    }

    if (totalWorkedMinutes >= 60) {
      totalWorkedMinutes -= 60;
      totalWorkedHours += 1;
    }
  }
  return [totalWorkedHours, totalWorkedMinutes];
}

/**
 * Calculate the time when the user will complete the 8 hours of work.
 * @param {number[]} totalWorked The total worked hours and minutes.
 * @returns {string[]} The time when the user will complete the 8 hours of work.
 */
function calculateCompletionTime(totalWorked: number[]): string[] {
  const totalMinutes = totalWorked[1] + (totalWorked[0] * 60);

  if (totalMinutes >= 8 * 60) {
    return ['You are done today! Go home!'];
  }

  const leftArray = getHourMinuteLeftArrayFromMinutes(totalMinutes);
  const hours = leftArray[0];
  const minutes = leftArray[1];
  const currentDate = new Date();
  let currentH = currentDate.getHours() + hours;
  let currentM = currentDate.getMinutes();
  currentM += minutes;
  if (currentM >= 60) {
    currentH += 1;
    currentM -= 60;
  }
  if (currentM < 10) {
    return [currentH.toString(), `0${currentM}`];
  }
  if (currentH >= 24) {
    currentH -= 24;
  }
  return [currentH.toString(), currentM.toString()];
};

/**
 * Format minutes to hours and minutes.
 * @param {number} formatMinutes minutes to be formatted.
 * @returns {string} The formatted string.
 */
function formatMinutes(formatMinutes: number): string {
  let hours = 0;
  const isNegative = formatMinutes < 0;

  let newMinutes = formatMinutes;
  if (isNegative) {
    newMinutes = Math.abs(formatMinutes);
  }
  while (newMinutes >= 60) {
    hours += 1;
    newMinutes -= 60;
  }
  let formatted = `${hours}h ${newMinutes}m`;
  if (isNegative) {
    formatted = `-${formatted}`;
  }
  return formatted;
};

export {
  calculateWorkedHours,
  calculateCompletionTime,
  getHourMinuteLeftArrayFromMinutes,
  formatMinutes
};
