import Axios from "axios";

const axios = Axios.create({
  baseURL: 'http://192.168.100.111:3181' || "",
  timeout: 5000,
});

axios.interceptors.request.use((config) => {
  return config;
});

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },

  (error) => {
    console.log(error);
  }
);

export default axios;