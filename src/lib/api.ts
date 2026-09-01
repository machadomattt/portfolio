// Empty by default: same-origin relative paths (dev proxy, or a single
// server hosting both frontend and backend). Set VITE_API_BASE_URL when the
// frontend is deployed separately from the backend (e.g. frontend on
// Vercel, backend on Render) so requests point at the real backend origin.
const configured = import.meta.env.VITE_API_BASE_URL ?? ''

export const API_BASE = configured.replace(/\/$/, '')

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`
}
