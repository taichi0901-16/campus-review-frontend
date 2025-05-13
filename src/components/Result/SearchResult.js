import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../Home/SearchBar";
import {Link } from "react-router-dom";

function SearchResult() {
  const location = useLocation();
  const { searchResults } = location.state || {};



  return (
    <div style={{ margin: '100px 0', padding: '0 20px' }}>
        <div className="background-image-section">
    <h1>検索結果</h1>
    <SearchBar />
  </div>
      {Array.isArray(searchResults) && searchResults.length > 0 ? (
        searchResults
        .slice() // 元の配列を破壊しないためのコピー
        .reverse()
        .map((course, index) => {
          const reviews = course.reviews || [];
          const latestReview = reviews.length > 0 ? reviews[reviews.length - 1] : null;

          return (

            <Link to={`/review_information/${course.course_id}`}>

            <div
              key={index}
              style={{
                marginBottom: '30px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#f9f9f9'
              }}
            >


              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>
                授業名: {course.course_name}
              </h2>
              {/* <div>平均総合評価: {course.average_rating_overall}</div>
              <div>平均易しさ: {course.average_rating_easiness}</div>
              <div>平均有用性: {course.average_rating_usefulness}</div> */}
              <div>総合 :  {[...Array(5)].map((_, i) => {
                if (i + 1 <= course.average_rating_all) {
                  return <span key={i}>★</span>;
                } else if (i + 0.5 <= course.average_rating_all) {
                  return <span key={i}>⯨</span>; // or use custom half-star icon
                } else {
                  return <span key={i}>☆</span>;
                }
              })} {course.average_rating_all}</div>

              {latestReview ? (
                <div
                  style={{
                    marginTop: '15px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: '#fff'
                  }}
                >
                  <div><strong>最新レビュー</strong></div>
                  {/* <div>総合評価: {latestReview.rating_overall}</div>
                  <div>易しさ: {latestReview.rating_easiness}</div>
                  <div>有用性: {latestReview.rating_usefulness}</div> */}
                  <div>コメント: {latestReview.comment}</div>
                </div>
              ) : (
                <div style={{ marginTop: '10px' }}>レビューはありません。</div>
              )}




            </div>
            </Link>
          );
        })
      ) : (
        <div>検索結果がありません。</div>
      )}
    </div>
 
  );
}

export default SearchResult;
