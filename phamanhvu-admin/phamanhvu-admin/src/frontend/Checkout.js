// src/frontend/Checkout.js
import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Checkout.css'; // Thêm file CSS nếu muốn tách

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          redirectTo: '/checkout',
          from: location.pathname
        }
      });
      return;
    }

    if (cart.length === 0) {
      const pendingCart = JSON.parse(localStorage.getItem('pendingCart'));
      if (!pendingCart || pendingCart.length === 0) {
        navigate('/cart');
        return;
      }
    }
  }, [isAuthenticated, isLoading, cart, navigate, location]);

  const handlePayment = async () => {
    try {
      alert("Thanh toán thành công!");
      clearCart();
      navigate('/cart');
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div className="checkout-page">
      <Header />
      <div className="checkout-container">
        <h1>Thanh Toán</h1>
        <div className="checkout-box">
          <h2>Thông tin đơn hàng</h2>
          {cart.map(item => (
            <div key={item.id} className="checkout-item">
              <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} />
              <div className="item-info">
                <p className="item-name">{item.name}</p>
                <p>Số lượng: {item.quantity || 1}</p>
                <p>Giá: {(item.price * (item.quantity || 1)).toLocaleString('vi-VN')} VNĐ</p>
              </div>
            </div>
          ))}
          <div className="checkout-total">
            <h3>Tổng cộng: {totalPrice.toLocaleString('vi-VN')} VNĐ</h3>
          </div>
          <button className="checkout-button" onClick={handlePayment}>
            Xác nhận thanh toán
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
