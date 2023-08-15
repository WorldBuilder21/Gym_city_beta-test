export function getWeeksInMonth(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const totalDays = lastDay.getDate() - firstDay.getDate() + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  return totalWeeks;
}

export function generateWeekArray(totalWeeks) {
  const weekArray = [];
  for (let i = 1; i <= totalWeeks; i++) {
    weekArray.push(`Week ${i}`);
  }
  return weekArray;
}

export function TotalNumberofWeekInMonth(year, month) {
  const weeks = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let currentWeek = [];
  let currentDate = new Date(firstDayOfMonth);

  while (currentDate <= lastDayOfMonth) {
    currentWeek.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);

    // Check if the current day is a Sunday (end of the week) or the last day of the month
    if (
      currentDate.getDay() === 0 ||
      currentDate.getTime() === lastDayOfMonth.getTime()
    ) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks;
}

function WeekGenerator(year, month) {
  const weeks = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let currentWeek = [];
  let currentDate = new Date(firstDayOfMonth);

  while (currentDate <= lastDayOfMonth) {
    currentWeek.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);

    // Check if the current day is a Sunday (end of the week) or the last day of the month
    if (
      currentDate.getDay() === 0 ||
      currentDate.getTime() === lastDayOfMonth.getTime()
    ) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks;
}

export function findWeekNumberForDay({ year, month, day }) {
  const weeks = WeekGenerator(year, month);

  for (let i = 0; i < weeks.length; i++) {
    for (let j = 0; j < weeks[i].length; j++) {
      if (weeks[i][j].getDate() === day) {
        return i + 1;
      }
    }
  }

  // capping of 100
  // showing of percentage increase or decrease
  // testing

  return -1; // Day not found in any week
}
