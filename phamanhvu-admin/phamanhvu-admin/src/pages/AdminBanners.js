// src/pages/AdminBanners.js
import React, { useEffect, useState } from 'react';
import { uploadImage } from '../services/uploadService';
import './AdminBanners';
import api from ".././services/api";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../services/bannerService';

function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '', link: '', image: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  // Sửa lại hàm fetchBanners để xử lý dữ liệu trả về
  const fetchBanners = async () => {
    try {
      console.log("Đang gọi API banners...");
      const response = await api.get('/Banner');
      console.log("Response nhận được:", response);
      setBanners(response.data);
    } catch (err) {
      console.error("Chi tiết lỗi:", {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        data: err.response?.data,
        config: err.config
      });
      setError('Không thể tải banner');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Name', formData.name);
      formDataToSend.append('Link', formData.link);
      formDataToSend.append('SortOrder', formData.sortOrder || 0);
      formDataToSend.append('Position', formData.position || 'top');
      formDataToSend.append('Description', formData.description || '');
      
      if (selectedFile) {
        formDataToSend.append('Image', selectedFile);
      }
  
      if (isEditing) {
        await updateBanner(formData.id, formDataToSend);
      } else {
        await createBanner(formDataToSend);
      }
  
      // Làm mới danh sách và reset form
      fetchBanners();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.title || err.message || 'Có lỗi xảy ra');
      console.error('Lỗi khi lưu banner:', err);
    }
  };
  const handleEdit = (banner) => {
    setFormData(banner);
    setIsEditing(true);
    setShowForm(true);
    setPreviewImage(banner.image); // Show current image
    setSelectedFile(null); // Reset selected file
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa banner này?')) {
      try {
        await deleteBanner(id);
        fetchBanners();
      } catch (err) {
        setError('Lỗi khi xóa banner');
      }
    }
  };

  const resetForm = () => {
    setFormData({ id: null, name: '', link: '', image: '' });
    setIsEditing(false);
    setPreviewImage('');
    setSelectedFile(null);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) resetForm();
  };

  return (
    <div className="admin-categories">
      <h2>Quản lý Banner</h2>

      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? 'Ẩn Form' : 'Thêm banner'}
      </button>

      {showForm && (
        <div className="form-card">
          <h3>{isEditing ? 'Sửa banner' : 'Thêm banner'}</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
  <label>Tên:</label>
  <input type="text" name="name" value={formData.name} onChange={handleChange} required />

  <label>Link:</label>
  <input type="text" name="link" value={formData.link} onChange={handleChange} required />

  <label>Ảnh:</label>
  <input type="file" accept="image/*" onChange={handleImageChange} />

  {previewImage || formData.image ? (
  <img
    src={previewImage || formData.image}
    alt={formData.name}
    className="product-image"
    style={{ 
      width: '100px', 
      height: 'auto',
      marginTop: '10px',
      border: '1px solid #ddd'
    }}
    onError={(e) => {
      e.target.src = '/placeholder-image.jpg'; // Ảnh placeholder khi lỗi
      console.error(`Failed to load image: ${previewImage || formData.image}`);
    }}
  />
) : (
  <div className="image-placeholder">Không có ảnh</div>
)}

  <div className="form-actions">
    <button type="submit">{isEditing ? 'Cập nhật' : 'Thêm'}</button>
    <button type="button" onClick={toggleForm}>Hủy</button>
  </div>
</form>

        </div>
      )}

      <div className="table-card">
        <h3>Danh sách banner</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Link</th>
              <th>Ảnh</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
{banners.map((banner) => (
  <tr key={banner.id}>
    <td>{banner.id}</td>
    <td>{banner.name}</td>
    <td>{banner.link}</td>
    <td>
      <img 
        src={banner.imageUrl || banner.image} // Sử dụng cả 2 trường hợp
        alt={banner.name} 
        style={{ width: '100px' }} 
        onError={(e) => e.target.src = '/placeholder-image.jpg'}
      />
    </td>
    <td>
      <button onClick={() => handleEdit(banner)}>Sửa</button>
      <button onClick={() => handleDelete(banner.id)}>Xóa</button>
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBanners;
