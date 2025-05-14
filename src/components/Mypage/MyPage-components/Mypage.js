import { useContext, useState, useEffect } from 'react';
import UserContext from '../../../contexts/UserContext';
import { Link } from "react-router-dom";
import LoginForm from '../../Form/form/form-components/LoginForm';
import '../MyPage-StyleSheets/Mypage.css';
import axios from 'axios';
import ReviewsContext from '../../../contexts/reviewContext'; // パス注意！
const API_URL = process.env.REACT_APP_API_URL;

function Mypage({ onLogin }) {
  const { currentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const { reviews } = useContext(ReviewsContext); // setReviewsは不要
  const [reviewDetails, setReviewDetails] = useState(null); // 追加
  const [filteredReviews, setFilteredReviews] = useState([]);
const [loading, setLoading] = useState(true);

  // ユーザー情報を設定
  useEffect(() => {
    setUserDetails(currentUser);
    const getUniversity = async () => {
      if (currentUser) {
        try {
          const res = await axios.get(`${API_URL}/user_info/${currentUser.university_id}/${currentUser.faculty_id}/${currentUser.department_id}`);
          setUserInfo(res.data);
        } catch (err) {
          console.error(err);
        } finally {
        setLoading(false); // 読み込み完了
      }
    } else {
      setLoading(false); // ログインしていない場合もローディング終了
    }
      };
    
    getUniversity();
  }, [currentUser]);

  // ローカルストレージからレビューを取得
  const getReviewsFromLocalStorage = () => {
    const reviewsData = localStorage.getItem('reviews');
    return reviewsData ? JSON.parse(reviewsData) : [];
  };

  // ローカルストレージにレビューを保存
  const saveReviewsToLocalStorage = (reviewsData) => {
    localStorage.setItem('reviews', JSON.stringify(reviewsData));
  };

  // reviewDetailsが更新されたときにローカルストレージに保存
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setReviewDetails(reviews);
      saveReviewsToLocalStorage(reviews);  // ローカルストレージに保存
    } else {
      const storedReviews = getReviewsFromLocalStorage();
      if (storedReviews.length > 0) {
        setReviewDetails(storedReviews);  // ローカルストレージから取得
      }
    }
  }, [reviews]);

  // フィルタリングされたレビューを設定
  useEffect(() => {
    const getFilteredReviews = () => {
      if (currentUser && reviewDetails) {
        try {
          // 自分の大学に一致する科目かつ自分のレビューをフィルタリング
          const filtered = reviewDetails
            .filter(course => course.course_university_id === currentUser.university_id) // 大学ID一致
            .map(course => {
              const myReviews = course.reviews.filter(review => review.user_id === currentUser.id); // 自分のレビューのみ
              return {
                ...course,
                reviews: myReviews
              };
            })
            .filter(course => course.reviews.length > 0); // 自分のレビューがある科目のみ

          setFilteredReviews(filtered);
        } catch (err) {
          console.error(err);
        }
      }
    };
    
    getFilteredReviews();
  }, [currentUser, reviewDetails]); // currentUser と reviewDetails が変わった時に実行

 if (loading) {
  return (
    <div className="overlay">
      <div className="spinner"></div>
      <p>読み込み中...</p>
    </div>
  );
}


  return (
    <div className='mypage-container'>
      {userDetails && userInfo ? (
        <div className="mypage-content">
          <div className="mypage-details">
          <span className="mypage-title">{userDetails.username}</span><br/>
          <span className="mypage-email">email : {userDetails.email}</span>

          <div className="mypage-info">
            <p className="mypage-info__item">学校: <span>{userInfo.university}</span></p>
            <p className="mypage-info__item">学部: <span>{userInfo.faculty}</span></p>
            <p className="mypage-info__item">学科: <span>{userInfo.department}</span></p>
            <p className="mypage-info__item">学年: <span>{userDetails.grade_year}</span></p>
          </div>
          <Link to="/user_information" className="mypage-link">
            ユーザ情報の編集・削除
          </Link>
          </div>
          {/* フィルタリングされたレビューの表示 */}
          <div className="mypage-reviews">
  <h3>自分のレビュー</h3>
  {filteredReviews.length > 0 ? (
    <div className="review-cards-container">
      {filteredReviews.map(course => (
        <div key={course.course_id} className="review-card">
          <h4 className="review-name">{course.course_name}</h4>
          {course.reviews.map(review => (
           

           <Link 
    to={`/review_details/${review.review_id}`} 
    key={review.review_id} 
    className="review-card-link"
  >
           <div key={review.review_id} className="review-content">

              <span><strong>コメント:</strong> {review.comment?.slice(0, 20)}... 
             </span>
              <br/>
              <span>総合評価 : </span>
              {[...Array(5)].map((_, i) => {
                const rating = (review.rating_easiness+review.rating_overall+review.rating_usefulness) / 3;
                if (i + 1 <= rating) {
                  return <span key={i}>★</span>;
                } else if (i + 0.5 <= rating) {
                  return <span key={i}>⯨</span>; // or use custom half-star icon
                } else {
                  return <span key={i}>☆</span>;
                }
              })}

<br/>   <div className="my-tags">
            {review.tags
              .flat()
              .slice(0, 5)
              .map((tag, index) => (
                <div key={index} className="tag">{tag}</div>
            ))}
             </div>
            </div>

            </Link>
          ))}
        </div>
      ))}
    </div>





  )
   : (
    <p className="none-review">まだレビューはありません </p>
  )}
</div>

        </div>
      ) : (
        <div className="mypage-login">
          <LoginForm onLogin={onLogin} />
        </div>
      )}
    </div>
  );
}

export default Mypage;
