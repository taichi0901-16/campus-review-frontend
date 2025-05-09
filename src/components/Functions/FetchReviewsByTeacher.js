const API_URL = process.env.REACT_APP_API_URL;


const FetchReviewsByTeacher = async (teacher_id,user_univ_id,navigate) => {
    try {
      console.log("教員のID:", teacher_id);
      const response = await fetch(`${API_URL}/teacher/${teacher_id}/${user_univ_id}`);
      const data = await response.json();
      console.log("取得したレビュー:", data);
      navigate("/search_result" , { state: { searchResults: data } });

    } catch (error) {
      console.error("授業情報の取得に失敗しました", error);
    }
  };


  export default FetchReviewsByTeacher;