import axios, { AxiosError } from 'axios';

interface ErrorResponse {
    code: string;
    message: string;
    timestamp: string;
}

const baseUrl = "http://localhost:9000";

const axiosInstance = axios.create({
    baseURL: baseUrl,
    // Enable sending cookies with requests
    withCredentials: true
});

// Request interceptor for logging
axiosInstance.interceptors.request.use((config) => {
    console.log('\n🚀 Request:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        data: config.data,
        timestamp: new Date().toISOString()
    });
    return config;
});

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('\n✅ Response:', {
            status: response.status,
            data: response.data,
            timestamp: new Date().toISOString()
        });
        return response;
    },
    (error: AxiosError) => {
        const errorResponse: ErrorResponse = {
            code: error.response?.status?.toString() || 'UNKNOWN',
            message: error.response?.data?.message || error.message,
            timestamp: new Date().toISOString()
        };
        console.error('\n❌ Error:', errorResponse);
        if (errorResponse.code == "401") {
            axiosInstance.post('api/auth/logout').then(() => {
                window.location.href = '/login';
            })
        }
        return Promise.reject(errorResponse);
    }
);

export default axiosInstance;