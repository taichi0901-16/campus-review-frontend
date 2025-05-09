import '../StyleSheets/PeriodSelector.css'; // CSSファイルをインポート

function PeriodSelector({ value, onChange }) {
  const periods = [...Array(10)].map((_, i) => i + 1);
  const firstRow = periods.slice(0, 5);
  const secondRow = periods.slice(5, 10);

  const renderRow = (row) => (
    <div className="period-row">
      {row.map((period) => (
        <div
          key={period}
          className={`period-option ${String(value) === String(period) ? 'selected' : ''}`}
          onClick={() => onChange({ target: { value: period } })}
        >
          <span>{period}限</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="period-selector-container">
      <div className="period-selector-header">時限から探す</div>
      {renderRow(firstRow)}
      {renderRow(secondRow)}
    </div>
  );
}

export default PeriodSelector;
