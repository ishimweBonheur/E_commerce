import axios, { AxiosError } from 'axios';

const CLOUDINARY_CLOUD_NAME = 'du0vsc2pt';
const CLOUDINARY_UPLOAD_PRESET = 'e-commerce';
const CLOUDINARY_FOLDER = 'e-comm';

export const uploadSingleImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', CLOUDINARY_FOLDER);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error('Failed to upload image to Cloudinary');
    } else {
      throw new Error('Unexpected error during image upload');
    }
  }
};

export const uploadGalleryImages = async (files: File[]): Promise<string[]> => {
  const promises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', CLOUDINARY_FOLDER); // Add folder parameter

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error('Failed to upload image to Cloudinary');
      } else {
        throw new Error('Unexpected error during image upload');
      }
    }
  });

  try {
    const imageUrls = await Promise.all(promises);
    return imageUrls;
  } catch (error) {
    throw new Error('Failed to upload one or more gallery images');
  }
};
