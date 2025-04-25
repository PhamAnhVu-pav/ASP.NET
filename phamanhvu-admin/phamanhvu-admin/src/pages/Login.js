import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/userService';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(formData);
      const user = response.user;
      const token = response.token;
  
      authLogin(token, user);
  
      // Xử lý redirect sau khi đăng nhập
      const redirectPath = location.state?.redirectTo || 
                         location.state?.from || 
                         (user.role === 'Admin' ? '/admin/dashboard' : '/');
      
      // Đảm bảo chuyển hướng đến trang checkout nếu có yêu cầu
      if (location.state?.redirectTo === '/checkout') {
        navigate('/checkout', { replace: true }); // Sử dụng replace để tránh quay lại login
      } else {
        navigate(redirectPath, { replace: true });
      }
      
    } catch (err) {
      setError(err.response?.data || '❌ Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Đăng nhập</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Tên đăng nhập hoặc Email:</label>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Mật khẩu:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
}

export default Login;