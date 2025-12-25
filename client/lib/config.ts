const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Constructs a full API URL by appending the given endpoint to the base URL.
 * Ensures there are no duplicate slashes in the final URL.
 *
 * @param endpoint - The API endpoint to append.
 * @returns The full API URL.
 */
export function getApiUrl(endpoint: string): string {
  const trimmedEndpoint = endpoint.replace(/^\/+/, ''); // Remove leading slashes
  return `${BASE_URL}/${trimmedEndpoint}`;
}
