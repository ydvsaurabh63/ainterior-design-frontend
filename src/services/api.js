import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('interior_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error parsing
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth Services
export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Project Services
export const projectApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  create: async (formData) => {
    const isFormData = formData instanceof FormData;
    const response = await api.post('/projects', formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },
  update: async (id, formData) => {
    const isFormData = formData instanceof FormData;
    const response = await api.put(`/projects/${id}`, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};

// Enquiry Services
export const enquiryApi = {
  create: async (enquiryData) => {
    const response = await api.post('/enquiries', enquiryData);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/enquiries', { params });
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/enquiries/${id}`, { status });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/enquiries/${id}`);
    return response.data;
  }
};

// Testimonial Services
export const testimonialApi = {
  getAll: async () => {
    const response = await api.get('/testimonials');
    return response.data;
  },
  create: async (formData) => {
    const isFormData = formData instanceof FormData;
    const response = await api.post('/testimonials', formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },
  update: async (id, formData) => {
    const isFormData = formData instanceof FormData;
    const response = await api.put(`/testimonials/${id}`, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  }
};

// Dashboard Services
export const dashboardApi = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

export default api;
