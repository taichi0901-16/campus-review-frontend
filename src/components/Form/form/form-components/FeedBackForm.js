import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import UserContext from '../../../../contexts/UserContext';
import "../FormStyleSheets/FeedBackForm.css";
import LoginForm from './LoginForm';
const API_URL = process.env.REACT_APP_API_URL;

function FeedBackForm({ onLogin }) {
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setUserDetails(currentUser);
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert('コメントを入力してください');

    try {
      const res = await axios.post(`${API_URL}/feedback`, {
        comment: comment
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.status === 201) {
        alert('貴重なご意見ありがとうございます！');
        setComment('');
        navigate('/');
      }
    } catch (err) {
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
              <p>追加してほしい機能や改善点などございましたら、ご記入ください。
              今後の運用の参考にさせていただきます。</p><br/>
              <div className="sub-message">
              <h3>今後実装予定の機能</h3>
              <p>・各レビューのブックマーク機能</p>
              <p>・レビューの評価順、投稿順での並び替え機能</p>
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="コメントを入力してください"
              className="w-full p-2 mb-2 border rounded"
              required
            />
          </div>
            <button className="feedback-button" type="submit">送信</button>
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
