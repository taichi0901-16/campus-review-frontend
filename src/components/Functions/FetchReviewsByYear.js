const API_URL = process.env.REACT_APP_API_URL;



const FetchReviewsByYear = async (year,user_univ_id,navigate) => {
    try {
      console.log("送信する年:", year);
      const response = await fetch(`${API_URL}/year_offered/${year}/${user_univ_id}`);
      const data = await response.json();
      console.log("取得したレビュー:", data);
      navigate("/search_result" , { state: { searchResults: data } });
    } catch (error) {
      console.error("授業情報の取得に失敗しました", error);
    }
  };

  export default FetchReviewsByYear;