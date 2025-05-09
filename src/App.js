// App.js
import  { useState, useEffect } from "react";
import {  Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";

import LoginForm from "./components/Form/form/form-components/LoginForm";
import RegisterForm from "./components/Form/form/form-components/RegisterForm";
import PostForm from "./components/Form/form/form-components/PostForm"
import RegisterClassesForm from "./components/Form/form/form-components/RegisterClassesForm";
import SearchForm from "./components/Form/form/form-components/SearchForm";

import FooterNav from "./components/Navbar/FooterNav";

import Mypage from "./components/Mypage/MyPage-components/Mypage"
import  CoursesContext  from './contexts/CourseContext';
import UserContext from './contexts/UserContext';
import ReviewsContext from './contexts/reviewContext';
import TeachersContext from './contexts/TeacherContext';

// import './App.css';
import { AnimatePresence} from "framer-motion";
import { useLocation } from 'react-router-dom';
import {motion} from "framer-motion";

import SearchResult from "./components/Result/SearchResult"
import UserInformation from "./components/Mypage/MyPage-components/UserInformation"
import UserUpdate from "./components/Mypage/MyPage-components/UserUpdate"
import ReviewInformation from "./components/Home/ReviewInformation"
import ReviewUpdate from "./components/Home/ReviewUpdate"
import ReviewDetails from "./components/Home/ReviewDetails"

import UserDelete from "./components/Mypage/MyPage-components/UserDelete"
import ReviewsByIds from "./components/Home/ReviewsByIds"

import Cookies from 'js-cookie';  // js-cookieをインポート


function App() {


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [teachers, setTeachers] = useState([]);


  const location=useLocation();

      useEffect(() => {
        const userData = Cookies.get("user_session"); // cookiesからユーザー情報を取得
        console.log("HELLO" , userData)
        if ("userData",userData) {
          setIsLoggedIn(true);
          
          setCurrentUser(JSON.parse(userData)); // cookiesから取得したユーザー情報を復元
        }
      }, []);



      const handleLogout = () => {
        Cookies.remove("user_session"); // cookiesからユーザー情報を削除
        setIsLoggedIn(false);
        setCurrentUser(null);
      };
  return (
    <CoursesContext.Provider value={{ courses, setCourses }}>

    <UserContext.Provider value={{ currentUser, setCurrentUser }}>

    <ReviewsContext.Provider value={{ reviews, setReviews }}>

    <TeachersContext.Provider value={{ teachers, setTeachers }}>

    <motion.div classname="App"
    initial={{opacity : 0}}
    animate={{opacity : 1}}
    transition={{duration : 1.6}}>

      <AnimatePresence>

< FooterNav isLoggedIn={isLoggedIn} onLogout={handleLogout} />




      <Routes location={location} key={location.pathname}>

        <Route path="/" element={<Home isLoggedIn={isLoggedIn}/>} />
        <Route path="/login" element={<LoginForm onLogin={(user) => {setIsLoggedIn(true);setCurrentUser(user);}} />}/>        
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/mypage" element={<Mypage onLogin={(user) => {setIsLoggedIn(true);setCurrentUser(user);}} />} />
        <Route path="/post" element={<PostForm />} />
        <Route path="/registerclasses" element={<RegisterClassesForm />} />
        <Route path="/search" element={<SearchForm />} />
        <Route path="/search_result" element={<SearchResult />} />
        <Route path="/user_information" element={<UserInformation />} />
        <Route path="/user_update" element={<UserUpdate />} />
        <Route path="/review_information/:id" element={<ReviewInformation />} />
        <Route path="/review_update/:id" element={<ReviewUpdate />} />
        <Route path="/user_delete" element={<UserDelete />} />
        <Route path="/reviews_by_ids" element={<ReviewsByIds />} />
        <Route path="/review_details/:review_id" element={<ReviewDetails />} />




      </Routes>
      
    </AnimatePresence>
    </motion.div>
    </TeachersContext.Provider>
    </ReviewsContext.Provider>
    </UserContext.Provider>
    </CoursesContext.Provider>


  );
}

export default App;
