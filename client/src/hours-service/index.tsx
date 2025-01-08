/* Private functions */
const getParsedTime = (inputValue: string): number[] => {
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
function getHourMinuteLeftArrayFromMinutes(totalMinutes: number): number[] {
  let minutesLeft = 8 * 60 - totalMinutes;
  let hours = 0;
  while (minutesLeft >= 60) {
    hours += 1;
    minutesLeft -= 60;
  }
  return [hours, minutesLeft];
};

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

const calculateCompletionTime = (totalWorked: number[]): string[] => {
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
  return [currentH.toString(), currentM.toString()];
};

export { calculateWorkedHours, calculateCompletionTime, getHourMinuteLeftArrayFromMinutes };
