const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawApiBaseUrl) {
  throw new Error('Missing required environment variable: VITE_API_BASE_URL');
}

const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');
const backendOrigin = apiBaseUrl.replace(/\/api\/v1$/, '');

export const env = {
  apiBaseUrl,
  backendOrigin,
  socketUrl: import.meta.env.VITE_SOCKET_URL || backendOrigin,
} as const;
