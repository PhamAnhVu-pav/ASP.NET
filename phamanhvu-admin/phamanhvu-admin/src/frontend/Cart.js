import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import Header from '../components/Header.js';
import './Cart.css';
import Footer from './Footer';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra nếu người dùng vừa đăng nhập xong để quay lại thanh toán
  useEffect(() => {
    if (location.state?.fromCheckout && isAuthenticated && cart.length > 0) {
      handleCheckout();
    }
  }, [isAuthenticated, location.state]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Lưu giỏ hàng hiện tại vào localStorage
      localStorage.setItem('pendingCart', JSON.stringify(cart));
      navigate('/login', { 
        state: { 
          redirectTo: '/checkout',
          from: '/cart'
        },
        replace: true // Sử dụng replace để tránh tạo thêm history entry
      });
      return;
    }
    
    // Nếu đã đăng nhập thì chuyển thẳng đến checkout
    navigate('/checkout', { replace: true });
  };

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-container">
        <div className="cart-header">
          <Link to="/" className="back-link">
            <i className="fas fa-arrow-left"></i> Tiếp tục mua sắm
          </Link>
          <h1 className="cart-title">Giỏ hàng của bạn</h1>
          {cart.length > 0 && (
            <div className="cart-count">{cart.length} sản phẩm</div>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="cart-content">
          {cart.length > 0 ? (
            <>
              <div className="cart-items">
                <div className="cart-items-header">
                  <div className="header-product">Sản phẩm</div>
                  <div className="header-price">Đơn giá</div>
                  <div className="header-quantity">Số lượng</div>
                  <div className="header-total">Thành tiền</div>
                  <div className="header-action"></div>
                </div>
                
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-product">
                      <img
                        src={item.image || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <div className="product-info">
                        <h3>{item.name}</h3>
                        {item.color && <p>Màu: {item.color}</p>}
                        {item.size && <p>Kích thước: {item.size}</p>}
                      </div>
                    </div>
                    <div className="item-price">
                      {item.price.toLocaleString('vi-VN')}₫
                    </div>
                    <div className="item-quantity">
                      <div className="quantity-control">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="item-total">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </div>
                    <div className="item-action">
                      <button
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                        title="Xóa sản phẩm"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-card">
                  <h2>Tóm tắt đơn hàng</h2>
                  <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{getTotalPrice().toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="summary-row">
                    <span>Giảm giá:</span>
                    <span>0₫</span>
                  </div>
                  <div className="summary-row total">
                    <span>Tổng tiền:</span>
                    <span>{getTotalPrice().toLocaleString('vi-VN')}₫</span>
                  </div>
                  <button 
  className="checkout-button" 
  onClick={handleCheckout}
  disabled={isCheckingOut || cart.length === 0}
>
  {isCheckingOut ? 'Đang xử lý...' : 'THANH TOÁN'}
</button>
                  <div className="payment-methods">
                    <p>Chấp nhận thanh toán:</p>
                    <div className="payment-icons">
                      <i className="fab fa-cc-visa"></i>
                      <i className="fab fa-cc-mastercard"></i>
                      <i className="fas fa-qrcode"></i>
                      <i className="fas fa-money-bill-wave"></i>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <div className="empty-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h3>Giỏ hàng của bạn đang trống</h3>
              <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
              <Link to="/" className="continue-shopping">
                <i className="fas fa-arrow-left"></i> Mua sắm ngay
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;