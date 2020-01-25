import axios from 'axios';

export default axios.create({
  //baseURL: 'http://localhost/api',
  // validateStatus: (status) => status >=200 && status < 500
})