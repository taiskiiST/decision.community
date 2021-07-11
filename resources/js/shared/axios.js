import axios from 'axios';
import { csrfToken } from './helpers';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

const statusCodesTriggeringRedirectToLogin = [401];

const statusCodesTriggeringPageReload = [419];

// Add a response interceptor
axios.interceptors.response.use((response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data

        const { data: { errorMessage } } = response;

        if (errorMessage) {
            return Promise.reject(errorMessage);
        }

        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        if (typeof error.response !== 'undefined' && error.response.status === 422) {
            const { data: { message, errors } } = error.response;
            const details = Object.keys(errors).map(key => errors[key].join(' '));

            let finalMessage = message;
            if (details.length) {
                finalMessage += ` ${details.join(' ')}`;
            }

            return Promise.reject((finalMessage));
        }

        if (typeof error.response !== 'undefined' && statusCodesTriggeringRedirectToLogin.includes(error.response.status)) {
            window.location = '/login';
        }

        if (typeof error.response !== 'undefined' && statusCodesTriggeringPageReload.includes(error.response.status)) {
            window.location.reload();
        }

        return Promise.reject(error);
    });

export const client = axios;
