import { useContext, useState, useEffect } from 'react';
import UserContext from '../../../contexts/UserContext';
import {  Link } from "react-router-dom";
import "../MyPage-StyleSheets/UserInformation.css"
import '../MyPage-StyleSheets/userdelete_check.css';
import Cookies from 'js-cookie';  // js-cookieをインポート
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

function UserInformation() {
    const { currentUser ,setCurrentUser} = useContext(UserContext);
    const [userDetails, setUserDetails] = useState(null);
const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

         useEffect(() => {
              setUserDetails(currentUser);
          }, [currentUser]);
    
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


          if (!currentUser) {
            return <p>ログインしていません。</p>;
          }
        
          // データがまだ取得されていない場合はローディングメッセージを表示
          if (!userDetails) {
            return <p>ユーザー情報を読み込み中...</p>;
          }
        
  
    return (
      <div className="user-info-container">
      <p className="user-department">
        {userDetails ? userDetails["department"] : "読み込み中..."}
      </p>
    
      <div className="user-links">
        <Link to="/user_update" className="user-link">ユーザ情報の編集</Link>
        <button onClick={() => setShowModal(true)} className="user-link delete">利用解除または削除</button>
      </div>


{/* モーダル部分 */}
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
          
<div className="modal-button-group">
  <button className="delete-btn" onClick={handleDelete}>削除実行</button>
  <button className="modal-cancel-btn" onClick={() => setShowModal(false)}>キャンセル</button>
</div>

        </div>
      </div>
    )}
    </div>
    

      
    );
  }
  
  export default UserInformation;