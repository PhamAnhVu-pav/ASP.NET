import api from "./api";

export const getBanners = async () => {
  try {
    const response = await api.get('/Banner');
    return response.data;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách banner:", err.response?.data || err.message);
    throw err;
  }
};

export const getBanner = async (id) => {
  try {
    const response = await api.get(`/Banner/${id}`);
    return response.data;
  } catch (err) {
    console.error("Lỗi khi lấy banner:", err.response?.data || err.message);
    throw err;
  }
};

export const createBanner = async (formData) => {
  try {
    const response = await api.post('/Banner', formData);
    return response.data;
  } catch (err) {
    console.error("Lỗi khi tạo banner:", err.response?.data || err.message);
    throw err;
  }
};

export const updateBanner = async (id, formData) => {
  try {
    const response = await api.put(`/Banner/${id}`, formData);
    return response.data;
  } catch (err) {
    console.error("Lỗi khi cập nhật banner:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteBanner = async (id) => {
  try {
    const response = await api.delete(`/Banner/${id}`);
    return response.data;
  } catch (err) {
    console.error("Lỗi khi xóa banner:", err.response?.data || err.message);
    throw err;
  }
};