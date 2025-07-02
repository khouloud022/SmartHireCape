import axios from 'axios';
import keycloak from './keycloak';

const httpClient = axios.create();

httpClient.interceptors.request.use(
  async (config) => {
    if (keycloak.token) {
      const isExpired = keycloak.isTokenExpired();
      if (isExpired) {
        try {
          await keycloak.updateToken(5);
        } catch (error) {
          console.error("Token refresh failed", error);
        }
      }
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { httpClient };
