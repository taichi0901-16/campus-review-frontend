import { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ReviewDetails.css';
import UserContext from '../../contexts/UserContext';

const API_URL = process.env.REACT_APP_API_URL;

function ReviewDetails() {
  const { review_id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const [courseData, setCourseData] = useState(null);
  const [reviewUser, setReviewUser] = useState(null);
  const [departmentUserData, setDepartmentUserData] = useState(null);
  const [showMenuIndex, setShowMenuIndex] = useState(null);

  // レビューの取得
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`${API_URL}/review/${review_id}`);
        if (!res.ok) throw new Error('レビューが見つかりません');
        const data = await res.json();
        setCourseData(data[0]);
      } catch (err) {
        console.error('レビュー取得エラー:', err);
      }
    };
    fetchReview();
  }, [review_id]);

  // ユーザー情報と学科情報の取得
  useEffect(() => {
    if (!courseData || !courseData.reviews || courseData.reviews.length === 0) return;

    const review = courseData.reviews[0];
    const fetchUserAndDept = async () => {
      try {
        const [userRes, deptRes] = await Promise.all([
          fetch(`${API_URL}/users/${review.user_id}`),
          fetch(`${API_URL}/user_details_by_department_id/${review.user_department_id}`)
        ]);

        if (!userRes.ok || !deptRes.ok) throw new Error('ユーザー情報の取得失敗');

        const userData = await userRes.json();
        const deptData = await deptRes.json();

        setReviewUser(userData);
        setDepartmentUserData(deptData);
      } catch (err) {
        console.error('ユーザー情報取得エラー:', err);
      }
    };

    fetchUserAndDept();
  }, [courseData]);

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm('本当に削除しますか？');
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/review/delete/${reviewId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('レビューを削除しました');
        navigate('/');
      } else {
        alert('削除に失敗しました');
      }
    } catch (err) {
      console.error('削除時エラー:', err);
      alert('削除時にエラーが発生しました');
    }
  };

  if (!courseData) return <p>レビューが見つかりません。</p>;

  const average = Math.ceil((
    courseData.average_rating_overall +
    courseData.average_rating_easiness +
    courseData.average_rating_usefulness
  ) / 3 * 100) / 100;

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => {
      if (i + 1 <= rating) return <span key={i}>★</span>;
      if (i + 0.5 <= rating) return <span key={i}>⯨</span>;
      return <span key={i}>☆</span>;
    });

  return (
    <div className="review-details">
      <div className="review-details__course">
        <h2 className="review-details__course-title">{courseData.course_name}</h2>
        <div className="review-details__averages">
          <div className="rating-star">
            <p className="rating-title">総合評価 : </p>
            {renderStars(average)} <span>{average}</span>
          </div>
        </div>

        <div className="review-details__review-list">
          {courseData.reviews.map((r, i) => (
            <div key={r.review_id} className="review-details__review-entry">
              <h3 className="review-details__review-heading">レビュー</h3>

              {currentUser?.id === r.user_id && (
                <div className="review-card__menu-container">
                  <button
                    className="review-card__menu-button"
                    onClick={() => setShowMenuIndex(showMenuIndex === i ? null : i)}
                  >
                    ・・・
                  </button>
                  {showMenuIndex === i && (
                    <div className="review-card__dropdown">
                     
                      <div
                        onClick={() => handleDelete(r.review_id)}
                        className="review-card__dropdown-delete"
                      >
                        削除
                      </div>
                      <div
                        onClick={() => setShowMenuIndex(null)}
                        className="review-card__dropdown-cancel"
                      >
                        取消
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="reviewDetail">
                <p className="review-details__rating">面白さ: {renderStars(r.rating_overall)} {r.rating_overall}</p>
                <p className="review-details__rating">難易度: {renderStars(r.rating_easiness)} {r.rating_easiness}</p>
                <p className="review-details__rating">有用性: {renderStars(r.rating_usefulness)} {r.rating_usefulness}</p>

                <p className="review-details__comment">コメント:</p>
                <div className="comment">{r.comment}</div>

                <div className="tags-details">
                  <p className="tags-label">特徴:</p>
                  <div className="tag-list">
                    {r.tags.flat().filter(tag => tag).map((tag, idx) => (
                      <span key={idx} className="tag-detail">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="review-details__user-info">
                  {departmentUserData && reviewUser ? (
                    <p className="review-details__faculty-name">
                      {departmentUserData[1]} {departmentUserData[0]} {reviewUser[7]}年
                    </p>
                  ) : (
                    <p className="review-details__faculty-name">ユーザー情報取得中...</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewDetails;
