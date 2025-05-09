import { useContext, useState, useEffect } from 'react';
import UserContext from '../../contexts/UserContext';
import { Link, useParams, useNavigate } from "react-router-dom";
import './reviewinformation.css';
const API_URL = process.env.REACT_APP_API_URL;

function ReviewInformation() {
  const { id } = useParams(); // course_id
  const { currentUser } = useContext(UserContext);
  const [reviewDetails, setReviewDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUserDetails(currentUser);
  }, [currentUser]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`${API_URL}/reviews`);
        const reviews = await response.json();
        const courseReviews = reviews.find(r => String(r.course_id) === id);
        setReviewDetails(courseReviews || null);
      } catch (error) {
        console.error("レビュー情報の取得に失敗しました", error);
      }
    };
    fetchReview();
  }, [id]);

  

  console.log("レビューディティール",reviewDetails)

  if (!currentUser) return <p>ログインしていません。</p>;
  if (!userDetails || !reviewDetails) return <p>読み込み中...</p>;

  return (


    <div className="review-info">
      <h2 className="review-info__title">{reviewDetails.course_name}</h2>
      {/* <p className="review-info__stat">平均評価（総合）: {reviewDetails.average_rating_overall}</p>
      <p className="review-info__stat">平均評価（易しさ）: {reviewDetails.average_rating_easiness}</p>
      <p className="review-info__stat">平均評価（有用性）: {reviewDetails.average_rating_usefulness}</p> */}
             <div className="rating-star">

             <p className="rating-title"> 総合評価 : </p>
              {[...Array(5)].map((_, i) => {
                const rating = (reviewDetails.average_rating_easiness+reviewDetails.average_rating_overall+reviewDetails.average_rating_usefulness) / 3;
                if (i + 1 <= rating) {
                  return <span key={i}>★</span>;
                } else if (i + 0.5 <= rating) {
                  return <span key={i}>⯨</span>; // or use custom half-star icon
                } else {
                  return <span key={i}>☆</span>;
                }
              })}
            <span>  {Math.ceil(((reviewDetails.average_rating_easiness+reviewDetails.average_rating_overall+reviewDetails.average_rating_usefulness) / 3)*100) /100}</span>
</div>
      <h3 className="review-info__subtitle">レビュー</h3>
      
      
      {reviewDetails.reviews.map((review, index) => (
  <Link 
    to={`/review_details/${review.review_id}`} 
    key={review.review_id} 
    className="review-card-link"
  >
    <div className="review-card" onClick={(e) => e.stopPropagation()}>
      <p className="review-card__item">総合評価:</p>
      <div className="rating-star">
        {[...Array(5)].map((_, i) => {
          const rating = (review.rating_overall+review.rating_easiness+review.rating_usefulness) /3;
          if (i + 1 <= rating) {
            return <span key={i}>★</span>;
          } else if (i + 0.5 <= rating) {
            return <span key={i}>⯨</span>;
          } else {
            return <span key={i}>☆</span>;
          }
        })} : <span>{Math.ceil(((review.rating_overall+review.rating_easiness+review.rating_usefulness) /3)*100)/100}</span>
      </div>

      <div className="review-info-detail">
        <div className="review-comment">コメント: {review.comment}</div>
        <div className="my-tags">
          {review.tags.flat().slice(0, 4).map((tag, index) => (
            <div key={index} className="tag">{tag}</div>
          ))}
        </div>
      </div>


    </div>
  </Link>
))}

    </div>
  );
}

export default ReviewInformation;
