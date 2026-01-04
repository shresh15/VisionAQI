// This file centralizes the API URL management.
// In development, it uses localhost:5000.
// In production (Vercel), it uses the VITE_API_URL environment variable.

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
