import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import "../FormStyleSheets/LoginForm.css"

const API_URL = process.env.REACT_APP_API_URL;

function LoginForm({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // ローディング状態を追加

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // ローディング開始

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log("サーバーからのレスポンス:", data); // ここ追加

      if (response.ok) {
        Cookies.set('user_session', JSON.stringify(data), { expires: 7 }); // セッション情報をクッキーに保存
        onLogin(data); // 親にログイン状態を伝える
        navigate('/');

      } else {
        setError(data.error || 'ログインに失敗しました');
      }
    } catch (err) {
      console.log(err);
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div className="login-form">
          <h2>ログイン</h2>
          <div className="login-items">
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="メールアドレス" 
              disabled={loading} // ローディング中は入力できなくする
            />
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="パスワード" 
              disabled={loading} // ローディング中は入力できなくする
            />
            <button className="login-user" type="submit" disabled={loading}>
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {loading && <p>🔄 ログイン処理中です...</p>} {/* ローディング中のメッセージ */}
        </div>
      </form>
      <div className="register-user">
        <Link to="/register">新規会員登録はこちら</Link>
      </div>
    </div>
  );
}

export default LoginForm;
