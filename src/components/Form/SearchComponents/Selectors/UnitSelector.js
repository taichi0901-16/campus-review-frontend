import { useState } from 'react';
import "../StyleSheets/UnitSelector.css";

function UnitSelector({ onUnitSelect, units = [1, 2, 3, 4] }) {
  const [selectedUnit, setSelectedUnit] = useState(null);

  const handleSelect = (unit) => {
    setSelectedUnit(unit);
    if (onUnitSelect) {
      onUnitSelect(unit);
    }
  };

  return (
    <div className="unit-options-wrapper">
      <div className="unit-header">
        単位数から探す
      </div>
      <div className="unit-options">
        {units.map((unit) => (
          <div
            key={unit}
            className={`unit-option${selectedUnit === String(unit) ? ' selected' : ''}`}
            onClick={() => handleSelect(String(unit))}
          >
            <span className="unit-option-text">{unit}単位</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UnitSelector;
