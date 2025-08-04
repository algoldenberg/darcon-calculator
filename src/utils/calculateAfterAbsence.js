import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export function calculateAfterAbsence(
  returnDateString,
  hadFiveYearDarcon = false,
  trips = [],
  darcon5DateString = null
) {
  if (!returnDateString) return null;

  const now = dayjs();
  const returnDate = dayjs(returnDateString);

  const baseDate = returnDate;
  const totalDays = now.diff(baseDate, 'day');
  const totalMonths = now.diff(baseDate, 'month', true);

  let abroadDays = 0;
  (Array.isArray(trips) ? trips : []).forEach(({ from, to }) => {
    const fromDate = dayjs(from);
    const toDate = dayjs(to);

    if (!fromDate.isValid() || !toDate.isValid()) return;
    if (toDate.isBefore(baseDate)) return;

    if (fromDate.isBefore(baseDate)) {
      abroadDays += toDate.diff(baseDate, 'day');
    } else {
      abroadDays += toDate.diff(fromDate, 'day');
    }
  });

  const daysInIsrael = totalDays - abroadDays;
  const monthsInIsrael = daysInIsrael / 30.44;
  const percentageInIsrael = totalDays > 0 ? (daysInIsrael / totalDays) * 100 : 0;

  const fiveYearDate = baseDate.add(1, 'year').format('DD.MM.YYYY');
  const tenYearDate = baseDate.add(5, 'year').format('DD.MM.YYYY');

  const monthsUntilFive = Math.max(0, 12 - totalMonths);
  const monthsUntilTen = Math.max(0, 60 - totalMonths);

  const abroadMonths = abroadDays / 30.44;

  const maxAbroadMonthsForFive = 12 * 0.25; // = 3.0 мес
  const maxAbroadMonthsForTen = 60 * 0.40;  // = 24.0 мес
  

  const remainingAbroadForFive = Math.max(0, maxAbroadMonthsForFive - abroadMonths);
  const remainingAbroadForTen = Math.max(0, maxAbroadMonthsForTen - abroadMonths);

  let eligibleForFive = false;
  let eligibleForTen = false;
  const messageParts = [];

  if (hadFiveYearDarcon) {
    eligibleForTen = totalMonths >= 60 && percentageInIsrael >= 60;

    if (eligibleForTen) {
      messageParts.push('✅ Вы имеете право на 10-летний даркон.');
    } else {
      messageParts.push(
        `❌ Недостаточно времени в Израиле — можно подать только на 5-летний даркон с ${returnDate.format('DD.MM.YYYY')}.`
      );
    }
  } else {
    eligibleForFive = totalMonths >= 12 && percentageInIsrael >= 75;

    if (eligibleForFive) {
      messageParts.push('✅ Вы имеете право на 5-летний даркон.');
    } else if (totalMonths < 12) {
      messageParts.push(
        '⏳ С момента возвращения прошло меньше года. Пока можно получить только временный паспорт (Teudat Ma’avar).'
      );
    } else {
      messageParts.push(
        '❌ Вы пока не соответствуете требованиям. Возможно, вы провели слишком много времени за границей.'
      );
    }
  }

  return {
    totalMonthsSinceBaseDate: Number(totalMonths.toFixed(1)),
    monthsInIsrael: Number(monthsInIsrael.toFixed(1)),
    percentageInIsrael: Number(percentageInIsrael.toFixed(1)),
    eligibleForFive,
    eligibleForTen,
    monthsUntilFive: Number(monthsUntilFive.toFixed(1)),
    monthsUntilTen: Number(monthsUntilTen.toFixed(1)),
    fiveYearDate,
    tenYearDate,
    maxAbroadMonthsForFive: Number(maxAbroadMonthsForFive.toFixed(1)),
    maxAbroadMonthsForTen: Number(maxAbroadMonthsForTen.toFixed(1)),
    remainingAbroadForFive: Number(remainingAbroadForFive.toFixed(1)),
    remainingAbroadForTen: Number(remainingAbroadForTen.toFixed(1)),
    abroadMonths: Number(abroadMonths.toFixed(1)),
    message: messageParts.join(' ')
  };
}
