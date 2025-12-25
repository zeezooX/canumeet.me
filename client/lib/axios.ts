import axios from 'axios';

/**
 * Create an Axios instance with default configuration.
 * Base URL is set from environment variable or defaults to localhost.
 * Timeout is set to 10 seconds.
 * Default headers include Content-Type as application/json.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
