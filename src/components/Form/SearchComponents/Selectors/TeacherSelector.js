import '../StyleSheets/TeacherSelector.css'; // CSSファイルをインポート

function TeacherSelector({ teachers, onTeacherSelect, universityId }) {
  const handleChange = (event) => {
    const teacherId = event.target.value;
    if (onTeacherSelect) {
      onTeacherSelect(teacherId);
    }
  };

  return (
    <div className="teacher-selector-container">
      <div className="teacher-selector-header">
        教員から探す
      </div>

      <div className="teacher-select-box">
        <select className="teacher-select" onChange={handleChange}>
          <option value="">選択してください</option>
          {Array.isArray(teachers) &&
            teachers
              .filter((teacher) => teacher.university_id === universityId)
              .map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
        </select>
      </div>
    </div>
  );
}

export default TeacherSelector;
