const normalizeUrl = (url) => (url ? url.replace(/\/$/, "") : "");

export const getApiBaseUrl = () => {
  const explicitBase = import.meta.env.VITE_API_BASE_URL;
  if (explicitBase) return normalizeUrl(explicitBase);

  const renderServiceName = import.meta.env.VITE_RENDER_SERVICE_NAME;
  const prNumber = import.meta.env.VERCEL_GIT_PULL_REQUEST_NUMBER;
  if (renderServiceName && prNumber) {
    return `https://${renderServiceName}-pr-${prNumber}.onrender.com/api`;
  }

  const renderServiceUrl = import.meta.env.VITE_RENDER_SERVICE_URL;
  if (renderServiceUrl) return `${normalizeUrl(renderServiceUrl)}/api`;

  // Fallback behavior:
  // In development, default to local backend to avoid accidental production usage.

  if (import.meta.env.DEV) {
    return "http://localhost:5000/api";
  }

  // In production (or other environments where PROD is true), fallback to the hardcoded production URL.
  // Note: VITE_API_BASE_URL needs to be set in Vercel for production to override this if needed, 
  // or to be explicit.
  if (import.meta.env.PROD) {
    return "https://fleetiva-roadlines.onrender.com/api";
  }

  throw new Error(
    "VITE_API_BASE_URL is not set. It must be set in Vercel or your environment."
  );

};
