import React, { useEffect, useState } from 'react';
import { getBanners } from '../services/bannerService';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './BannerSlider.css'; // Tạo file CSS riêng nếu cần

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        setBanners(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Cấu hình slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (loading) return <div className="banner-loading">Loading banners...</div>;
  if (error) return <div className="banner-error">Error: {error}</div>;
  if (banners.length === 0) return null;

  return (
    <div className="banner-slider-container">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className="banner-slide">
            <a href={banner.link || '#'} target="_blank" rel="noopener noreferrer">
              <img 
                src={banner.imageUrl || banner.image} 
                alt={banner.name} 
                className="banner-image"
                onError={(e) => {
                  e.target.src = '/default-banner.jpg'; // Ảnh mặc định nếu lỗi
                }}
              />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;