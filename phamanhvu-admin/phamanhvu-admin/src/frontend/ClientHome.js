// src/frontend/ClientHome.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import Header from '../components/Header';
import Footer from './Footer';
import './ClientHome.css';
import BannerSlider from '../components/BannerSlider';
const ClientHome = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await getCategories();
        const productRes = await getProducts();

        setCategories(Array.isArray(categoryRes) ? categoryRes : categoryRes.data || []);
        setProducts(Array.isArray(productRes) ? productRes : productRes.data || []);
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    navigate(categoryId === 'all' ? '/' : `/category/${categoryId}`);
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="client-home">
      <Header />
      {/* Thêm BannerSlider vào đầu trang */}
      <BannerSlider />
      <div className="container">
        <div className="category-filter">
          <label htmlFor="category">Danh mục:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="all">Tất cả</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <h1 className="welcome-title">🛍️ Chào mừng đến với cửa hàng của chúng tôi</h1>

        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={product.image || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <p className="price">{product.price?.toLocaleString('vi-VN')} VNĐ</p>
              </div>
            ))
          ) : (
            <div className="no-product">Không tìm thấy sản phẩm nào!</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientHome;
