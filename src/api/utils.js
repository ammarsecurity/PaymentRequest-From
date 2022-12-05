import axiosInstance from './axiosInstance';
export const uploadPhoto = async (file, type = 'BlogPhoto') => {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('FileType', type);

  const photoResponse = await axiosInstance.post('Media', formData);
  return photoResponse;
};
