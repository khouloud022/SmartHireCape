import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import SignUp from './Signup';
import Signin from './Signin';
import Accueil from './Accueil';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Dashboardcandidat from './Dashboardcandidat';
import CandidatSubmission from './CandidatSubmission';
import Publieroffre from './Publieroffre';
import ListOffre from './Listoffre';
import Listoffrecand from './Listoffrecand';
import Footer from './Footer';
import Listecandidats from './Listcandidats';
import AnalyseCandidatures from './AnalyseCandidatures';
import Editprofilerec from './Editprofilerec';
import Editprofilecand from './Editprofilecand';
import keycloak from './keycloak';
import Preselection from './Preselection';
import Messoumissions from './Messoumissions';

function App() {

  useEffect(() => {
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(5).then((refreshed) => {
          if (refreshed) {
            console.log("✅ Token rafraîchi automatiquement");
          } else {
            console.log("🔁 Token encore valide, pas de rafraîchissement nécessaire");
          }
        })
        .catch(() => {
          console.error("❌ Échec du rafraîchissement du token, déconnexion en cours...");
          keycloak.logout({ redirectUri: window.location.href });
        });
    };

  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Accueil" element={<Accueil authenticated={keycloak.authenticated} />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Dashboardcandidat" element={<Dashboardcandidat />} />
        <Route path="/CandidatSubmission" element={<CandidatSubmission />} />
        <Route path="/Publieroffre" element={<Publieroffre />} />
        <Route path="/Listoffre" element={<ListOffre />} />
        <Route path="/Listoffrecand" element={<Listoffrecand />} />
        <Route path="/Listcandidats" element={<Listecandidats />} />
        <Route path="/AnalyseCandidatures" element={<AnalyseCandidatures />} />
        <Route path="/Preselection" element={<Preselection />} />
        <Route path="/Messoumissions" element={<Messoumissions />} />
        <Route path="/Editprofilerec" element={<Editprofilerec />} />
        <Route path="/Editprofilecand" element={<Editprofilecand />} />
        <Route path="/Footer" element={<Footer />} />
      </Routes>
    </div>
  );
}

export default App;
