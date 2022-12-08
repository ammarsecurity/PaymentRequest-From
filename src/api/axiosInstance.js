// Axios
import axios from 'axios';
import Swal from 'sweetalert2';
import i18n from '@/locales/i18n';
//const baseURL = 'https://localhost:7219/api/';
const baseURL = 'https://accounter-api.lab-logic.com/api/';
// Axios
const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(
  (response) => {
    const lang = i18n.global.locale;
    let temp = response.data;
    const haveData =
      typeof response.data.data !== 'undefined' &&
      Array.isArray(response.data.data);
    if (
      haveData
        ? temp.data.some((e) =>
            Object.keys(e).some((s) =>
              s.toLowerCase().endsWith(lang.toLowerCase())
            )
          )
        : Object.keys(temp).some((e) =>
            e.toLowerCase().endsWith(lang.toLowerCase())
          )
    ) {
      if (!haveData) {
        for (const key in temp) {
          if (key.endsWith(lang)) {
            const keyName = key.split('_')[0];
            temp[keyName] = temp[key];
          }
        }
      } else {
        temp.data = temp.data.map((obj) => {
          for (const key in obj) {
            if (key.endsWith(lang)) {
              const keyName = key.split('_')[0];
              obj[keyName] = obj[key];
            }
          }
          return obj;
        });
      }
    }
    response.data = temp;
    return response;
  },
  (error) => {
    // if (error.response.status === 401) {
    //   window.location.href = '/login';
    //   Swal.fire('انتهت الجلسة');
    // } else if (error.response.status === 413) {
    //   Swal.fire({
    //     title: 'Error',
    //     text: 'الملف كبير',
    //     icon: 'error',
    //     confirmButtonColor: '#ef4444',
    //     confirmButtonText: 'Close',
    //   });
    // }
  }
);
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    config.baseURL = baseURL;
    config.headers['Authorization'] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error), (window.location.href = '/login');
  }
);
export { axiosInstance, baseURL };
