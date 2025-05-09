import { Link } from "react-router-dom";
import './SearchBar.css';

const SearchBar = () => {
  return (
    <Link to="/search">

    <div className="search-wrapper">
      <div className="search-box">
        <span className="search-placeholder">まとめて検索...</span>
          <div className="search-button">検索</div>

      </div>
    </div>
    </Link>
  );
};

export default SearchBar;

