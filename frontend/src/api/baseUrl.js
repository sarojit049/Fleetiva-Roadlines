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

  return "";
};
