import { useContext, useState, useEffect } from 'react';
import UserContext from '../../../contexts/UserContext';
import '../MyPage-StyleSheets/userdelete_check.css';
import Cookies from 'js-cookie';  // js-cookieをインポート
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

function UserDelete() {
  const { currentUser , setCurrentUser} = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    setUserDetails(currentUser);
  }, [currentUser]);

  if (!currentUser) return <p>ログインしていません。</p>;
  if (!userDetails) return <p>ユーザー情報を読み込み中...</p>;

  const handleDelete = async () => {
    // バックエンドにパスワードと一緒に削除リクエスト送信（例）
    const response = await fetch(`${API_URL}/user/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userDetails.email, password }),
    });
console.log(response)
    if (response.ok) {
      alert("削除完了");
      setCurrentUser(null);
      Cookies.remove("user_session"); // cookiesからユーザー情報を削除
      navigate("/");      // トップページに遷移
      window.location.reload();  // ページをリロード      // 例: ログアウト処理やトップページへ遷移など
    } else {
      alert("パスワードが違います");
    }
  };

  return (
    <div className="user-delete-container">

  
    <button className="delete-btn" onClick={() => setShowModal(true)}>削除</button>
  
    {showModal && (
      <div className="modal">
        <div className="modal-content">
          <h3>アカウント削除確認</h3>
          <p>パスワードを入力してください。</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="パスワード"
          />
          <br />
          <button onClick={handleDelete}>削除実行</button>
          <button onClick={() => setShowModal(false)}>キャンセル</button>
        </div>
      </div>
    )}
  </div>
  
  );
}

export default UserDelete;
