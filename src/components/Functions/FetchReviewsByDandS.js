const API_URL = process.env.REACT_APP_API_URL;


const FetchReviewsByDandS = async (department_id,navigate) => {
    if (department_id) {
        try {
          const res = await fetch(`${API_URL}/get_course_by_department/${department_id}`);
          const data = await res.json();
          console.log(data)
          navigate("/search_result" , { state: { searchResults: data } });
  
        } catch (err) {
          console.error(err);
        }
      }
  };

  export default FetchReviewsByDandS;