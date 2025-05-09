import { useLocation } from "react-router-dom";

function ReviewsByYearOffered() {
  const location = useLocation();
  const reviews = location.state?.reviews || [];
  console.log("HELLOOOOOO", reviews);

  return (
    <div>
      {reviews.length > 0 ? (
        <div>
          <h2>検索結果</h2>
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>{review.user_id}</li>
            ))}
          </ul>
        </div>
      ) : (
          <div>
        <div>条件に一致する検索結果がありません</div>
        <div>条件に一致する検索結果がありません</div>
        <div>条件に一致する検索結果がありません</div>
        <div>条件に一致する検索結果がありません</div>
        <div>条件に一致する検索結果がありません</div>
</div>
      )}
    </div>
  );
}

export default ReviewsByYearOffered;
