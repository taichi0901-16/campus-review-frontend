import { useContext, useEffect, useState } from 'react';
import UserContext from '../../../contexts/UserContext';
import TeachersContext from '../../../contexts/TeacherContext';
import { useNavigate } from "react-router-dom";
import FetchReviewsByTeacher from '../../Functions/FetchReviewsByTeacher';
import TeacherSelector from './Selectors/TeacherSelector';

function SearchTeacher() {
  const navigate = useNavigate();
  const { teachers } = useContext(TeachersContext); // 教員のリストを取得
  const { currentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setUserDetails(currentUser);
  }, [currentUser]);

  const handleTeacherSelect = (teacherId) => {
    if (userDetails) {
      FetchReviewsByTeacher(teacherId, userDetails.university_id, navigate);
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
      <form className="teacher-search">
        <TeacherSelector
          teachers={teachers}
          onTeacherSelect={handleTeacherSelect}
          universityId={userDetails.university_id}
        />
      </form>
    </div>
  );
}

export default SearchTeacher;
