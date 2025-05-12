const API_URL = process.env.REACT_APP_API_URL;


const FetchReviewsByUnit = async (unit,user_univ_id,navigate) => {
    try {
      const response = await fetch(`${API_URL}/unit/${unit}/${user_univ_id}`);
      const data = await response.json();
      navigate("/search_result" , { state: { searchResults: data } });

    } catch (error) {
      console.error("授業情報の取得に失敗しました", error);
    }
  };

  export default FetchReviewsByUnit;