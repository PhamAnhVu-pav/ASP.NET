// src/frontend/ProductDetail.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { CartContext } from '../context/CartContext';
import Header from '../components/Header.js';
import './ProductDetail.css';
import Footer from './Footer'; // Import Footer

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Thêm kiểm tra CartContext
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    console.error("CartContext is undefined. Ensure ProductDetail is wrapped in CartProvider.");
  }
  const { addToCart } = cartContext || {};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data || response);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        setError(err.message || 'Không thể tải sản phẩm.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!addToCart) {
      console.error("addToCart is not available. CartContext may not be set up correctly.");
      return;
    }
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      alert(`${product.name} đã được thêm vào giỏ hàng!`);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Sản phẩm không tồn tại!</div>;

  return (
    <div className="product-detail">
  <Header />
  <div className="product-detail-container">
    <Link to="/" className="back-link">← Quay lại</Link>
    <div className="product-detail-content">
      <div className="image-section">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="product-detail-image"
        />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price">{product.price?.toLocaleString('vi-VN')} VNĐ</p>
        <p className="description">{product.description}</p>
        <p className="category">
          <strong>Danh mục:</strong> {product.category?.name || 'Không xác định'}
        </p>
        <button className="add-to-cart" onClick={handleAddToCart}>
          🛒 Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  </div>
  <Footer />
</div>

  );
};

export default ProductDetail;