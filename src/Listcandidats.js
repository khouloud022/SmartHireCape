import React, { useEffect, useState } from "react";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiAward, 
  FiBriefcase, 
  FiDownload,
  FiFilter,
  FiSearch,
  FiRefreshCw
} from "react-icons/fi";
import HeaderAndSidebar from "./HeaderAndSidebar";
import "./ListeCandidats.css";
import axios from "axios";

const ListeCandidats = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "nomComplet", direction: "asc" });

  const fetchData = () => {
    setRefreshing(true);
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/candidatures`)
      .then(response => {
        setCandidatures(response.data);
        setFilteredCandidatures(response.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des candidatures :", err);
        setError("Impossible de charger les candidatures.");
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchId(value);
    const filtered = candidatures.filter(
      (c) => c.offre?.id?.toString().includes(value)
    );
    setFilteredCandidatures(filtered);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCandidatures = [...filteredCandidatures].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const getExperienceColor = (years) => {
    if (years > 5) return "var(--success-color)";
    if (years > 2) return "var(--info-color)";
    return "var(--warning-color)";
  };

  return (
    <div className="liste-candidats-page">
      <HeaderAndSidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Liste des Candidatures</h1>
          <div className="header-controls">
            <div className="search-box">
              <div className="search-input">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Rechercher par ID de l'offre..." 
                  value={searchId}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="header-actions">
              <button 
                className={`action-btn refresh ${refreshing ? "loading" : ""}`}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? <div className="spinner"></div> : <FiRefreshCw />}
              </button>
              <button className="action-btn filter">
                <FiFilter />
              </button>
              <div className="count-badge">
                {filteredCandidatures.length} candidatures
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des candidatures...</p>
          </div>
        ) : error ? (
          <div className="error-card">
            <p className="error-message">{error}</p>
          </div>
        ) : filteredCandidatures.length === 0 ? (
          <div className="no-results-card">
            <div className="no-results-content">
              <span className="icon">🔍</span>
              <h3>Aucune candidature trouvée</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          </div>
        ) : (
          <div className="candidate-table-container">
            <table className="candidate-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("nomComplet")}>
                    <div className="th-content">
                      <FiUser className="th-icon" />
                      <span>Candidat</span>
                      {sortConfig.key === "nomComplet" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <FiMail className="th-icon" />
                      <span>Contact</span>
                    </div>
                  </th>
                  <th onClick={() => handleSort("experience")}>
                    <div className="th-content">
                      <FiAward className="th-icon" />
                      <span>Expérience</span>
                      {sortConfig.key === "experience" && (
                        <span className="sort-indicator">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <FiBriefcase className="th-icon" />
                      <span>Compétences</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <span>Offre ID</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <span>CV</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCandidatures.map((candidat, index) => (
                  <tr key={index} className="candidate-row">
                    <td>
                      <div className="candidate-info">
                        <div 
                          className="avatar"
                          style={{ backgroundColor: `var(--primary-color)` }}
                        >
                          {candidat.nomComplet.charAt(0)}
                        </div>
                        <div>
                          <strong>{candidat.nomComplet}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="contact-email">
                          <FiMail className="contact-icon" /> {candidat.email}
                        </div>
                        <div className="contact-phone">
                          <FiPhone className="contact-icon" /> {candidat.telephone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div 
                        className="experience-badge"
                        style={{ backgroundColor: getExperienceColor(candidat.experience) }}
                      >
                        <FiAward className="experience-icon" /> {candidat.experience} ans
                      </div>
                    </td>
                    <td>
                      <div className="skills-tags">
                        {candidat.competence.split(',').map((skill, i) => (
                          <span key={i} className="skill-tag">{skill.trim()}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="offer-id">
                        #{candidat.offre.id}
                      </div>
                    </td>
                    <td>
                      {candidat.cvpath && (
                        <a
                          className="download-btn"
                          href={`http://localhost:8085/api/candidatures/download-cv/${candidat.cvpath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FiDownload className="download-icon" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeCandidats;