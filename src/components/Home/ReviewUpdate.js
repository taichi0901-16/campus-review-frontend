import React, { useEffect, useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../contexts/UserContext';
import {
  features,
  class_styles,
  evaluation_methods,
  requirements,
  tags,
  teacher_style,
  material_provision
} from '../../requirements/Requirements';
import './ReviewUpdate.css';

const API_URL = process.env.REACT_APP_API_URL;

function ReviewEditForm() {
  const { currentUser } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewDetails, setReviewDetails] = useState(null);
  const [coursesDetails, setCoursesDetails] = useState([]);

  const { register, handleSubmit, watch, setValue, control, reset } = useForm({
    defaultValues: {}
  });

  useEffect(() => {
    if (currentUser) {
      setValue('user_id', currentUser.id);
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axios.get(`${API_URL}/plane_review/${id}`);
        const data = res.data;

        const defaultValues = {
          ...data,
          selected_features: data[7]?.split(',') || [],
          selected_class_styles: data[8]?.split(',') || [],
          selected_evaluation_methods: data[9]?.split(',') || [],
          selected_material_provisions: data[10]?.split(',') || [],
          selected_requirements: data[11]?.split(',') || [],
          selected_tags: data[12]?.split(',') || [],
          selected_teacher_styles: data[13]?.split(',') || []
        };

        setReviewDetails(defaultValues);
        reset(defaultValues);
      } catch (err) {
        console.error("レビューの取得に失敗", err);
      }
    };

    fetchReview();
  }, [id, reset]);

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

  if (!currentUser) return <p>ログインしてください</p>;
  if (!reviewDetails) return <p>読み込み中...</p>;

  return (
    <div className="review-update-container">
      <h2 className="review-update-title">レビューの編集</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rating-container">
          <div className="rating-header">5段階で評価</div>

          {[
            { name: 'rating_overall', label: '面白さ' },
            { name: 'rating_easiness', label: '難易度' },
            { name: 'rating_usefulness', label: '利便性' }
          ].map(({ name, label }) => (
            <div className="rating" key={name}>
              <label>{label}</label>
              <Controller
                name={name}
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
          ))}
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

        {[
          { label: '特徴を選択:', name: 'selected_features', data: features },
          { label: '授業の形式:', name: 'selected_class_styles', data: class_styles },
          { label: '評価方法:', name: 'selected_evaluation_methods', data: evaluation_methods },
          { label: '学生に求めること:', name: 'selected_requirements', data: requirements },
          { label: '教員の雰囲気:', name: 'selected_teacher_styles', data: teacher_style },
          { label: '授業資料の提供方法:', name: 'selected_material_provisions', data: material_provision },
          { label: 'その他特徴:', name: 'selected_tags', data: tags }
        ].map(({ label, name, data }) => (
          <div className="question" key={name}>
            <label>{label}</label><br />
            {data && Object.entries(data).map(([id, label]) => (
              <div
                key={id}
                className={`checkbox-button ${watch(name)?.includes(id) ? 'selected' : ''}`}
                onClick={() => handleCheckboxChange(name, id)}
              >
                <input
                  type="checkbox"
                  value={id}
                  checked={watch(name)?.includes(id)}
                  readOnly
                />
                {label}
              </div>
            ))}
          </div>
        ))}

        <nav className="bottom-nav">
          <button className="button" type="submit">更新</button>
        </nav>
      </form>
    </div>
  );
}

export default ReviewEditForm;
