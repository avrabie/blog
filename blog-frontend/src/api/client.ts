import axios from 'axios';

export const API_BASE = '/api/blog';
export const BFF_BASE = '/api/bff';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const bffClient = axios.create({
  baseURL: BFF_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const gatewayClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
