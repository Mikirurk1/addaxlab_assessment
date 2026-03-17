import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export const tasksApi = axios.create({
  baseURL: `${API_BASE}/api/tasks`,
  headers: { 'Content-Type': 'application/json' },
});

export const holidaysApi = axios.create({
  baseURL: 'https://date.nager.at/api/v3',
});
