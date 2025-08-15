import api from './axios';

export async function uploadFile(file, fileType) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    const response = await api.post('files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('File uploaded successfully:', response.data);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to upload file');
    }
    throw err;
  }
}

export async function deleteFile(fileId) {
  try {
    const response = await api.delete(`files/delete/${fileId}`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to delete file');
    }
    throw err;
  }
}

