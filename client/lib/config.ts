const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export function getApiUrl(endpoint: string): string {
  const trimmedEndpoint = endpoint.replace(/^\/+/, ''); // Remove leading slashes
  return `${BASE_URL}/${trimmedEndpoint}`;
}
