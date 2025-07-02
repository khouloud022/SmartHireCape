import React, { useEffect, useState } from 'react';
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeflex/primeflex.css';

import { Routes, Route, useNavigate } from 'react-router-dom';

import InterfaceRecruteur from './Dashboard';
import InterfaceCandidat from './Dashboardcandidat';
import Accueil from './Accueil';

import keycloak from './keycloak';

function AppWrapper() {
  return (
    <Routes>
      <Route path="/" element={<RedirectOnLogin />} />
      <Route path="/Dashboard" element={<InterfaceRecruteur />} />
      <Route path="/Dashboardcandidat" element={<InterfaceCandidat />} />
    </Routes>
  );
}

function RedirectOnLogin() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso', pkceMethod: 'S256' }).then((authenticated) => {
      if (authenticated) {
        const tokenParsed = keycloak.tokenParsed;
        const roles = tokenParsed?.realm_access?.roles || [];

        if (roles.includes('recruteur')) {
          navigate('/Dashboard');
        } else if (roles.includes('candidat')) {
          navigate('/Dashboardcandidat');
        } else {
          alert("Aucun rôle reconnu");
          keycloak.logout({ redirectUri: 'http://localhost:3000/' });
        }
      } else {
        setLoading(false); 
      }
    });
  }, [navigate]);

  if (loading) return null;

  return <Accueil />;
}

export default AppWrapper;
