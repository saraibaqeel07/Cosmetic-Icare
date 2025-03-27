import axios from 'axios';


export const baseUrl = import.meta.env.VITE_BASE_URL

const instance = axios.create({
    baseURL: baseUrl + '/api/',
    withCredentials: true

});

instance.interceptors.request.use((request) => {


    let token = JSON.parse(localStorage.getItem('user'))
    token = token?.token



    request.headers = {
        'Accept': "application/json, text/plain, */*",
        'Authorization': `Bearer ${token}`,

        'timezone': new Date().getTimezoneOffset(),
        'route': window.location.pathname
    }
    return request
});

instance.interceptors.response.use((response) => {
    if (response) {
        return response
    }
}, (error) =>
    Promise.reject(
        error
    )
);

export default instance;