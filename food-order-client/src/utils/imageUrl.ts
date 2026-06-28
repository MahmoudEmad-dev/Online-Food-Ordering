/**
 * Resolves product image URLs to point to the backend server.
 * 
 * In development, images are proxied via Vite's dev server proxy (/api → backend).
 * In production, the frontend and backend are on different domains,
 * so relative paths like "/images/burger.png" need the backend origin prepended.
 */
export function resolveImageUrl(path: string): string {
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

  // In development (empty or '/api'), images are served by the backend on the same origin via proxy
  if (!apiBaseUrl || apiBaseUrl === '/api') {
    return path;
  }

  // In production, strip '/api' suffix to get the server root, then prepend to the image path
  const serverRoot = apiBaseUrl.replace(/\/api\/?$/, '');
  return `${serverRoot}${path}`;
}
