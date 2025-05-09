const API_URL = process.env.REACT_APP_API_URL;


const FetchReviewsByTerm = async (term, user_univ_id,navigate) => {
    
    try {
      console.log("送信する年:", term);
      const response = await fetch(`${API_URL}/term/${term}/${user_univ_id}`);
      const data = await response.json();
      console.log("取得したレビュー:", data);
      navigate("/search_result" , { state: { searchResults: data } });

    } catch (error) {
      console.error("授業情報の取得に失敗しました", error);
    }
  };

export default FetchReviewsByTerm