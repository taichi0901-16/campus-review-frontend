import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from '../../../contexts/UserContext';
import FetchReviewsByUnit from '../../Functions/FetchReviewsByUnit';
import UnitSelector from './Selectors/UnitSelector';

function SearchUnit() {
  const { currentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUserDetails(currentUser);
  }, [currentUser]);

  const handleUnitSelect = (unit) => {
    if (userDetails) {
      FetchReviewsByUnit(unit, userDetails.university_id, navigate);
    }
  };

  if (!currentUser) return null;
  if (!userDetails) return <p>ユーザー情報を読み込み中...</p>;
  return (
    <form className="course-search-by-unit">

    <div>
      <UnitSelector onUnitSelect={handleUnitSelect} />
    </div>
    </form>
  );
}

export default SearchUnit;
