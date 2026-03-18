import axios from 'axios';
import { getAuthToken } from './authToken';

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
const NAGER_DATE_API_BASE = (import.meta.env.VITE_NAGER_DATE_API_URL ?? '').replace(/\/$/, '');

export const tasksApi = axios.create({
  baseURL: `${API_BASE}/api/tasks`,
  headers: { 'Content-Type': 'application/json' },
});

tasksApi.interceptors.request.use((cfg) => {
  const token = getAuthToken();
  if (token) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export const holidaysApi = axios.create({
  baseURL: NAGER_DATE_API_BASE,
});

export const contentApi = axios.create({
  baseURL: `${API_BASE}/api/content`,
  headers: { 'Content-Type': 'application/json' },
});

contentApi.interceptors.request.use((cfg) => {
  const token = getAuthToken();
  if (token) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});
