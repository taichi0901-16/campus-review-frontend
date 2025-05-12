import { Link } from 'react-router-dom';
import './SearchNavigation.css';

const SearchNavigation = () => {
  // scrollIntoView を使って対象のIDへスムーズスクロール
  const scrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="search-navigation">
      <div className='search-method'>
        各項目から探す
      </div>

      <div className="button-row">
        <div className="circle-wrapper">
          <button onClick={() => scrollToId("search-offered-year")} className="circle-button">年</button>
          <span className="button-label">開講年</span>
        </div>
        <div className="circle-wrapper">
          <button onClick={() => scrollToId("search-department-subject")} className="circle-button">学</button>
          <span className="button-label">学科</span>
        </div>
        <div className="circle-wrapper">
          <button onClick={() => scrollToId("search-unit")} className="circle-button">単</button>
          <span className="button-label">単位数</span>
        </div>
        <div className="circle-wrapper">
          <button onClick={() => scrollToId("search-term")} className="circle-button">期</button>
          <span className="button-label">期</span>
        </div>
      </div>

      <div className="button-row">
        <div className="circle-wrapper">
          <button onClick={() => scrollToId("search-day")} className="circle-button">曜</button>
          <span className="button-label">曜日</span>
        </div>
        <div className="circle-wrapper">
          <button onClick={() => scrollToId("search-period")} className="circle-button">時</button>
          <span className="button-label">時限</span>
        </div>
        <div className="circle-wrapper">
          <button onClick={() => scrollToId("search-teacher")} className="circle-button">教</button>
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
