import { useContext,useEffect, useState } from 'react';
import { Link,useParams ,useNavigate} from 'react-router-dom';
import "./ReviewDetails.css"
import UserContext from '../../contexts/UserContext';
const API_URL = process.env.REACT_APP_API_URL;

function ReviewDetails() {
  const { review_id } = useParams();
  const [reviewsData, setReviewsData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [user, setUser] = useState([]);
  const { currentUser } = useContext(UserContext);
    const [userDetails, setUserDetails] = useState(null);
    const [showMenuIndex, setShowMenuIndex] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      setUserDetails(currentUser);
    }, [currentUser]);
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`${API_URL}/review/${review_id}`);
        if (!response.ok) throw new Error('レビューが見つかりません');
        const data = await response.json();
        setReviewsData(data);
      } catch (error) {
        console.error('レビューの取得エラー:', error);
      }
    };
    fetchReview();
  }, [review_id]);



  useEffect(() => {
    const department_id = reviewsData[0]?.reviews[0]?.user_department_id;
    if (!department_id) return;

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/user_details_by_department_id/${department_id}`);
        if (!response.ok) throw new Error('ユーザー情報が見つかりません');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('ユーザー情報の取得エラー:', error);
      }
    };
    fetchUserDetails();

    const fetchUser = async () => {
      const userId = reviewsData[0]?.reviews[0]?.user_id;

      if(reviewsData){
      try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        if (!response.ok) throw new Error('レビューが見つかりません');
        const data = await response.json();
        console.log("ユーザデータ",data)

        setUser(data);
      } catch (error) {
        console.error('レビューの取得エラー:', error);
      }
    }
    };
    fetchUser();
  }, [reviewsData]);



  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm("本当に削除しますか？");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/review/delete/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("レビューを削除しました");
        navigate('/reviews');
      } else {
        alert("削除に失敗しました");
      }
    } catch (error) {
      console.error("削除エラー", error);
      alert("削除時にエラーが発生しました");
    }
  };

  console.log(reviewsData)
  console.log(userData)
  console.log("ゆーざーーーーーゆーざーーーーー",user)

  if (!reviewsData || reviewsData.length === 0) return <p>レビューが見つかりません。</p>;

  return (
    <div className="review-details">
      {reviewsData.map((course, index) => {
        const average = (Math.ceil((
          (course.average_rating_overall +
            course.average_rating_easiness +
            course.average_rating_usefulness) / 3
        )*100)/100);

        return (
          <div key={index} className="review-details__course">
            <h2 className="review-details__course-title">{course.course_name} </h2>
            <div className="review-details__averages">
                    
        <div className="rating-star">

             <p className="rating-title"> 総合評価 : </p>
              {[...Array(5)].map((_, i) => {
                if (i + 1 <= average) {
                  return <span key={i}>★</span>;
                } else if (i + 0.5 <= average) {
                  return <span key={i}>⯨</span>; // or use custom half-star icon
                } else {
                  return <span key={i}>☆</span>;
                }
              })}
            <span>  {average}</span>
</div>
            </div>

            <div className="review-details__review-list">
              {course.reviews.map((r, i) => (
                <div key={i} className="review-details__review-entry">
                  <h3 className="review-details__review-heading">レビュー</h3>

                  {userDetails && userDetails.id === r.user_id && (
        <div className="review-card__menu-container">
          <button
            className="review-card__menu-button"
            onClick={() => setShowMenuIndex(showMenuIndex === i ? null : i)}
          >
            ・・・
          </button>
          {showMenuIndex === i && (
            <div className="review-card__dropdown">
              <Link to={`/review_update/${r.review_id}`} className="review-card__dropdown-link">編集</Link>
              <div 
                onClick={() => handleDelete(r.review_id)} 
                className="review-card__dropdown-delete"
              >
                削除
              </div>
              <button 
                onClick={() => setShowMenuIndex(null)} 
                className="review-card__dropdown-cancel"
              >
                取消
              </button>
            </div>
          )}
        </div>
      )}

<div className="reviewDetail">
                  <p className="review-details__rating">面白さ:  {[...Array(5)].map((_, i) => {
                if (i + 1 <= r.rating_overall) {
                  return <span key={i}>★</span>;
                } else if (i + 0.5 <= r.rating_overall) {
                  return <span key={i}>⯨</span>; // or use custom half-star icon
                } else {
                  return <span key={i}>☆</span>;
                }
              })} {r.rating_overall}</p>
<p className="review-details__rating">難易度:  {[...Array(5)].map((_, i) => {
                if (i + 1 <= r.rating_easiness) {
                  return <span key={i}>★</span>;
                } else if (i + 0.5 <= r.rating_easiness) {
                  return <span key={i}>⯨</span>; // or use custom half-star icon
                } else {
                  return <span key={i}>☆</span>;
                }
              })} {r.rating_easiness}</p>

<p className="review-details__rating">有用性:  {[...Array(5)].map((_, i) => {
                if (i + 1 <= r.rating_usefulness) {
                  return <span key={i}>★</span>;
                } else if (i + 0.5 <= r.rating_usefulness) {
                  return <span key={i}>⯨</span>; // or use custom half-star icon
                } else {
                  return <span key={i}>☆</span>;
                }
              })} {r.rating_usefulness}</p>

<p className="review-details__comment">コメント:</p>

              <div className="comment"> {r.comment}</div>

                  <div className="tags-details">
                    <p className="tags-label">特徴:</p>
                    <div className="tag-list">
                      {r.tags.flat().filter(tag => tag !== "").map((tag, idx) => (
                        <span key={idx} className="tag-detail">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="review-details__user-info">
                    <p className="review-details__faculty-name">{userData[1]} {userData[0]} {user[7]}年</p>
                  </div>
                </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
           
      
    </div>
  );
}

export default ReviewDetails;
