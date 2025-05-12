import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from '../../../../contexts/UserContext';
import "../FormStyleSheets/FeedBackForm.css"
import LoginForm from './LoginForm';
function FeedBackForm({onLogin}){
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);
const API_URL = process.env.REACT_APP_API_URL;

  // 🔑 currentUser の存在チェックとリダイレクト処理
  useEffect(() => {
    
      setUserDetails(currentUser);
    }
  , [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert('コメントを入力してください');

    const res = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment }),
    });

    if (res.ok) {
      alert('貴重なご意見ありがとうございます！');
      setComment('');
      navigate('/');
    } else {
      alert('送信に失敗しました');
    }
  };

  return (
<div className="feedback-form-container">
    {userDetails ? (
    <form onSubmit={handleSubmit} >
     
      <div className="feed-back-header">
        <h2>フォーム</h2>
      </div>
      <div className="text-area">
        <div className="message">
          追加してほしい機能や改善点などございましたら、ご記入ください。
          今後の運用の参考にさせていただきます。
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="コメントを入力してください"
          className="w-full p-2 mb-2 border rounded"
          required
        />
      </div>
      <div className="feedback-button">
      <button type="submit">送信</button>
      </div>
    </form>
    ) : (
       <div className="mypage-login">
          <LoginForm onLogin={onLogin} />
        </div> 
    )}
    </div>
  );
}

export default FeedBackForm;
