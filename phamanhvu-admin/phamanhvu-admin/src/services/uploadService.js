import axios from 'axios';

// services/uploadService.js
// services/uploadService.js
export const uploadBanner = async (bannerData) => {
  try {
    const formData = new FormData();
    formData.append('Name', bannerData.name);
    formData.append('Link', bannerData.link);
    formData.append('Image', bannerData.image);
    formData.append('SortOrder', bannerData.sortOrder || 0);
    formData.append('Position', bannerData.position || 'top');
    formData.append('Description', bannerData.description || '');

    const token = localStorage.getItem('token');
    const response = await fetch('https://localhost:7199/Banner', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};