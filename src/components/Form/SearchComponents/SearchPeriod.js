import { useContext, useEffect ,useState} from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from '../../../contexts/UserContext';
import FetchReviewsByPeriod from '../../Functions/FetchReviewsByPeriod';
import PeriodSelector from './Selectors/PeriodSelector'; // 追加！

function SearchPeriod(){
       const [period, setPeriod] = useState(''); // 時限の選択を管理
          const navigate = useNavigate();
          const { currentUser } = useContext(UserContext);
          const [userDetails, setUserDetails] = useState(null);
      
           useEffect(() => {
                setUserDetails(currentUser);
            }, [currentUser]);

         


  const handlePeriodChange = (event) => {
    const period = event.target.value;
    setPeriod(period);
    FetchReviewsByPeriod(period,userDetails.university_id,navigate); 
 };

 if (!currentUser) return null;
  if (!userDetails) return <p>ユーザー情報を読み込み中...</p>;
  
    return(
      <div>
      <PeriodSelector value={period} onChange={handlePeriodChange} />
    </div>
    )
}

export default SearchPeriod;