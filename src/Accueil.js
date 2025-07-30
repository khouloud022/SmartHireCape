import React from 'react';
import { Button } from 'primereact/button';
import keycloak from './keycloak';
import Footer from './Footer';
import './Accueil.css';

function Accueil() {
  const handleLogin = () => {
    keycloak.login(); 
  };

  return (
    <div className="accueil-container">
      <header className="main-header">
        <div className="logo-container">
          <img src="/logo1.png" alt="Logo" className="logo" />
          <h2 className="app-name">
            <span className="logo-blue">Sma</span>
            <span className="logo-red">rt</span>
            <span className="logo-green">Hire</span>
            <span className="logo-yellow">Ca</span>
            <span className="logo-purple">pe</span>
          </h2>
        </div>
        <div className="nav-buttons">
          <Button label="Se connecter" onClick={handleLogin} className="p-button-rounded p-button-info" />
        </div>
      </header>

      <section className="banner">
        <img src="/accueil.png" alt="Bannière" className="banner-image" />
        <div className="banner-overlay">
          <h1>Connectez les talents aux opportunités</h1>
          <p>Une plateforme puissante pour recruteurs et candidats</p>
        </div>
      </section>
      <section className="split-section">
        <div className="left">
          <h2>À propos de nous</h2>
          <p>
            SmartHireCape est une solution développée par Whitecape Technologies pour optimiser le recrutement.
            Nous utilisons l'intelligence artificielle pour améliorer la correspondance entre offres d'emploi et profils.
          </p>
        </div>
        <div className="right">
          <img src="/accueil2.png" alt="À propos" className="section-image" />
        </div>
      </section>

      <section className="split-section reverse">
        <div className="right">
         <h2>Pourquoi choisir SmartHireCape ?</h2>
          <ul>
            <li>Sélection intelligente de CVs</li>
            <li>Automatisation du processus</li>
            <li>Interface moderne et fluide</li>
          </ul>
        </div>
        <div className="left" >
           <img src="/Why SmartHireCape.png" alt="Fonctionnalités" className="section-image" style={{height:'700px',width:'900px'}} />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Accueil;
