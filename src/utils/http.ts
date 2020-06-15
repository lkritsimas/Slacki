import _axios from "axios";

export const axios = _axios.create();

// Add a response interceptor
// axios.interceptors.response.use(
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     response => response,
//     error => {
//         console.log(
//             `${error.config.method.toUpperCase()} ${error.config.url}${
//                 error.response ? `\n${error.response.status} ${error.response.statusText}` : ''
//             }`
//         );

//         if (error.config.hasOwnProperty('errorHandle') && error.config.errorHandle === false) {
//             return Promise.reject(error);
//         }
//     }
// );

export default axios;
