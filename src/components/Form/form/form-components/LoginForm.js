// src/components/LoginForm.jsx
import { useState } from 'react';
import { Link ,useNavigate} from "react-router-dom";
import Cookies from 'js-cookie'; // クッキー操作のため
import "../FormStyleSheets/LoginForm.css"
const API_URL = process.env.REACT_APP_API_URL;

function LoginForm({ onLogin }) {
    const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',  // 必要に応じて
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log("サーバーからのレスポンス:", data); // ここ追加

      if (response.ok) {
        // トークンなどをクッキーに保存（有効期限設定）
        Cookies.set('user_session', JSON.stringify(data), { expires: 7 }); // 7日間セッション情報を保持
        onLogin(data); // 親にログイン状態を伝える
        navigate('/');

      } else {
        setError(data.error || 'ログインに失敗しました');
      }
    } 
    catch (err) {
      console.log(err)
      setError('通信エラーが発生しました');
    }
  };

  return (
    <div className="login-container">
    <form onSubmit={handleSubmit}>
      <div className="login-form">
      <h2>ログイン</h2>
      <div className="login-items">
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="メールアドレス" />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="パスワード" />
      <button className="login-user" type="submit">ログイン</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </form>
    <div className="register-user">
    <Link to="/register">新規会員登録はこちら</Link>
    </div>
    </div>
    
  );
}

export default LoginForm;
