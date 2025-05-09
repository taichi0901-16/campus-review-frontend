import { useContext , useState , useEffect} from 'react';
import axios from 'axios';
import UserContext from '../../../../contexts/UserContext';
import "../FormStyleSheets/RegisterClassesForm.css"
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;

function RegisterClassesForm(){
    const navigate = useNavigate();
  
  const { currentUser } = useContext(UserContext);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isAddNewFaculty, setIsAddNewFaculty] = useState(false);
  const [isAddNewDepartment, setIsAddNewDepartment] = useState(false);
  const [isAddNewTeacher, setIsAddNewTeacher] = useState(false);
  const [factName, setFactName] = useState('');
  const [depName, setDepName] = useState('');
  const [teaName, setTeaName] = useState('');
  const [userDetails, setUserDetails] = useState(null); 
  const [teachers, setTeachers] = useState([]);

  
  useEffect(() => {
    if (!currentUser) return;
  
    setUserDetails(currentUser);
    setFormData((prev) => ({
      ...prev,
      university_id: currentUser.university_id
    }));
  
  }, [currentUser]);

  useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_URL}/teachers`);
      setTeachers(res.data);
    } catch (err) {
      console.error("教員情報の取得に失敗しました", err);

  };
}

  fetchTeachers()
} ,[currentUser]);

useEffect(() => {
const fetchFaculties = async () => {
  if(!faculties || faculties.length === 0){
  try {
    const res = await axios.get(`${API_URL}/faculties/${currentUser.university_id}`);
    setFaculties(res.data);
  } catch (err) {
    console.error("学部情報の取得に失敗しました", err);
  }
}
};
fetchFaculties()
}, [faculties,currentUser]);



  const [formData, setFormData] = useState({
    name: '',
    university_id:1,
    faculty_id: "",
    department_id: "",
    unit: 2,
    year_offered: 1,
    dotw: 1,
    period: 1,
    semester: 'first_half',
    required: 0,
    teacher_id: ""
  });

  

  const handleChange = async(e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFacultyChange = async (e) => {
    const faculty_id = e.target.value;
    setFormData({ ...formData,  [e.target.name] : faculty_id });
    if (faculty_id) {
      try {
        const res = await axios.get(`http://localhost:5000/departments/${faculty_id}`);
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
      const res = await axios.post('http://localhost:5000/registerclasses', formData);
      setMessage('登録成功！');
      setError('');
      setFormData({
        name: '',
        university_id:1,
        faculty_id: 1,
        department_id: 1,
        unit: 2,
        year_offered: 1,
        dotw: 1,
        period: 1,
        semester: 'first_half',
        required: 0,
        teacher_id: 1 
      });
      navigate('/post');

    } catch (err) {
      setError('登録に失敗しました。');
      console.log(err)
      setMessage('');
    }
  };


  const handleAddNewFaculty = () => {
    setIsAddNewFaculty(true);
  };

  const handleAddNewDepartment = () => {
    setIsAddNewDepartment(true);
  };

  const handleAddNewTeacher = async() => {
    setIsAddNewTeacher(true);
   
    //   try {
    //     const res = await axios.get(`http://localhost:5000/teachers`);
    //     setTeachers(res.data);
    //   } catch (err) {
    //     console.error("教員情報の取得に失敗しました", err);

    // };
  };

  const handleAddNewItem = async (type, value) => {
    let payload = { name: value };

    if (type === 'faculties') {
      payload.university_id = userDetails.university_id;
    } else if (type === 'departments') {
      if (!formData.faculty_id) {
        setError('学部を選択してください。');
        return;
      }
      payload.faculty_id = formData.faculty_id;
    }else if(type === "teachers"){
      payload.university_id = userDetails.university_id;
    }
    

  try {
    const res = await axios.post(`http://localhost:5000/register/${type}`, payload);
    if (type === 'faculties') {
      setFaculties([...faculties, res.data]);
    } else if (type === 'departments') {
      setDepartments([...departments, res.data]);
    } else if(type === 'teachers'){
      const teacherRes = await axios.get(`http://localhost:5000/teachers`);
      setTeachers(teacherRes.data);
    }
    setMessage(`追加成功！`);
    setError('');
  } catch (err) {
    setError(`追加に失敗しました。`);
    setMessage('');
    console.error(err);
  }
  };

  if (!currentUser) {
    return <p>ログインしていません。</p>;
  }

  // データがまだ取得されていない場合はローディングメッセージを表示
  if (!userDetails) {
    return <p>ユーザー情報を読み込み中...</p>;
  }

    return(
    
        <div className="register-classform-container">
   <h2 className="register-new-subject">授業を新規登録</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>

        <div className="subject-name-container">
          <label className="label-name">科目名: </label>
          <input className="subject-name-textarea"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      


        <div className="faculty-name-container">
          <label className="label-name">学部名: </label>
          <select
            name="faculty_id"
            value={formData.faculty_id}
            onChange={handleFacultyChange}
          >
            <option value="">選択してください</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
            ))}
          </select>
          <button className="button-btn" type="button" onClick={handleAddNewFaculty}>学部追加</button>
          {isAddNewFaculty && (
            <div>
               <input
        type="text"
        placeholder="新しい学部学部名"
        value={factName}
        onChange={(e) => setFactName(e.target.value)}
      />
      <button className="button-btn" type="button" onClick={() => handleAddNewItem('faculties', factName)}>
        追加
      </button>
      <button
      type="button"
      className="button-btn"
      onClick={() => setIsAddNewFaculty(false)}
    >
      閉じる
    </button>
            </div>
          )}
        </div>

        <div className="department-name-container">
          <label className="label-name">学科名: </label>
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
          <button className="button-btn" type="button" onClick={handleAddNewDepartment}>学科追加</button>
          {isAddNewDepartment && (
            <div>
             <input
        type="text"
        placeholder="新しい学科名"
        value={depName}
        onChange={(e) => setDepName(e.target.value)}
      />
      <button className="button-btn" type="button" onClick={() => handleAddNewItem('departments', depName)}>
        追加
      </button>
      <button
      type="button"
      className="button-btn"
      onClick={() => setIsAddNewDepartment(false)}
    >
      閉じる
    </button>
            </div>
          )}
        </div>


        <div className="teacher-name-container">
          <label className="label-name">教員名: </label>
          <select
            name="teacher_id"
            value={formData.teacher_id}
            onChange={handleChange}
          >
            <option value="" >選択してください</option>
            {Array.isArray(teachers) && userDetails?.university_id && teachers
            .filter((teacher) => teacher.university_id === userDetails.university_id) // フィルタリング
            .map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          <button className="button-btn" type="button" onClick={handleAddNewTeacher}>教員追加</button>
          {isAddNewTeacher && (
            <div>
             <input
        type="text"
        placeholder="新しい教員名"
        value={teaName}
        onChange={(e) => setTeaName(e.target.value)}
      />
      <button className="button-btn" type="button" onClick={() => handleAddNewItem('teachers', teaName)}>
        追加
      </button>
      <button 
      type="button"
      className="button-btn"
      onClick={() => setIsAddNewTeacher(false)}
    >
      閉じる
    </button>
            </div>
          )}
        </div>

        <div className="unit-container">
          <label className="label-name">単位数: </label>
          <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
            >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </div>

        <div className="year-container">
          <label className="label-name">履修年: </label>
          <select
                name="year_offered"
                value={formData.year_offered}
                onChange={handleChange}
            >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">M1</option>
                <option value="6">M2</option>
                <option value="7">D1</option>
                <option value="8">D2</option>
                <option value="9">D3</option>

            </select>
        </div>

        <div className="day-container">
          <label className="label-name">曜日: </label>
          <select
                name="dotw"
                value={formData.dotw}
                onChange={handleChange}
            >
                <option value="1">月</option>
                <option value="2">火</option>
                <option value="3">水</option>
                <option value="4">木</option>
                <option value="5">金</option>
                <option value="6">土</option>
                <option value="7">日</option>

            </select>
        </div>

        <div className="period-container"> 
          <label className="label-name">時限: </label>
          <select
                name="period"
                value={formData.period}
                onChange={handleChange}
            >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>

            </select>
        </div>
        <div className="term-container">
        <label className="label-name">期: </label>
            <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
            >
                <option value="first_half">前期</option>
                <option value="first_half_first">前前期</option>
                <option value="first_half_secound">前後期</option>
                <option value="second_half">後期</option>
                <option value="second_half_first">後前期</option>
                <option value="second_half_second">後後期</option>
                <option value="round">通年</option>
                <option value="con">集中</option>
            </select>
        </div>
        <div className="required-container">
          <label className="label-name">必須or選択: </label>
          <select
                name="required"
                value={formData.required}
                onChange={handleChange}
            >
                <option value="0">選択</option>
                <option value="1">必修</option>
            </select>
        </div>


      

        <button className="button-btn register" type="submit">登録</button>
      </form>
    </div>
    )

}

export default RegisterClassesForm