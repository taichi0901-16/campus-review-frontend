import React, { useEffect, useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../contexts/UserContext';
import { features, class_styles, evaluation_methods, requirements, tags, teacher_style, material_provision } from '../../requirements/Requirements';
import "./ReviewUpdate.css"
const API_URL = process.env.REACT_APP_API_URL;

function ReviewEditForm() {

  console.log("HELOOOOOO")
  const { currentUser } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewDetails, setReviewDetails] = useState(null);
  const [coursesDetails, setCoursesDetails] = useState([]);
  const { register, handleSubmit, watch, setValue, control, reset } = useForm({
    defaultValues: {}, // 最初は空
    shouldUnregister: true, // ★追加

  });
  
  useEffect(() => {
    if (currentUser) setValue('user_id', currentUser.id);
  }, [currentUser, setValue]);

  // // レビュー取得
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axios.get(`${API_URL}/plane_review/${id}`);
        setReviewDetails(res.data);
        const defaultValues = {
          ...res.data,
          selected_features: res.data.feature_ids.split(","),
          selected_class_styles: res.data.class_style_ids.split(","),
          selected_evaluation_methods: res.data.evaluation_method_ids.split(","),
          selected_material_provisions: res.data.material_provision_ids.split(","),
          selected_requirements: res.data.requirement_ids.split(","),
          selected_tags: res.data.tag_ids.split(","),
          selected_teacher_styles: res.data.teacher_style_ids.split(","),
        };
  
        reset(defaultValues); // ← これで初期チェックも含め反映される
      } catch (err) {
        console.error("レビューの取得に失敗", err);
      }
    };
    fetchReview();
  }, [id, reset]);

  // 授業一覧取得
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/courses`);
        setCoursesDetails(res.data);
      } catch (err) {
        console.error("授業の取得に失敗", err);
      }
    };
    fetchCourses();
  }, []);

  const handleCheckboxChange = (name, value) => {
    const current = watch(name) || [];
    const newValue = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(name, newValue);
  };

  const onSubmit = async (data) => {
    try {
      await axios.put(`${API_URL}/review_update/${id}`, data);
      navigate(`/review_details/${id}`);
    } catch (err) {
      console.error("更新に失敗しました", err);
    }
  };
  console.log(reviewDetails)

  if (!currentUser) return <p>ログインしてください</p>;
  if (!reviewDetails) return <p>読み込み中...</p>;

  return (
    <div className="review-update-container">
      <h2 className="review-update-title">レビューの編集</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="subject-selector-container">
        <div className="selector-header">

          <label>科目: </label>
          </div>
          <div className="subject-detail">
          <Controller
            name="course_id"
            control={control}
            render={({ field }) => (
              <select  {...field} required>
                <option value="">-- 科目を選択 --</option>
                {coursesDetails.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            )}
          />
        </div>
        </div> */}


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
          <label>コメント: </label>
          </div>
          <Controller
            name="comment"
            control={control}
            render={({ field }) => <textarea className="comment-textarea" {...field} />}
          />
        </div>

        <div className="question">
  <label>特徴を選択:</label><br/>
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

       <div className="question">
          <label>授業の形式:</label><br/>
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

        <div className="question">
          <label>評価方法:</label><br/>
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

        <div className="question">
          <label>学生に求めること:</label><br/>
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

        <div className="question">
          <label>教員の雰囲気:</label><br/>
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

        <div className="question">
          <label>授業資料の提供方法:</label><br/>
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

        <div className="question">
          <label>その他特徴:</label><br/>
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

        <nav className="bottom-nav">

        <button className="button" type="submit">更新</button>

    </nav>

      </form>
    </div>
  );
}

export default ReviewEditForm;
