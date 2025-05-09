import { useState } from 'react';
import '../StyleSheets/DaySelector.css'; // CSSファイルをインポート

function DaySelector({ onDaySelect, days = [
  { label: "月", value: "1" },
  { label: "火", value: "2" },
  { label: "水", value: "3" },
  { label: "木", value: "4" },
  { label: "金", value: "5" },
  { label: "土", value: "6" },
  { label: "日", value: "7" },
] }) {

  const [selectedDay, setSelectedDay] = useState(null);

  const handleClick = (value) => {
    setSelectedDay(value);
    if (onDaySelect) {
      onDaySelect(value);
    }
  };

  return (
    <div className="day-selector-container">
      <div className="day-selector-header">
        曜日から探す
      </div>

      <div className="day-options">
        {days.map(day => (
          <div
            key={day.value}
            className={`day-option ${selectedDay === day.value ? 'selected' : ''}`}
            onClick={() => handleClick(day.value)}
          >
            {day.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DaySelector;
