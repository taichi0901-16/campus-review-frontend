import { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from "../../../contexts/UserContext";
import "../MyPage-StyleSheets/UserUpdate.css"
const API_URL = process.env.REACT_APP_API_URL;

function UserUpdate() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [isAddNewUniversity, setIsAddNewUniversity] = useState(false);
  const [isAddNewFaculty, setIsAddNewFaculty] = useState(false);
  const [isAddNewDepartment, setIsAddNewDepartment] = useState(false);
  const [univName, setUnivName] = useState('');
  const [factName, setFactName] = useState('');
  const [depName, setDepName] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      university_id: '',
      faculty_id: '',
      department_id: '',
      grade_year: '',
    },
  });

  useEffect(() => {
    axios.get(`${API_URL}/universities`)
      .then(res => setUniversities(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (currentUser) {
      setUserDetails(currentUser);
      setValue("username", currentUser.username);
      setValue("email", currentUser.email);
      setValue("university_id", currentUser.university_id);
      setValue("faculty_id", currentUser.faculty_id);
      setValue("department_id", currentUser.department_id);
      setValue("grade_year", currentUser.grade_year);

      if (currentUser.university_id) {
        axios.get(`${API_URL}/faculties/${currentUser.university_id}`)
          .then(res => setFaculties(res.data));
      }

      if (currentUser.faculty_id) {
        axios.get(`${API_URL}/departments/${currentUser.faculty_id}`)
          .then(res => setDepartments(res.data));
      }
    }
  }, [currentUser]);

  const handleUniversityChange = async (e) => {
    const university_id = e.target.value;
    setValue("university_id", university_id);
    setValue("faculty_id", '');
    setValue("department_id", '');
    setFaculties([]);
    setDepartments([]);

    if (university_id) {
      try {
        const res = await axios.get(`${API_URL}/faculties/${university_id}`);
        setFaculties(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFacultyChange = async (e) => {
    const faculty_id = e.target.value;
    setValue("faculty_id", faculty_id);
    setValue("department_id", '');
    setDepartments([]);

    if (faculty_id) {
      try {
        const res = await axios.get(`${API_URL}/departments/${faculty_id}`);
        setDepartments(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(
        `${API_URL}/user_update/${userDetails.id}`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setCurrentUser(response.data);
      setMessage('更新成功！');
      setError('');
      navigate('/mypage');
    } catch (err) {
      console.error(err);
      setError('更新に失敗しました。');
      setMessage('');
    }
  };

  const handleAddNewItem = async (type, value) => {
    let payload = { name: value };
    if (type === 'faculties') {
      const university_id = getValues("university_id");
      if (!university_id) {
        setError('大学を選択してください。');
        return;
      }
      payload.university_id = university_id;
    } else if (type === 'departments') {
      const faculty_id = getValues("faculty_id");
      if (!faculty_id) {
        setError('学部を選択してください。');
        return;
      }
      payload.faculty_id = faculty_id;
    }

    try {
      const res = await axios.post(`${API_URL}/register/${type}`, payload);
      if (type === 'universities') setUniversities(prev => [...prev, res.data]);
      if (type === 'faculties') setFaculties(prev => [...prev, res.data]);
      if (type === 'departments') setDepartments(prev => [...prev, res.data]);
      setMessage(`${type.slice(0, -1)}追加成功！`);
      setError('');
    } catch (err) {
      setError(`${type.slice(0, -1)}追加に失敗しました。`);
      setMessage('');
      console.error(err);
    }
  };

  if (!currentUser) return <p>ログインしていません。</p>;
  if (!userDetails) return <p>ユーザー情報を読み込み中...</p>;

  return (
    <div className="update-container">
      <h2>ユーザー情報の編集</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>ユーザー名:</label>
          <Controller name="username" control={control} render={({ field }) => <input {...field} />} />
        </div>
        <div className="form-group">
          <label>メールアドレス:</label>
          <Controller name="email" control={control} render={({ field }) => <input {...field} />} />
        </div>

        <div className="form-group">
          <label>大学名:</label>
          <Controller
            name="university_id"
            control={control}
            render={({ field }) => (
              <select {...field} onChange={handleUniversityChange}>
                <option value="">選択してください</option>
                {universities.map((univ) => (
                  <option key={univ.id} value={univ.id}>{univ.name}</option>
                ))}
              </select>
            )}
          />
          <button type="button" onClick={() => setIsAddNewUniversity(true)}>大学追加</button>
          {isAddNewUniversity && (
            <div className="add-section">
              <input type="text" value={univName} onChange={(e) => setUnivName(e.target.value)} placeholder="新しい大学名" />
              <button type="button" onClick={() => handleAddNewItem('universities', univName)}>追加</button>
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
          <label>学部名:</label>
          <Controller
            name="faculty_id"
            control={control}
            render={({ field }) => (
              <select {...field} onChange={handleFacultyChange} disabled={!getValues("university_id")}>
                <option value="">選択してください</option>
                {faculties.map((fact) => (
                  <option key={fact.id} value={fact.id}>{fact.name}</option>
                ))}
              </select>
            )}
          />
          <button type="button" onClick={() => setIsAddNewFaculty(true)}>学部追加</button>
          {isAddNewFaculty && (
            <div className="add-section">
              <input type="text" value={factName} onChange={(e) => setFactName(e.target.value)} placeholder="新しい学部名" />
              <button type="button" onClick={() => handleAddNewItem('faculties', factName)}>追加</button>
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
          <label>学科名:</label>
          <Controller
            name="department_id"
            control={control}
            render={({ field }) => (
              <select {...field} disabled={!getValues("faculty_id")}>
                <option value="">選択してください</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>{dep.name}</option>
                ))}
              </select>
            )}
          />
          <button type="button" onClick={() => setIsAddNewDepartment(true)}>学科追加</button>
          {isAddNewDepartment && (
            <div className="add-section">
              <input type="text" value={depName} onChange={(e) => setDepName(e.target.value)} placeholder="新しい学科名" />
              <button type="button" onClick={() => handleAddNewItem('departments', depName)}>追加</button>
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
        <label>学年:</label>
        <Controller
          name="grade_year"
          control={control}
          render={({ field }) => (
            <select {...field}>
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
          )}
        />
      </div>



        <button className="update-button" type="submit">更新</button>
      </form>
    </div>
  );
}

export default UserUpdate;
