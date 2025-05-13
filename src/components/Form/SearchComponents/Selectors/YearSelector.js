import '../StyleSheets/SearchOffered_year.css';  // CSSファイルをインポート

function YearSelector({ value, onChange }) {
  // 表示と内部値のマッピング
  const yearLabels = {
    1: '1年',
    2: '2年',
    3: '3年',
    4: '4年',
    5: 'M1',
    6: 'M2',
    7: 'D1',
    8: 'D2',
    9: 'D3',
  };

  return (
    <div className="year-selector-container">
      {/* 開講年から探すのヘッダー */}
      <div className="year-selector-header">
        開講年から探す
      </div>

      {/* 年選択のオプション */}
      <div className="year-options">
        {Object.entries(yearLabels).map(([yearValue, label]) => (
          <div
            key={yearValue}
            className={`year-option ${String(value) === yearValue ? 'selected' : ''}`}
            onClick={() => onChange({ target: { value: Number(yearValue) } })}
          >
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YearSelector;
