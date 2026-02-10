import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('🔧 API Base URL:', API_BASE_URL);


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`➡️ ${config.method?.toUpperCase()} ${config.url}`, config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);


export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};


export const productAPI = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  getById: (id) => api.get(`/products/${id}`),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};


export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders'),
};


export const salesAPI = {
  getTodayStats: () => api.get('/sales/today'),
  getDailySales: () => api.get('/sales/daily'),
};

export default api;
