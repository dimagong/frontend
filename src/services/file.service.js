import axios from '../overrides/axios';

class FileService {
  getDFormFiles(dFormId) {
    return axios.get('/api/file/dForm/' + dFormId);
  }

  sendFile(dFormId, dataUrl, group) {
    return axios.post('/api/file/dForm/' + dFormId + '/create', {
      dataUrl,
      group
    });
  }

  changeUserAvatar(userId, formData) {
    return axios.post('/api/file/user/' + userId + '/avatar', formData);
  }

  getUserAvatar(userId) {
    return axios.get('/api/file/user/' + userId + '/avatar');
  }

  deleteFile(fileId) {
    return axios.delete('/api/file/' + fileId);
  }
}

const fileService = new FileService();
Object.freeze(fileService);

export default fileService;
