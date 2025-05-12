import { Link, useLocation } from "react-router-dom";
import "./FooterNav.css";
import { useState } from "react";

function FooterNav({ isLoggedIn, onLogout }) {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive); // トグル
  };

  return (
    <nav className="footer-nav">
      <div>
        <Link to="/">
        <h4 className="logo">キャンパスレポート</h4>
        </Link>
      </div>
      <div className={`burger ${isActive ? "toggle" : ""}`} onClick={handleClick}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
      <ul className={`nav-links ${isActive ? "nav-active" : ""}`}>
        {["ホーム", "マイページ", "口コミを投稿", "フォーム" , isLoggedIn ? "ログアウト" : "ログイン"].map(
          (text, index) => (
            <li
              key={index}
              style={{ transitionDelay: `${isActive ? index * 0.2 : 0}s` }}
              className={isActive ? "fade" : ""}
            >
              {text === "ログアウト" ? (
                <Link
                  to="/"
                  onClick={() => {
                    onLogout();
                    setIsActive(false);
                  }}
                  className="nav-link"
                >
                  {text}
                </Link>
              ) : (
                <Link
                  to={
                    text === "ホーム"
                      ? "/"
                      : text === "マイページ"
                      ? "/mypage"
                      : text === "口コミを投稿"
                      ? "/post"
                      : text === "フォーム"
                      ? "/feedback"
                      : "/login"
                  }
                  onClick={handleClick} // ← ここでメニューを閉じる
                  className={location.pathname === "/" && text === "ホーム" ? "active" : ""}
                >
                  {text}
                </Link>
              )}
            </li>
          )
        )}
      </ul>
    </nav>
  );
}

export default FooterNav;
