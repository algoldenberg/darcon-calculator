import '../css/resultBlock.css';

function ResultBlock({ result }) {
  if (!result) {
    return (
      <div className="result-block">
        <h2>Результат расчёта</h2>
        <p>После заполнения формы здесь появится информация о вашем праве на получение 5 или 10-летнего даркона.</p>
      </div>
    );
  }

  return (
    <div className="result-block">
      <h2>Результат расчёта</h2>
      <p><strong>С момента репатриации:</strong> {result.totalMonthsSinceAliyah.toFixed(1)} месяцев</p>
      <p><strong>Проведено в Израиле:</strong> {result.monthsInIsrael.toFixed(1)} месяцев ({result.percentageInIsrael.toFixed(1)}%)</p>
      <p><strong>Вывод:</strong> {result.message}</p>
    </div>
  );
}

export default ResultBlock;
