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
  deleteFile(fileId) {
    return axios.delete('/api/file/' + fileId);
  }
}

const fileService = new FileService();
Object.freeze(fileService);

export default fileService;
