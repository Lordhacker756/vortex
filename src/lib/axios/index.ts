import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to inject auth token
// Request interceptor
axiosInstance.interceptors.request.use((config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    // If token exists, add it to headers
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log({ config })

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
    console.error('❌ Response Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
    });

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }

        // Make a request to clear the cookie
        try {
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
        } catch (logoutError) {
            console.error('Error during logout:', logoutError);
        }

        // Redirect to login page
        window.location.href = '/login';
    }

    return Promise.reject(error);
});

export default axiosInstance;