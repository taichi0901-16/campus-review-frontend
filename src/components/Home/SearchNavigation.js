import { Link } from 'react-router-dom';
import './SearchNavigation.css'; // CSSを別ファイルで読み込む

const SearchNavigation = () => {
  return (
    <div className="search-navigation">
        <div className='search-method'>
    各項目から探す
        </div>
      <div className="button-row">
        <div className="circle-wrapper">
          <a href="#search-offered-year" className="circle-button">年</a>
          <span className="button-label">開講年</span>
        </div>
        <div className="circle-wrapper">
          <a href="#search-department-subject" className="circle-button">学</a>
          <span className="button-label">学科</span>
        </div>
        <div className="circle-wrapper">
          <a href="#search-unit" className="circle-button">単</a>
          <span className="button-label">単位数</span>
        </div>
        <div className="circle-wrapper">
          <a href="#search-term" className="circle-button">期</a>
          <span className="button-label">期</span>
        </div>
      </div>
      <div className="button-row">
        <div className="circle-wrapper">
          <a href="#search-day" className="circle-button">曜</a>
          <span className="button-label">曜日</span>
        </div>
        <div className="circle-wrapper">
          <a href="#search-period" className="circle-button">時</a>
          <span className="button-label">時限</span>
        </div>
        <div className="circle-wrapper">
          <a href="#search-teacher" className="circle-button">教</a>
          <span className="button-label">教員</span>
        </div>
        <div className="circle-wrapper">
          <Link to="/post" className="circle-button">投</Link>
          <span className="button-label">投稿</span>
        </div>
      </div>
    </div>
  );
};

export default SearchNavigation;
