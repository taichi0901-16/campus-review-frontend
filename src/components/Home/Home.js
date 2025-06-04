import { useContext, useEffect ,useState} from 'react';
import SearchBar from "./SearchBar";
import CoursesContext from '../../contexts/CourseContext'; // パス注意！
import ReviewsContext from '../../contexts/reviewContext'; // パス注意！
import TeachersContext from '../../contexts/TeacherContext'; // パス注意！
import { Link } from "react-router-dom";
import SearchOffered_year from '../Form/SearchComponents/SearchOffered_year';
import SearchDepartment_subject from '../Form/SearchComponents/SearchDepartment_subject';

import SearchUnit from '../Form/SearchComponents/SearchUnit';
import SearchTerm from '../Form/SearchComponents/SearchTerm';
import SearchDay from '../Form/SearchComponents/SearchDay';
import SearchPeriod from '../Form/SearchComponents/SearchPeriod';
import "./Home.css"
import SearchTeacher from '../Form/SearchComponents/SearchTeacher';
import SearchNavigation from './SearchNavigation'; // パスは適宜調整

import NewReviewsPage from './NewReviewsPage';
import LogRegBtn from './LogRegBtn';
const API_URL = process.env.REACT_APP_API_URL;

const Home = ({isLoggedIn}) => {

    const { courses, setCourses } = useContext(CoursesContext); // ← ここ重要
    const { reviews, setReviews } = useContext(ReviewsContext); // ← ここ重要
    const { teachers, setTeachers } = useContext(TeachersContext); // ← ここ重要
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchAllData = async () => {
    if (!isLoggedIn) {
      return; // ログインしていない場合、データ取得をスキップ
    }

    try {
      const [response_review, response_course, response_teacher] = await Promise.all([
        fetch(`${API_URL}/reviews`),
        fetch(`${API_URL}/courses`),
        fetch(`${API_URL}/teachers`)
      ]);

      const [data_review, data_course, data_teacher] = await Promise.all([
        response_review.json(),
        response_course.json(),
        response_teacher.json()
      ]);

      setReviews(data_review);
      setCourses(data_course);
      setTeachers(data_teacher);
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    } finally {
      setLoading(false); // 全データ取得後にローディング終了
    }
  };

  fetchAllData();
}, [isLoggedIn]); // isLoggedInが変更されるたびに再実行


if (loading) {
  return (
    <div className="overlay">
      <div className="spinner"></div>
      <p>読み込み中...</p>
    </div>
  );
}

  return (
<div id="container">
  {/* 背景画像セクション */}
  <div className="search-bar">
    <SearchBar />
  </div>
  
  <div className="post-review"><Link  to="/post">口コミを投稿する</Link></div>
  <div className="button-container">
  <SearchNavigation />
</div>

  {/* 新着求人セクション */}

 <NewReviewsPage />


  <div id="search-offered-year">
    <SearchOffered_year />
  </div>
  <div id="search-department-subject">
    <SearchDepartment_subject />
  </div>
  <div id="search-unit">
    <SearchUnit />
  </div>
  <div id="search-term">
    <SearchTerm />
  </div>
  <div id="search-day">
    <SearchDay />
  </div>
  <div id="search-period">
    <SearchPeriod />
  </div>
  <div id="search-teacher">
    <SearchTeacher />
  </div>
     
  <LogRegBtn isLoggedIn={isLoggedIn} />

  
</div>
  );
};

export default Home;
