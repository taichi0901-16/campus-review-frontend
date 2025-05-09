import { useContext, useEffect, useState } from 'react';
import UserContext from '../../../contexts/UserContext';
import FetchReviewsByTerm from '../../Functions/FetchReviewsByTerm';
import { useNavigate } from "react-router-dom";
import TermSelector from './Selectors/TermSelector';

function SearchTerm() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setUserDetails(currentUser);
  }, [currentUser]);

  const handleTermSelect = (term) => {
    if (userDetails) {
      FetchReviewsByTerm(term, userDetails.university_id, navigate);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (!userDetails) {
    return <p>ユーザー情報を読み込み中...</p>;
  }

  return (
    <form className="term-search">

    <div>
      <TermSelector onTermSelect={handleTermSelect} />
    </div>
    </form >
  );
}

export default SearchTerm;
