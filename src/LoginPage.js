// LoginPage.js
import React from 'react';
import { Button } from 'primereact/button';
import keycloak from './keycloak';

const LoginPage = () => {
  const handleLogin = () => {
    keycloak.login(); 
  };

  return (
    <div className="login-page">
      <h2>Connexion à IntelliRecrut</h2>
      <Button label="Se connecter avec Keycloak" onClick={handleLogin} className="p-button-success" />
    </div>
  );
};

export default LoginPage;
