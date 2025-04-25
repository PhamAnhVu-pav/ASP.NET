// src/frontend/Header.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaBoxOpen, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaUserShield, FaSearch } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');

  const dangXuat = () => {
    logout();
    navigate('/login');
  };

  const xuLyTimKiem = (e) => {
    e.preventDefault();
    if (tuKhoaTimKiem.trim()) {
      navigate(`/products?search=${encodeURIComponent(tuKhoaTimKiem)}`);
      setTuKhoaTimKiem('');
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">🛒 <span>Shop PoBe</span></Link>
      </div>
      
      <form onSubmit={xuLyTimKiem} className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={tuKhoaTimKiem}
          onChange={(e) => setTuKhoaTimKiem(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <FaSearch />
        </button>
      </form>

      <nav className="nav">
        <Link to="/" className="nav-button"><FaHome /> Trang Chủ</Link>
        <Link to="/products" className="nav-button"><FaBoxOpen /> Sản Phẩm</Link>
        <Link to="/cart" className="nav-button"><FaShoppingCart /> Giỏ Hàng</Link>
        {isAuthenticated ? (
          <>
            <button onClick={dangXuat} className="nav-button"><FaSignOutAlt /> Đăng Xuất</button>
            {isAdmin && (
              <Link to="/admin" className="nav-button"><FaUserShield /> Quản Lý</Link>
            )}
          </>
        ) : (
          <Link to="/login" className="nav-button"><FaSignInAlt /> Đăng Nhập</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;