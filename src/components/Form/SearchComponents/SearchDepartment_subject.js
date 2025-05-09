import { useContext, useEffect, useState } from 'react';
import UserContext from '../../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import FetchReviewsByDandS from '../../Functions/FetchReviewsByDandS';
import FacultyDepartmentSelector from './Selectors/FacultyDepartmentSelector';

function SearchDepartment_subject() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setUserDetails(currentUser);
  }, [currentUser]);

  const handleDepartmentSelect = (departmentId) => {
    if (departmentId && userDetails) {
      FetchReviewsByDandS(departmentId, navigate);
    }
  };

  if (!currentUser) return null;
  if (!userDetails) return <p>ユーザー情報を読み込み中...</p>;

  return (
    <div>
      <form className="department-search">
        <FacultyDepartmentSelector
          universityId={userDetails.university_id}
          onDepartmentSelect={handleDepartmentSelect}
        />
      </form>
    </div>
  );
}

export default SearchDepartment_subject;
