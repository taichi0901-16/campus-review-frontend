import  { useState , useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import "../FormStyleSheets/RegisterForm.css"
const API_URL = process.env.REACT_APP_API_URL;

function RegisterForm() {
      const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    university_id: '',
    faculty_id: '',
    department_id: '',
    grade_year: '',
  });

  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isAddNewUniversity, setIsAddNewUniversity] = useState(false);
  const [isAddNewFaculty, setIsAddNewFaculty] = useState(false);
  const [isAddNewDepartment, setIsAddNewDepartment] = useState(false);
  const [univName, setUnivName] = useState('');
  const [factName, setFactName] = useState('');
  const [depName, setDepName] = useState('');

  const [formError, setFormError] = useState('');
  const [formMessage, setFormMessage] = useState('');

// 大学・学部・学科追加用
const [addError, setAddError] = useState('');
const [addMessage, setAddMessage] = useState('');

  useEffect(() => {
    // 大学リストの取得
    axios.get(`${API_URL}/universities`)
      .then(res => setUniversities(res.data))
      .catch(err => console.log(err));
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleUniversityChange = async (e) => {
    const university_id = e.target.value;
    setFormData({ ...formData, [e.target.name] : university_id });
    if (university_id) {
      try {
        const res = await axios.get(`${API_URL}/faculties/${university_id}`);
        setFaculties(res.data);
        setDepartments([]); // 学部変更時に学科をリセット
      } catch (err) {
        console.error(err);
      }
    } else {
      setFaculties([]);
      setDepartments([]);
    }
  };

  const handleFacultyChange = async (e) => {
    const faculty_id = e.target.value;
    setFormData({ ...formData,  [e.target.name] : faculty_id });
    if (faculty_id) {
      try {
        const res = await axios.get(`${API_URL}/departments/${faculty_id}`);
        setDepartments(res.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setDepartments([]);
    }
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/register`, formData);
    setFormMessage('登録成功！');
    setFormError('');
    setAddMessage('');
    setAddError('');
      setFormData({
        username: '',
        email: '',
        password: '',
        university_id: '',
        faculty_id: '',
        department_id: '',
        grade_year: '',
      });
      navigate('/login');

    } catch (err) {
      setFormError('登録に失敗しました。');
    setFormMessage('');
    }
  };

  const handleAddNewUniversity = () => {
    setIsAddNewUniversity(true);
  };

  const handleAddNewFaculty = () => {
    setIsAddNewFaculty(true);
  };

  const handleAddNewDepartment = () => {
    setIsAddNewDepartment(true);
  };

const handleAddNewItem = async (type, value) => {
  let payload = { name: value };

  if (type === 'faculties') {
    if (!formData.university_id) {
      setAddError('大学を選択してください。');
      return;
    }
    payload.university_id = formData.university_id;
  } else if (type === 'departments') {
    if (!formData.faculty_id) {
      setAddError('学部を選択してください。');
      return;
    }
    payload.faculty_id = formData.faculty_id;
  }

  try {
    const res = await axios.post(`${API_URL}/register/${type}`, payload);

    if (type === 'universities') {
      setUniversities([...universities, res.data]);
      setFormData({ ...formData, university_id: res.data.id });
      setUnivName('');
    } else if (type === 'faculties') {
      setFaculties([...faculties, res.data]);
      setFormData({ ...formData, faculty_id: res.data.id });
      setFactName('');
    } else if (type === 'departments') {
      setDepartments([...departments, res.data]);
      setFormData({ ...formData, department_id: res.data.id });
      setDepName('');
    }

    setAddMessage('追加成功');
    setAddError('');
  } catch (err) {
    if (err.response && err.response.status === 409) {
      setAddError(err.response.data.message);
    } else {
      setAddError('追加に失敗しました。');
      console.error(err);
    }
    setAddMessage('');
  }
};

  return (
    <div className="register-container">
    <h2>新規会員登録</h2>

    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>ユーザー名: </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
  
      <div className="form-group">
        <label>メールアドレス: </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
  
      <div className="form-group">
        <label>パスワード: </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
  

      <div className="form-group">
        <label>大学名: </label>
        <select
          name="university_id"
          value={formData.university_id}
          onChange={handleUniversityChange}
        >
          <option value="">選択してください</option>
          {universities.map((univ) => (
            <option key={univ.id} value={univ.id}>{univ.name}</option>
          ))}
        </select>
        <button type="button" onClick={handleAddNewUniversity}>大学追加</button>
  
        {isAddNewUniversity && (
          <div className="add-section">
            <input
              type="text"
              placeholder="新しい大学名"
              value={univName}
              onChange={(e) => setUnivName(e.target.value)}
            />

            {addError && <p style={{ color: 'red' }}>{addError}</p>}
            {addMessage && <p style={{ color: 'green' }}>{addMessage}</p>}


            <button type="button" onClick={() => handleAddNewItem('universities', univName)}>
              追加
            </button>
            <button
      type="button"
      className="close-button"
      onClick={() => setIsAddNewUniversity(false)}
    >
      閉じる
    </button>
          </div>
        )}
      </div>


      <div className="form-group">
        <label>学部名: </label>
        <select
          name="faculty_id"
          value={formData.faculty_id}
          onChange={handleFacultyChange}
          disabled={!formData.university_id}
        >
          <option value="">選択してください</option>
          {faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
          ))}
        </select>
        <button type="button" onClick={handleAddNewFaculty}>学部追加</button>
  
        {isAddNewFaculty && (
          <div className="add-section">
            <input
              type="text"
              placeholder="新しい学部名"
              value={factName}
              onChange={(e) => setFactName(e.target.value)}
            />



            {addError && <p style={{ color: 'red' }}>{addError}</p>}
            {addMessage && <p style={{ color: 'green' }}>{addMessage}</p>}

            <button type="button" onClick={() => handleAddNewItem('faculties', factName)}>
              追加
            </button>
            <button
      type="button"
      className="close-button"
      onClick={() =>setIsAddNewFaculty(false)}
    >
      閉じる
    </button>
          </div>
        )}
      </div>


      <div className="form-group">
        <label>学科名: </label>
        <select
          name="department_id"
          value={formData.department_id}
          onChange={handleChange}
          disabled={!formData.faculty_id}
        >
          <option value="">選択してください</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        <button type="button" onClick={handleAddNewDepartment}>学科追加</button>
  
        {isAddNewDepartment && (
          <div className="add-section">
            <input
              type="text"
              placeholder="新しい学科名"
              value={depName}
              onChange={(e) => setDepName(e.target.value)}
            />

            {addError && <p style={{ color: 'red' }}>{addError}</p>}
            {addMessage && <p style={{ color: 'green' }}>{addMessage}</p>}

            <button type="button" onClick={() => handleAddNewItem('departments', depName)}>
              追加
            </button>
            <button
      type="button"
      className="close-button"
      onClick={() => setIsAddNewDepartment(false)}
    >
      閉じる
    </button>
          </div>
        )}
      </div>
  
      <div className="form-group">
  <label>学年: </label>
  <select
    name="grade_year"
    value={formData.grade_year}
    onChange={handleChange}
    required
  >
    <option value="">選択してください</option>
    <option value="1">1年</option>
    <option value="2">2年</option>
    <option value="3">3年</option>
    <option value="4">4年</option>
    <option value="5">修士1年(M1)</option>
    <option value="6">修士2年(M2)</option>
    <option value="7">博士1年(D1)</option>
    <option value="8">博士2年(D2)</option>
    <option value="9">博士3年(D3)</option>

  </select>
</div>
{formError && <p style={{ color: 'red' }}>{formError}</p>}
{formMessage && <p style={{ color: 'green' }}>{formMessage}</p>}

  
      <button className="register-button" type="submit">登録</button>
    </form>
  </div>
  
  );
}

export default RegisterForm;
