export function getDatOfTheWeek(day: number): string {
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
