
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '/api'),
};
