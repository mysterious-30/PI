import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://pi-mysterious-30.vercel.app/api'  // Production API URL
    : 'http://localhost:5000/api',               // Development API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 