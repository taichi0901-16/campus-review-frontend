import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from '../../../contexts/UserContext';
import FetchReviewsByYear from '../../Functions/FetchReviewsByYear';
import YearSelector from './Selectors/YearSelector';

function SearchOffered_year() {
  const [selectedYear, setSelectedYear] = useState(null);
  const { currentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setUserDetails(currentUser);
    console.log("ユーザー", userDetails);
  }, [currentUser]);

  const navigate = useNavigate();

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    FetchReviewsByYear(year, userDetails.university_id, navigate);
  };
  if (!currentUser) return null;
  if (!userDetails) return <p>ユーザー情報を読み込み中...</p>;

  return (
    <form className="course-search-by-year">
      <YearSelector value={selectedYear} onChange={handleYearChange} />
    </form>
  );
}

export default SearchOffered_year;
