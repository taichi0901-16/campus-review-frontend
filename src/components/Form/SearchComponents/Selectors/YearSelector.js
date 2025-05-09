import '../StyleSheets/SearchOffered_year.css';  // CSSファイルをインポート

function YearSelector({ value, onChange }) {
  return (
    <div className="year-selector-container">
      {/* 開講年から探すのヘッダー */}
      <div className="year-selector-header">
        開講年から探す
      </div>

      {/* 年選択のオプション */}
      <div className="year-options">
        {[1, 2, 3, 4].map((year) => (
          <div
            key={year}
            className={`year-option ${String(value) === String(year) ? 'selected' : ''}`}
            onClick={() => onChange({ target: { value: year } })}
          >
            <span>{year}年</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YearSelector;
