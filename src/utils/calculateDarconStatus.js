import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export function calculateDarconStatus(aliyahDateString, trips = []) {
  if (!aliyahDateString) return null;

  const aliyahDate = dayjs(aliyahDateString);
  const now = dayjs();

  const totalDays = now.diff(aliyahDate, 'day');
  const totalMonths = now.diff(aliyahDate, 'month', true);

  let abroadDays = 0;

  trips.forEach(({ from, to }) => {
    const fromDate = dayjs(from);
    const toDate = dayjs(to);
    if (fromDate.isValid() && toDate.isValid() && toDate.isAfter(fromDate)) {
      abroadDays += toDate.diff(fromDate, 'day');
    }
  });

  const daysInIsrael = totalDays - abroadDays;
  const monthsInIsrael = daysInIsrael / 30.44;
  const percentageInIsrael = (daysInIsrael / totalDays) * 100;

  const eligibleForFive = totalMonths >= 12 && percentageInIsrael >= 60;
  const eligibleForTen = totalMonths >= 60 && monthsInIsrael >= 36;

  const monthsUntilFive = Math.max(0, 12 - totalMonths);
  const monthsUntilTen = Math.max(0, 60 - totalMonths);
  const fiveYearDate = aliyahDate.add(1, 'year').format('DD.MM.YYYY');
  const tenYearDate = aliyahDate.add(5, 'year').format('DD.MM.YYYY');

  let message = '';
  if (eligibleForTen) {
    message = 'Вы имеете право на 10-летний даркон.';
  } else if (eligibleForFive) {
    message = 'Вы имеете право на 5-летний даркон.';
  } else if (totalMonths < 12) {
    message = 'С момента репатриации прошло меньше года. Пока можно получить только Teudat Ma’avar.';
  } else {
    message = 'Вы пока не соответствуете требованиям. Возможно, вы провели слишком много времени за границей.';
  }

  return {
    totalMonthsSinceAliyah: Number(totalMonths.toFixed(1)),
    monthsInIsrael: Number(monthsInIsrael.toFixed(1)),
    percentageInIsrael: Number(percentageInIsrael.toFixed(1)),
    eligibleForFive,
    eligibleForTen,
    monthsUntilFive: Number(monthsUntilFive.toFixed(1)),
    monthsUntilTen: Number(monthsUntilTen.toFixed(1)),
    fiveYearDate,
    tenYearDate,
    message
  };
}
