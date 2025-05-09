import { useState } from 'react';
import "../StyleSheets/TermSelector.css";

function TermSelector({ onTermSelect, terms = [
  { label: "前期", value: "first_half" },
  { label: "前・前期", value: "first_half_first" },
  { label: "前・後期", value: "first_half_secound" },
  { label: "後期", value: "second_half" },
  { label: "後・前期", value: "second_half_first" },
  { label: "後・後期", value: "second_half_second" },
  { label: "通年", value: "round" },
  { label: "集中", value: "con" },
] }) {
  const [selectedTerm, setSelectedTerm] = useState(null);

  const handleSelect = (value) => {
    setSelectedTerm(value);
    if (onTermSelect) {
      onTermSelect(value);
    }
  };

  return (
    <div className="term-options-wrapper">
      <div className="term-header">
        期から探す
      </div>
      <div className="term-options">
        {terms.map(term => (
          <div
            key={term.value}
            className={`term-option${selectedTerm === term.value ? ' selected' : ''}`}
            onClick={() => handleSelect(term.value)}
          >
            <span className="term-option-text">{term.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TermSelector;
