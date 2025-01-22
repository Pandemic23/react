import React, { useState } from 'react';
import '../css/LoginForm.css';
import { blogApi } from '../services/api';

const LoginForm = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        await blogApi.auth.signUp(formData.email, formData.password);
        alert('회원가입이 완료되었습니다. 이메일을 확인해주세요.');
        setIsSignUp(false);
      } else {
        await blogApi.auth.signIn(formData.email, formData.password);
        onLoginSuccess();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isSignUp ? '회원가입' : '로그인'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          {isSignUp ? '가입하기' : '로그인'}
        </button>

        <p className="toggle-form">
          {isSignUp ? '이미 계정이 있으신가요? ' : '계정이 없으신가요? '}
          <button
            type="button"
            className="toggle-button"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? '로그인' : '회원가입'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm; 