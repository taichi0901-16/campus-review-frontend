import  { useEffect, useState } from 'react';
import axios from 'axios';
import "../StyleSheets/FacultyDepartmentSelector.css"
function FacultyDepartmentSelector({ universityId, onDepartmentSelect }) {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!universityId) return;

    axios
      .get(`${API_URL}/faculties/${universityId}`)
      .then((res) => setFaculties(res.data))
      .catch((err) => console.log(err));
  }, [universityId]);

  const handleFacultyChange = (e) => {
    const facultyId = e.target.value;
    setSelectedFaculty(facultyId);
    setSelectedDepartment('');
    if (facultyId) {
      axios
        .get(`${API_URL}/departments/${facultyId}`)
        .then((res) => setDepartments(res.data))
        .catch((err) => console.log(err));
    } else {
      setDepartments([]);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    if (onDepartmentSelect) {
      onDepartmentSelect(departmentId);
    }
  };

  return (
    <div className="department-selector-container">
        <div className="selector-header">
        学部学科から探す
      </div>
      <div className="department-selector">
        <label htmlFor="faculty">学部:</label>
        <select id="faculty" value={selectedFaculty} onChange={handleFacultyChange}>
          <option value="">選択してください</option>
          {faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name}
            </option>
          ))}
        </select>
      </div>

      {/* 学科選択肢を最初から表示、選択できない状態に */}
      <div className="department-selector">
        <label htmlFor="department">学科:</label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          disabled={!selectedFaculty}  
        >
          <option value="">選択してください</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FacultyDepartmentSelector;
