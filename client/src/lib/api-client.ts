
import axios, { AxiosHeaders } from 'axios';
import type { IFingerPrint } from './device-fingerprint';

// Create an Axios instance with default config
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    if (config.data instanceof FormData && config.headers) {
      (config.headers as AxiosHeaders).set('Content-Type', 'multipart/form-data');
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export const api = {
  joinWaitlist: (email: string) => apiClient.post('/join-waitlist', { email }),
  trackUser: (fingerprint: IFingerPrint) => apiClient.post('/track-user', { fingerprint }),
  viewPresenting: (hash: string) => apiClient.post('/viewed-presenting', { hash }),
  viewCount: () => apiClient.get('/view-count'),
};
