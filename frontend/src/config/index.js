const isDevelopment = import.meta.env.DEV;

export const API_URL = isDevelopment ? "http://localhost:5000" : "";
export const SOCKET_ENDPOINT = isDevelopment
  ? "http://localhost:5000"
  : window.location.origin;
