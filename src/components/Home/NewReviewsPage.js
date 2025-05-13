import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReviewsContext from '../../contexts/reviewContext'; // パス注意！
import UserContext from '../../contexts/UserContext';

import "./NewReviewsPage.css"
const NewReviewsPage = () => {
  const { currentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);

  const { reviews, setReviews } = useContext(ReviewsContext);
  const [reviewDetails, setReviewDetails] = useState(null);

  useEffect(() => {
    setUserDetails(currentUser);
}, [currentUser]);
  useEffect(() => {
    setReviewDetails(reviews);
  }, [reviews]);
  


  
        
    // currentUserが存在しない場合はメッセージを表示
    if (!currentUser) {
      return null;
    }
  
    // データがまだ取得されていない場合はローディングメッセージを表示
    if (!userDetails) {
      return <p>ユーザー情報を読み込み中...</p>;
    }

  return (
    <div className="reviews">
      <h2 className="new-reviews-subject">新着レビュー</h2>
      <div className="search-results-container">
        {Array.isArray(reviewDetails) && reviewDetails.length > 0 ? (
          <div className="scroll-wrapper">
            {reviewDetails
            .filter(course => course.course_university_id === userDetails.university_id)
            .slice() // 元の配列を破壊しないためのコピー
            .reverse() // 逆順にする
            .map((course) => {
              const reviews = course.reviews || [];
              const latestReview = reviews.length > 0 ? reviews[reviews.length - 1] : null;

              return (
                <Link to={`/review_information/${course.course_id}`} key={course.course_id}>
                  <div className="course-card">
                    <div className="course-title">
                      {course.course_name}
                    </div>
            <div className="course_info">
              <span className="rate">
              評価: 
              </span>
       
            <div className="star">
              {[...Array(5)].map((_, i) => {
                const rating = course.average_rating_all;
                if (i + 1 <= rating) {
                  return <span key={i}>★</span>;
                } else if (i + 0.5 <= rating) {
                  return <span key={i}>⯨</span>; // or use custom half-star icon
                } else {
                  return <span key={i}>☆</span>;
                }
              })}
              <span className="ratenum">
              {course.average_rating_all}

              </span>
            </div>
          </div>

                    {/* <div className="star">
                      総合: {course.average_rating_all}
                      </div> */}

                    {latestReview ? (
                      <div className="review">
                        <div className="newreview">最新レビュー</div>
                      <div className="reviewinfo">
                        {latestReview.comment?.slice(0, 20)}...<br/>
                        <div className="tags">
                         {latestReview.tags
                    .flat()               // ネストされた配列を1次元にする
                    .slice(0, 2)          // 最初の2つだけ表示
                    .map((tag, index) => (
                      <div className="tag" key={index}>{tag}</div>
                  ))}
                        ...
                        </div>
                        </div>
                        {/* {latestReview.tags[0]}
                        {latestReview.tags[1]} */}
                      </div>
                    

                    ) : (
                      <div className="no-review">レビューなし</div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div>検索結果がありません。</div>
        )}
      </div>
    </div>
  );
};

export default NewReviewsPage;
