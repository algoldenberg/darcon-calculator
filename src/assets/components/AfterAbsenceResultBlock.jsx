import '../css/resultBlock.css';

function AfterAbsenceResultBlock({ result }) {
  if (!result) return null;

  const safeFixed = (value, digits = 1) =>
    typeof value === 'number' ? value.toFixed(digits) : '-';

  return (
    <div className="result-block">
      <h2>Результат расчёта</h2>

      <p>
        <strong>С момента возврата:</strong>{' '}
        {safeFixed(result.totalMonthsSinceBaseDate)} месяцев
      </p>

      <p>
        <strong>Проведено в Израиле:</strong> {safeFixed(result.monthsInIsrael)} месяцев (
        {safeFixed(result.percentageInIsrael)}%)
      </p>

      {!result.eligibleForFive && (
        <p>
          <strong>Осталось до 5-летнего даркона:</strong>{' '}
          {safeFixed(result.monthsUntilFive)} месяцев (ориентировочно с {result.fiveYearDate})
        </p>
      )}

      {!result.eligibleForTen && result.monthsUntilTen > 0 && (
        <p>
          <strong>Осталось до 10-летнего даркона:</strong>{' '}
          {safeFixed(result.monthsUntilTen)} месяцев (ориентировочно с {result.tenYearDate})
        </p>
      )}

      <p>
        <strong>Допустимо за границей:</strong><br />
        – до 5-летнего: {safeFixed(result.maxAbroadMonthsForFive)} мес.<br />
        – до 10-летнего: {safeFixed(result.maxAbroadMonthsForTen)} мес.
      </p>

      <p>
        <strong>Проведено за границей:</strong> {safeFixed(result.abroadMonths)} мес.
      </p>

      <p>
        <strong>Можно ещё выехать:</strong><br />
        – для 5-летнего: {safeFixed(result.remainingAbroadForFive)} мес.<br />
        – для 10-летнего: {safeFixed(result.remainingAbroadForTen)} мес.
      </p>

      <p>
        <strong>Вывод:</strong> {result.message}
      </p>
    </div>
  );
}

export default AfterAbsenceResultBlock;
