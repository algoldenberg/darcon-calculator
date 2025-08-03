import '../css/resultBlock.css';

function ResultBlock({ result }) {
  if (!result) return null;

  return (
    <div className="result-block">
      <h2>Результат расчёта</h2>

      <p>
        <strong>С момента репатриации:</strong> {result.totalMonthsSinceAliyah.toFixed(1)} месяцев
      </p>
      <p>
        <strong>Проведено в Израиле:</strong> {result.monthsInIsrael.toFixed(1)} месяцев (
        {result.percentageInIsrael.toFixed(1)}%)
      </p>

      {result.remainingAbroadMonthsForFive !== null && (
        <p>
          <strong>Максимально можно провести за границей (для 5-летнего даркона):</strong>{' '}
          {result.remainingAbroadMonthsForFive.toFixed(1)} месяцев
        </p>
      )}

      {result.remainingAbroadMonthsForTen !== null && (
        <p>
          <strong>Максимально можно провести за границей ещё (для 10-летнего даркона):</strong>{' '}
          {result.remainingAbroadMonthsForTen.toFixed(1)} месяцев
        </p>
      )}

      {!result.eligibleForFive && (
        <p>
          <strong>Осталось до 5-летнего даркона:</strong>{' '}
          {result.monthsUntilFive.toFixed(1)} месяцев (ориентировочно с {result.fiveYearDate})
        </p>
      )}
      {!result.eligibleForTen && (
        <p>
          <strong>Осталось до 10-летнего даркона:</strong>{' '}
          {result.monthsUntilTen.toFixed(1)} месяцев (ориентировочно с {result.tenYearDate})
        </p>
      )}

      <p>
        <strong>Вывод:</strong> {result.message}
      </p>
    </div>
  );
}

export default ResultBlock;
