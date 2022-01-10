import Axios from 'axios';
import { message } from 'antd';

const axios = Axios.create({
  baseURL: process.env.MU_BASE_URL || '',
  timeout: 5000,
});

axios.interceptors.request.use((config) => {
  return config;
});

axios.interceptors.response.use(
  (response) => {
    message.info('数据获取成功');
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },

  () => {
    message.error('数据获取失败，请重试...');
  }
);

export default axios;
