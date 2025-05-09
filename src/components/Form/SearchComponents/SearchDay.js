import { useContext, useEffect, useState } from 'react';
import UserContext from '../../../contexts/UserContext';
import FetchReviewsByDay from '../../Functions/FetchReviewsByDay';
import { useNavigate } from "react-router-dom";
import DaySelector from './Selectors/DaySelector';
function SearchDay() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setUserDetails(currentUser);
  }, [currentUser]);

  const handleDaySelect = (day) => {
    if (userDetails) {
      FetchReviewsByDay(day, userDetails.university_id, navigate);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (!userDetails) {
    return <p>ユーザー情報を読み込み中...</p>;
  }

  return (
    <div>
      <DaySelector onDaySelect={handleDaySelect} />
    </div>
  );
}

export default SearchDay;
