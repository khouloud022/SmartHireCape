import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderAndSidebar from './HeaderAndSidebar';
import './Preselection.css';

const Preselection = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [message, setMessage] = useState('');
  const [filtrerAcceptes, setFiltrerAcceptes] = useState(false);
  const [filtrerIdOffre, setFiltrerIdOffre] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchCandidatures = async () => {
    try {
      const res = await axios.get("http://localhost:8085/api/candidatures");
      setCandidatures(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error("Erreur de récupération des candidatures", err);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const accepted = data.filter(c => c.etat === "Accepté(e) en phase de préselection").length;
    const rejected = total - accepted;
    
    setStats({
      total,
      accepted,
      rejected,
      acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0
    });
  };

  const lancerAnalyse = async () => {
    setIsAnalyzing(true);
    setMessage('');
    try {
      const res = await axios.get("http://localhost:8085/api/candidatures/analyse");
      setMessage(res.data); 
      await fetchCandidatures();
    } catch (err) {
      console.error("Erreur lors de l'analyse :", err);
      setMessage("Erreur lors de l'analyse");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const candidaturesFiltrees = candidatures.filter(c => {
    const estAcceptee = !filtrerAcceptes || c.etat === "Accepté(e) en phase de préselection";
    const correspondIdOffre = !filtrerIdOffre || c.offre?.id?.toString() === filtrerIdOffre;
    return estAcceptee && correspondIdOffre;
  });

  return (
    <div className="preselection-container">
      <HeaderAndSidebar /> 
      <div className="preselection-content">
        <div className="dashboard-header">
            <br></br><br></br><br></br>
          <h1 className="dashboard-title">
            <span className="icon">📊</span> Dashboard de Présélection
          </h1>
          <p className="dashboard-subtitle">Analyse et gestion des candidatures</p>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Candidatures</div>
            </div>
            <div className="stat-card accepted">
              <div className="stat-value">{stats.accepted}</div>
              <div className="stat-label">Acceptées</div>
            </div>
            <div className="stat-card rejected">
              <div className="stat-value">{stats.rejected}</div>
              <div className="stat-label">Rejetées</div>
            </div>
            <div className="stat-card rate">
              <div className="stat-value">{stats.acceptanceRate}%</div>
              <div className="stat-label">Taux d'acceptation</div>
            </div>
          </div>
        )}

        <div className="action-section">
          <button className={`analyse-button ${isAnalyzing ? 'loading' : ''}`} onClick={lancerAnalyse} disabled={isAnalyzing} >
            {isAnalyzing ? (
              <>
                <span className="spinner"></span>
                Analyse en cours...
              </>
            ) : (
              <>
                <span className="icon">🔍</span> Lancer l'analyse de la préselection
              </>
            )}
          </button>
          
          {message && (
            <div className={`message ${message.includes("Erreur") ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>

        <div className="filters-section">
          <div className="filters-card">
            <h3 className="filters-title">Filtres avancés</h3>
            
            <div className="filter-group">
              <label className="filter-switch">
                <input
                  type="checkbox"
                  checked={filtrerAcceptes}
                  onChange={() => setFiltrerAcceptes(!filtrerAcceptes)}
                />
                <span className="slider round"></span>
                <span className="filter-label">Afficher uniquement les acceptées</span>
              </label>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <span className="icon">🔎</span> Filtrer par ID offre
                <input
                  type="text"
                  value={filtrerIdOffre}
                  onChange={(e) => setFiltrerIdOffre(e.target.value)}
                
                  className="filter-input"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="table-section">
          <div className="table-header">
            <h3>Liste des Candidatures</h3>
            <div className="table-count">
              {candidaturesFiltrees.length} résultat{candidaturesFiltrees.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="table-container">
            <table className="candidatures-table">
              <thead>
                <tr>
                  <th>Nom complet</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Compétences</th>
                  <th>Expérience</th>
                  <th>Offre</th>
                  <th>État</th>
                </tr>
              </thead>
              <tbody>
                {candidaturesFiltrees.length > 0 ? (
                  candidaturesFiltrees.map((c) => (
                    <tr key={c.id} className="candidature-row">
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {c.nomComplet.charAt(0).toUpperCase()}
                          </div>
                          {c.nomComplet}
                        </div>
                      </td>
                      <td>
                        <a href={`mailto:${c.email}`} className="email-link">
                          {c.email}
                        </a>
                      </td>
                      <td>{c.telephone || '—'}</td>
                      <td>
                        <div className="competences">
                          {c.competence.split(' et ').map((comp, i) => (
                            <span key={i} className="competence-tag">{comp.trim()}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="experience-bar-container">
                          <div 
                            className="experience-bar" 
                            style={{ width: `${Math.min(100, c.experience * 10)}%` }}
                          ></div>
                          <span>{c.experience} ans</span>
                        </div>
                      </td>
                      <td>
                        <div className="offre-badge">
                          {c.offre?.titre || '—'}
                        </div>
                      </td>
                      <td>
                        <div className={`etat-badge ${c.etat === "Accepté(e) en phase de préselection" ? "acceptee" : "rejetee"}`}>
                          {c.etat}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-data-row">
                    <td colSpan="7">
                      <div className="no-data-content">
                        <span className="icon">😕</span>
                        <div>Aucune candidature trouvée</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preselection;