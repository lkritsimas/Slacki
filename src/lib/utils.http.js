const _axios = require("axios");

// Create
const axios = _axios.create();

// Add a response interceptor
axios.interceptors.response.use(
    // Any status code that lie within the range of 2xx cause this function to trigger
    response => response,
    error => {
        if (
            error.config.hasOwnProperty("errorHandle") &&
            error.config.errorHandle === false
        ) {
            return Promise.reject(error);
        }

        // Any status codes that falls outside the range of 2xx cause this function to trigger
        console.log(
            `${error.config.method.toUpperCase()} ${error.config.url}\n${
                error.response.status
            } ${error.response.statusText}`
        );

        return error;
    }
);

module.exports = {
    axios
};
