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

  useEffect(() => {

    const fetchReviews = async () => {

      try {

        const response_review = await fetch(`${API_URL}/reviews`);
        const data_review = await response_review.json();
        setReviews(data_review)

      } catch (error) {
        console.error("授業情報の取得に失敗しました", error);
      }
  };
    
    fetchReviews()

    const fetchCourses = async () => {

        try {
          const response_course = await fetch(`${API_URL}/courses`);
          const data_course = await response_course.json();
          setCourses(data_course)

        } catch (error) {
          console.error("授業情報の取得に失敗しました", error);
        }
    };

    fetchCourses();

    const fetchTeachers = async () => {

      try {
        const response_teacher = await fetch(`${API_URL}/teachers`);
        const data_teacher = await response_teacher.json();
        setTeachers(data_teacher)

      } catch (error) {
        console.error("授業情報の取得に失敗しました", error);
      }
  };

  fetchTeachers();
  
  }, []);



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
