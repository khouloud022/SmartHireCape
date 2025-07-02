// KeycloakContext.js
import React, { createContext, useEffect, useState } from 'react';
import keycloak from './keycloak';

export const AuthContext = createContext();

export const KeycloakProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    keycloak
      .init({ onLoad: 'check-sso', pkceMethod: 'S256' })
      .then((auth) => {
        setIsAuthenticated(auth);

        // Rafraîchissement automatique du token toutes les 30 sec
        const refreshInterval = setInterval(() => {
          keycloak.updateToken(30).catch(() => {
            console.warn('Token expiré. Déconnexion...');
            keycloak.logout({ redirectUri: window.location.origin });
          });
        }, 30000);

        // Callback si expiration
        keycloak.onTokenExpired = () => {
          keycloak.updateToken(5).catch(() => {
            console.error("Échec de mise à jour du token expiré");
            keycloak.logout({ redirectUri: window.location.origin });
          });
        };

        return () => clearInterval(refreshInterval);
      })
      .catch(() => {
        console.error('Erreur init Keycloak');
      });
  }, []);

  return (
    <AuthContext.Provider value={{ keycloak, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
