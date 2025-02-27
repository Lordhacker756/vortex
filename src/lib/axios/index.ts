import axios from 'axios';

let prod = true
const baseURL = prod ? 'https://vortex-api-koba.onrender.com' : 'http://localhost:9000';

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Remove auth token injection since we're using cookies
axiosInstance.interceptors.request.use((config) => {
    // Log request details
    console.log(`🚀 ${config.method?.toUpperCase()} Request:`, config.url);
    if (config.data) console.log('📦 Request Body:', config.data);

    return config;
}, (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
});

// Response interceptor
axiosInstance.interceptors.response.use((response) => {

    console.log('✅ Response:', {
        status: response.status,
        data: response.data
    });

    return response;
}, async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
        // Clear auth token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');

        // Redirect to login
        window.location.href = '/login';
    }

    console.error('❌ Response Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message
    });

    error.status = error.response?.status;
    error.data = error.response?.data;
    error.message = error.response?.data?.message;

    return Promise.reject(error);
});

export default axiosInstance;