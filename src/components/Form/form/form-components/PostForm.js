import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import UserContext from '../../../../contexts/UserContext';
import CoursesContext from '../../../../contexts/CourseContext';
import { features, class_styles, evaluation_methods, requirements, tags, teacher_style, material_provision } from '../../../../requirements/Requirements';
import axios from 'axios';
import '../FormStyleSheets/postform.css'
const API_URL = process.env.REACT_APP_API_URL;

function PostForm() {
  const { currentUser } = useContext(UserContext);
  const { courses } = useContext(CoursesContext);
  const navigate = useNavigate();

  const [coursesDetails, setCoursesDetails] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // react-hook-formのフック
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      user_id: currentUser ? currentUser.id : '',
      course_id: '',
      rating_overall: '',
      rating_easiness: '',
      rating_usefulness: '',
      comment: '',
      selected_features: [],
      selected_class_styles: [],
      selected_evaluation_methods: [],
      selected_requirements: [],
      selected_teacher_styles: [],
      selected_material_provisions: [],
      selected_tags: []
    }
  });

  useEffect(() => {
    if (currentUser) {
      setValue('user_id', currentUser.id);
      setUserDetails(currentUser);
    }
  }, [currentUser, setValue]);

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

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/registerreviews`, data);
      setMessage('登録成功！');
      setError('');
      if (res.status === 201) {
        navigate('/');
      }
    } catch (err) {
      setError('登録に失敗しました。');
      setMessage('');
    }
  };

  // チェックボックスの変更を監視
  const handleCheckboxChange = (name, value) => {
    const currentValue = watch(name);
    const newValue = currentValue.includes(value)
      ? currentValue.filter((item) => item !== value)
      : [...currentValue, value];
    setValue(name, newValue);
  };

  if (!currentUser) {
    navigate('/login');
  }

  if (!currentUser) {
    return <p>ユーザー情報を読み込み中...</p>;
  }

  return (
    <div className="postform-container">
      <div className="postform-title">
      <h2>口コミを投稿する</h2>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>


      <div className="subject-selector-container">

<div className="selector-header">
            <label>科目 </label>
            </div>
            <div className="subject-selector">

          <Controller
            name="course_id"
            control={control}
            render={({ field }) => (
              <select {...field} required>
                <option value="">-- 科目を選択 --</option>
                {Array.isArray(coursesDetails) && coursesDetails
                .filter(course => course.university_id === userDetails.university_id).map((course) => (
  <option key={course.id} value={course.id}>
    {course.name}
  </option>
))}

              </select>
            )}
          />
             </div>

     </div>

<p className="registerclasses"><Link to="/registerclasses">授業を新規登録</Link>
</p>


<div className="rating-container">

<div className="rating-header">5段階で評価</div>

      <div className="rating">
          <label>面白さ</label>
          <Controller
  name="rating_overall"
  control={control}
  render={({ field }) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          style={{
            fontSize: '24px',
            cursor: 'pointer',
            color: field.value >= value ? '#ffd700' : '#ccc',
            marginRight: '5px'
          }}
          onClick={() => field.onChange(value)}
        >
          ★
        </span>
      ))}
    </div>
  )}
/>

        </div>

        <div className="rating">
          <label>難易度 </label>
          <Controller
  name="rating_easiness"
  control={control}
  render={({ field }) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          style={{
            fontSize: '24px',
            cursor: 'pointer',
            color: field.value >= value ? '#ffd700' : '#ccc',
            marginRight: '5px'
          }}
          onClick={() => field.onChange(value)}
        >
          ★
        </span>
      ))}
    </div>
  )}
/>
        </div>

        <div className="rating">
          <label>利便性 </label>
          <Controller
  name="rating_usefulness"
  control={control}
  render={({ field }) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          style={{
            fontSize: '24px',
            cursor: 'pointer',
            color: field.value >= value ? '#ffd700' : '#ccc',
            marginRight: '5px'
          }}
          onClick={() => field.onChange(value)}
        >
          ★
        </span>
      ))}
    </div>
  )}
/>
        </div>

        </div>



        <div className="comment-container">
        <div className="comment-header">

          <label>コメント </label>
          </div>
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <textarea className="comment-textarea" placeholder="授業内容やおすすめポイントなどを自由に記入してください" {...field} />
            )}
          />
        </div>

        <div className="question">
  <label>特徴を選択:</label><br/>
  <div className="tags-selector">
  {features && Object.entries(features).map(([id, label]) => (
    <div
      key={id}
      className={`checkbox-button ${watch('selected_features').includes(id) ? 'selected' : ''}`}
      onClick={() => handleCheckboxChange('selected_features', id)}
    >
      <input
        type="checkbox"
        value={id}
        checked={watch('selected_features').includes(id)}
        readOnly
      />
      {label}
    </div>
  ))}
  </div>
</div>


        <div className="question">
          <label>授業の形式:</label><br/>
          <div className="tags-selector">

          {class_styles && Object.entries(class_styles).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('selected_class_styles').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('selected_class_styles', id)}>
              <input
                  type="checkbox"
                  value={id}
                  checked={watch('selected_class_styles').includes(id)}
                  readOnly
              />
                {label}
            </div>
          ))}
        </div>
        </div>

        <div className="question">
          <label>評価方法:</label><br/>
          <div className="tags-selector">

          {evaluation_methods && Object.entries(evaluation_methods).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('selected_evaluation_methods').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('selected_evaluation_methods', id)}>
                <input
                  type="checkbox"
                  value={id}
                  checked={watch('selected_evaluation_methods').includes(id)}
                  readOnly

                />
                {label}
            </div>
          ))}
        </div>
        </div>

        <div className="question">
          <label>学生に求めること:</label><br/>
          <div className="tags-selector">

          {requirements && Object.entries(requirements).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('selected_requirements').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('selected_requirements', id)}>
                <input
                  type="checkbox"
                  value={id}
                  checked={watch('selected_requirements').includes(id)}
                  readOnly
                />
                {label}
            </div>
          ))}
        </div>
        </div>

        <div className="question">
          <label>教員の雰囲気:</label><br/>
          <div className="tags-selector">

          {teacher_style && Object.entries(teacher_style).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('selected_teacher_styles').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('selected_teacher_styles', id)}>
                <input
                  type="checkbox"
                  value={id}
                  checked={watch('selected_teacher_styles').includes(id)}
                  readOnly
                />
                {label}
            </div>
          ))}
        </div>
        </div>

        <div className="question">
          <label>授業資料の提供方法:</label><br/>
          <div className="tags-selector">

          {material_provision && Object.entries(material_provision).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('selected_material_provisions').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('selected_material_provisions', id)}>
                <input
                  type="checkbox"
                  value={id}
                  checked={watch('selected_material_provisions').includes(id)}
                  readOnly
                />
                {label}
            </div>
          ))}
        </div>
        </div>


        <div className="question">
          <label>その他特徴:</label><br/>
          <div className="tags-selector">

          {tags && Object.entries(tags).map(([id, label]) => (
            <div key={id}
            className={`checkbox-button ${watch('selected_tags').includes(id) ? 'selected' : ''}`}
            onClick={() => handleCheckboxChange('selected_tags', id)}>
                <input
                  type="checkbox"
                  value={id}
                  checked={watch('selected_tags').includes(id)}
                  readOnly
                  />
                {label}
              
            </div>
          ))}
        </div>
        </div>
        <nav className="bottom-nav">

        <button className="button" type="submit">この内容で投稿</button>

    </nav>
      </form>

     
    </div>
  );
}

export default PostForm;
