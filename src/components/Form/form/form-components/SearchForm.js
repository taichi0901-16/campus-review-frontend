import  { useContext, useEffect , useState} from 'react';
import CoursesContext from '../../../../contexts/CourseContext'; // パス注意！
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { features, class_styles, evaluation_methods, requirements, tags, teacher_style, material_provision } from '../../../../requirements/Requirements';
import YearSelector from '../../SearchComponents/Selectors/YearSelector';
import FacultyDepartmentSelector from '../../SearchComponents/Selectors/FacultyDepartmentSelector';
import UnitSelector from '../../SearchComponents/Selectors/UnitSelector';
import TermSelector from '../../SearchComponents/Selectors/TermSelector';
import DaySelector from '../../SearchComponents/Selectors/DaySelector';
import PeriodSelector from '../../SearchComponents/Selectors/PeriodSelector';
import TeacherSelector from '../../SearchComponents/Selectors/TeacherSelector';
import UserContext from '../../../../contexts/UserContext';
import TeachersContext from '../../../../contexts/TeacherContext';
import axios from 'axios';
import  "../FormStyleSheets/searchform.css"
const API_URL = process.env.REACT_APP_API_URL;

function SearchForm(){
  const { currentUser } = useContext(UserContext);
    const { courses } = useContext(CoursesContext); // ← ここ重要
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [coursesDetails, setCoursesDetails] = useState([]);
    const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const { teachers, setTeachers } = useContext(TeachersContext); // ← ここ重要
  const [teacherDetails, setTeacherDetails] = useState([]);
  
    
    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
          defaultValues: {
            course_id: '',
            freeword: "",
            openYear: "",
            university_id:"",
            department_id:"",
            unit:"",
            day:"",
            term:"",
            period:"",
            teacher:"",
            feature_ids: [],
            class_style_ids: [],
            evaluation_method_ids: [],
            requirement_ids: [],
            teacher_style_ids: [],
            material_provision_ids: [],
            tag_ids: []
          }
        });

        useEffect(() => {
          setUserDetails(currentUser);
          setTeacherDetails(teachers);
          if (currentUser?.university_id) {
            setValue("university_id", currentUser.university_id);
          }
          if (!teachers || teachers.length === 0) {
            const fetchTeachers = async () => {
              try {
                const res = await axios.get(`${API_URL}/teachers`);
                setTeachers(res.data); // Context
                setTeacherDetails(res.data); // Local state
              } catch (err) {
                console.error("教員情報の取得に失敗しました", err);
              }
            };
            fetchTeachers();
          }
        }, [teachers, setTeachers,currentUser]);
        const onSubmit = async (data) => {
            try {
              const res = await axios.post(`${API_URL}/search`, data);
              setMessage('登録成功！');
              setError('');
              if (res.status === 201) {
                console.log("検索結果",res.data)
                navigate("/search_result" , { state: { searchResults: res.data } });

              }
            } catch (err) {
              setError('登録に失敗しました。');
              setMessage('');
            }
          };
    
        const handleCheckboxChange = (name, value) => {
          console.log(userDetails.university_id)
            const currentValue = watch(name);
            const newValue = currentValue.includes(value)
              ? currentValue.filter((item) => item !== value)
              : [...currentValue, value];
            setValue(name, newValue);
          };
        
        useEffect(() => {
            const fetchCourses = async () => {
              try {
                const response = await fetch(`${API_URL}/courses`);
                const data = await response.json();
                setCoursesDetails(data);
              } catch (error) {
                console.error("授業情報の取得に失敗しました", error);
              }
            };
            fetchCourses();
          }, []);

          const filteredTeachers = Array.isArray(teacherDetails)
  ? teacherDetails.filter(t => t.university_id === userDetails?.university_id)
  : [];

          if (!currentUser) {
            navigate('/login');
          }
        
          // データがまだ取得されていない場合はローディングメッセージを表示
          if (!userDetails) {
            return <p>ユーザー情報を読み込み中...</p>;
          }


          if (!courses) {
            return <p>ログインしていません。</p>;
          }
        
          // データがまだ取得されていない場合はローディングメッセージを表示
          if (!coursesDetails) {
            return <p>ユーザー情報を読み込み中...</p>;
          }
        
          if (!teachers) {
            return <p>ログインしていません。</p>;
          }
        
          // データがまだ取得されていない場合はローディングメッセージを表示
          if (!teacherDetails) {
            return <p>ユーザー情報を読み込み中...</p>;
          }
        
          return (
            
            <div className="searchform-container">
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="freeword-container">
  <label htmlFor="freeword">フリーワードを入力:</label>
  <Controller
    name="freeword"
    control={control}
    render={({ field }) => (
      <textarea id="freeword" className="freeword-textarea" {...field} />
    )}
  />
</div>





            <div className="subject-selector-container">

            <div className="selector-header">
        科目名から探す
      </div>

      <div className="subject-selector">
              <Controller
                name="course_id"
                control={control}
                render={({ field }) => (
                  <select {...field} >
                   <option value="">選択しない</option>
                   <option value="">-- 科目を選択 --</option>
                   {Array.isArray(coursesDetails) &&
  coursesDetails
    .filter((course) => course.university_id === userDetails.university_id) // ← ここで絞り込み
    .map((course) => (
      <option key={course.id} value={course.id}>
        {course.name}
      </option>
))}
                  </select>
                )}
              />
              </div>
            </div>





            <Controller
  name="openYear"
  control={control}
  render={({ field }) => (
    <YearSelector value={field.value} onChange={field.onChange} />
  )}
/>

<Controller
  name="department_id"
  control={control}
  render={({ field }) => (
    <FacultyDepartmentSelector
      universityId={userDetails.university_id} // 必要なら動的に変更
      onDepartmentSelect={(deptId) => field.onChange(deptId)}
    />
  )}
/>

<Controller
  name="unit"
  control={control}
  render={({ field }) => (
    <UnitSelector
    value={field.value}
    units={[1, 2, 3, 4]}
    onUnitSelect={field.onChange}
    />
  )}
/>


<Controller
  name="term"
  control={control}
  render={({ field }) => (
    <TermSelector
      onTermSelect={(value) => field.onChange(value)}
    />
  )}
/>
<Controller
  name="day"
  control={control}
  render={({ field }) => (
    <DaySelector
      onDaySelect={(value) => field.onChange(value)}
    />
  )}
/>
<Controller
  name="period"
  control={control}
  render={({ field }) => (
    <PeriodSelector
      value={field.value}
      onChange={field.onChange}
    />
  )}
/>
<Controller
  name="teacher"
  control={control}
  render={({ field }) => (
    <TeacherSelector
      teachers={filteredTeachers} // 外部から配列として渡しておく必要あり
      universityId={userDetails.university_id} // 大学IDを監視して渡す
      onTeacherSelect={field.onChange}
    />
  )}
/>
<div className="question">
  <div className='question-header'>
 特徴を選択:
  </div>
  {features && Object.entries(features).map(([id, label]) => (
    <div
      key={id}
      className={`checkbox-button ${watch('feature_ids').includes(id) ? 'selected' : ''}`}
      onClick={() => handleCheckboxChange('feature_ids', id)}
    >
      <input
        type="checkbox"
        value={id}
        checked={watch('feature_ids').includes(id)}
        readOnly
      />
      {label}
    </div>
  ))}
</div>


        <div className="question">
        <div className='question-header'>
          授業の形式:
            </div>

          {class_styles && Object.entries(class_styles).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('class_style_ids').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('class_style_ids', id)}>
              <input
                  type="checkbox"
                  value={id}
                  checked={watch('class_style_ids').includes(id)}
                  readOnly
              />
                {label}
            </div>
          ))}
        </div>

        <div className="question">
        <div className='question-header'>
          評価方法:
            </div>
          {evaluation_methods && Object.entries(evaluation_methods).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('evaluation_method_ids').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('evaluation_method_ids', id)}>
                <input
                  type="checkbox"
                  value={id}
                  checked={watch('evaluation_method_ids').includes(id)}
                  readOnly

                />
                {label}
            </div>
          ))}
        </div>

        <div className="question">
        <div className='question-header'>
          学生に求めること:
            </div>
          {requirements && Object.entries(requirements).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('requirement_ids').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('requirement_ids', id)}>
                <input
                  type="checkbox"
                  value={id}
                  checked={watch('requirement_ids').includes(id)}
                  readOnly

                />
                {label}
            </div>
          ))}
        </div>

        <div className="question">
        <div className='question-header'>
          教員の雰囲気:
            </div>
          {teacher_style && Object.entries(teacher_style).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('teacher_style_ids').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('teacher_style_ids', id)}>
                <input
                  type="checkbox"
                  value={id}
                  checked={watch('teacher_style_ids').includes(id)}
                  readOnly

                />
                {label}
            </div>
          ))}
        </div>

        <div className="question">
        <div className='question-header'>
          授業資料の提供方法:
            </div>

          {material_provision && Object.entries(material_provision).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('material_provision_ids').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('material_provision_ids', id)}>
                <input
                  type="checkbox"
                  value={id}
                  checked={watch('material_provision_ids').includes(id)}
                  readOnly

                />
                {label}
            </div>
          ))}
        </div>

        <div className="question">
        <div className='question-header'>
          その他の特徴:
            </div>
          {tags && Object.entries(tags).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('tag_ids').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('tag_ids', id)}>
                <input
                  type="checkbox"
                  value={id}
                  checked={watch('tag_ids').includes(id)}
                  readOnly

                />
                {label}
            </div>
          ))}
        </div>
<nav className="bottom-nav">

<button className="button" type="submit">この条件で検索する</button>

    </nav>


       



            </form>
            </div>




          );
}

export default SearchForm;