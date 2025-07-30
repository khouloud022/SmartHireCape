import React, { useEffect, useState } from "react";
import { FiMail,  FiPhone,  FiAward,  FiCalendar,  FiDownload, FiFilter, FiSearch, FiEye, FiUser, FiBriefcase, FiChevronUp, FiChevronDown,} from "react-icons/fi";
import {  FaChartLine, FaRegThumbsUp, FaRegThumbsDown, FaCheckCircle,FaTimesCircle,FaStar} from "react-icons/fa";
import HeaderAndSidebar from "./HeaderAndSidebar";
import "./AnalyseCandidature.css";

const AnalyseCandidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [messages, setMessages] = useState({});
  const [activeFilter, setActiveFilter] = useState("tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "dateSoumission", direction: "desc" });

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/candidatures`);
      const data = await response.json();
      setCandidatures(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des candidatures:", error);
    }
  };

  const estPreselectionnee = (cand) => cand.etat === "Accepté(e) en phase de préselection";

  const handleAnalyse = async (candidature) => {
    if (!estPreselectionnee(candidature)) return;
    setLoadingId(candidature.id);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL_ANALYSE}/analyse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poste: [
           candidature.offre?.titre,
           candidature.offre?.competences,
           candidature.offre?.hardskills,
           candidature.offre?.description,
           candidature.offre?.minexperience,
           candidature.offre?.missions ].filter(Boolean).join(" "),

          cvUrl: `http://localhost:8085/cv/${candidature.cvpath.replace(/\\/g, "/")}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur inconnue côté serveur.");
      }

      const matchingScore = result.score;
      const etat = matchingScore >= 60 ? "Préselectionné" : "Rejeté";

      setMessages((prev) => ({
        ...prev,
        [candidature.id]: {
          score: matchingScore,
          status: etat,
          message: `Score: ${matchingScore}/100 — ${etat}`,
          details: result.details || ""
        },
      }));
    } catch (err) {
      console.error("Erreur analyse du CV :", err);
      setMessages((prev) => ({
        ...prev,
        [candidature.id]: {
          score: 0,
          status: "Erreur",
          message: "Erreur lors de l'analyse du CV.",
          details: err.message
        },
      }));
    }

    setLoadingId(null);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCandidatures = [...candidatures].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredCandidatures = sortedCandidatures.filter(cand => {
    const matchesSearch = cand.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cand.offre?.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const isAccepted = estPreselectionnee(cand);
    
    if (!matchesSearch) return false;
    if (activeFilter === "tous") return isAccepted;
    if (activeFilter === "preselectionnes") return isAccepted && messages[cand.id]?.status === "Préselectionné";
    if (activeFilter === "rejetes") return isAccepted && messages[cand.id]?.status === "Rejeté";
    return false;
  });

  const openDetailsModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowDetails(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Préselectionné":
        return <span className="status-badge success"><FaCheckCircle /> {status}</span>;
      case "Rejeté":
        return <span className="status-badge danger"><FaTimesCircle /> {status}</span>;
      case "Erreur":
        return <span className="status-badge warning">{status}</span>;
      default:
        return <span className="status-badge secondary">{status || "Non analysé"}</span>;
    }
  };

  const getProgressBarVariant = (score) => {
    if (score >= 80) return "success";
    if (score >= 60) return "info";
    if (score >= 40) return "warning";
    return "danger";
  };

  return (
    <div className="analyse-candidatures-page">
      <HeaderAndSidebar />
      <div className="main-content">
        <div className="page-header">
          <br></br><br></br><br></br>
          <h1><FaChartLine className="icon-header" />Analyse des Candidatures</h1>
          <div className="header-controls">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${activeFilter === "tous" ? "active" : ""}`}
                onClick={() => setActiveFilter("tous")}
              >
                Tous
              </button>
              <button 
                className={`filter-btn ${activeFilter === "preselectionnes" ? "active success" : ""}`}
                onClick={() => setActiveFilter("preselectionnes")}
              >
                <FaRegThumbsUp className="icon-btn" /> Sélectionnés
              </button>
              <button 
                className={`filter-btn ${activeFilter === "rejetes" ? "active danger" : ""}`}
                onClick={() => setActiveFilter("rejetes")}
              >
                <FaRegThumbsDown className="icon-btn" /> Rejetés
              </button>
            </div>
            
            <div className="search-box">
              <div className="search-input">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Rechercher un candidat..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {filteredCandidatures.length === 0 ? (
          <div className="no-results-card">
            <div className="no-results-content">
              <span className="icon" >😕</span>
              <h3>Aucune candidature trouvée</h3>
              <p>Aucune candidature durant l'analyse ne correspond aux critéres de l'offre.</p>
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
                        sortConfig.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />
                      )}
                    </div>
                  </th>
                  <th onClick={() => handleSort("offre.titre")}>
                    <div className="th-content">
                      <FiBriefcase className="th-icon" />
                      <span>Poste</span>
                      {sortConfig.key === "offre.titre" && (
                        sortConfig.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />
                      )}
                    </div>
                  </th>
                  <th>Expérience</th>
                  <th>Compétences</th>
                  <th onClick={() => handleSort("dateSoumission")}>
                    <div className="th-content">
                      <FiCalendar className="th-icon" />
                      <span>Date</span>
                      {sortConfig.key === "dateSoumission" && (
                        sortConfig.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />
                      )}
                    </div>
                  </th>
                  <th>Statut</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidatures.map((cand) => (
                  <tr key={cand.id} className="candidate-row">
                    <td>
                      <div className="candidate-info">
                        <div className="avatar">{cand.nomComplet.charAt(0)}</div>
                        <div>
                          <strong>{cand.nomComplet}</strong>
                          <div className="candidate-email">{cand.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="candidate-position">{cand.offre?.titre || "Non précisé"}</div>
                    </td>
                    <td>
                      <span className="experience-badge">
                        <FiAward className="icon-experience" /> {cand.experience} ans
                      </span>
                    </td>
                    <td>
                      <div className="skills-tags">
                        {cand.competence.split(',').slice(0, 3).map((skill, i) => (
                          <span key={i} className="skill-tag">{skill.trim()}</span>
                        ))}
                        {cand.competence.split(',').length > 3 && (
                          <span className="skill-tag more">+{cand.competence.split(',').length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {new Date(cand.dateSoumission).toLocaleDateString()}
                    </td>
                    <td>
                      {messages[cand.id] ? getStatusBadge(messages[cand.id].status) : (
                        <span className="status-badge secondary">Non analysé</span>
                      )}
                    </td>
                    <td>
                      {messages[cand.id] ? (
                        <div className="score-container">
                          <div className="progress-bar-container">
                            <div 
                              className={`progress-bar ${getProgressBarVariant(messages[cand.id].score)}`}
                              style={{ width: `${messages[cand.id].score}%` }}
                            ></div>
                          </div>
                          <span className="score-value">{messages[cand.id].score}%</span>
                        </div>
                      ) : (
                        <span className="score-empty">-</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view"
                          onClick={() => openDetailsModal(cand)}
                        >
                          <FiEye />
                        </button>
                        <button
                          className={`action-btn analyse ${estPreselectionnee(cand) ? "" : "disabled"}`}
                          onClick={() => handleAnalyse(cand)}
                          disabled={loadingId === cand.id || !estPreselectionnee(cand)}
                        >
                          {loadingId === cand.id ? (
                            <div className="spinner"></div>
                          ) : (
                            <FaChartLine />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showDetails && selectedCandidate && (
        <div className="modal-overlay">
          <div className="candidate-modal">
            <div className="modal-header">
              <div className="modal-title">
                <div className="avatar-lg">{selectedCandidate.nomComplet.charAt(0)}</div>
                <div>
                  <h3>{selectedCandidate.nomComplet}</h3>
                  <p>{selectedCandidate.offre?.titre || "Poste non précisé"}</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-grid">
                <div className="modal-column">
                  <h4><FiUser className="icon-header" /> Informations personnelles</h4>
                  <ul className="info-list">
                    <li><FiMail className="icon-list" /> <strong>Email:</strong> {selectedCandidate.email}</li>
                    <li><FiPhone className="icon-list" /> <strong>Téléphone:</strong> {selectedCandidate.telephone}</li>
                    <li><FiAward className="icon-list" /> <strong>Expérience:</strong> {selectedCandidate.experience} ans</li>
                    <li><FiCalendar className="icon-list" /> <strong>Date de candidature:</strong> {new Date(selectedCandidate.dateSoumission).toLocaleDateString()}</li>
                  </ul>

                  <h4><FiBriefcase className="icon-header" /> Poste visé</h4>
                  <div className="position-card">
                    <h5>{selectedCandidate.offre?.titre || "Non précisé"}</h5>
                    {selectedCandidate.offre?.description && (
                      <p>{selectedCandidate.offre.description}</p>
                    )}
                  </div>
                </div>
                <div className="modal-column">
                  <h4><FaStar className="icon-header" /> Compétences</h4>
                  <div className="skills-tags">
                    {selectedCandidate.competence.split(',').map((skill, i) => (
                      <span key={i} className="skill-tag">{skill.trim()}</span>
                    ))}
                  </div>

                  <div className="cv-section">
                    <a 
                      className="download-btn"
                      href={`http://localhost:8085/cv/${selectedCandidate.cvpath.replace(/\\/g, "/")}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <FiDownload className="icon-btn" /> Télécharger le CV
                    </a>
                  </div>

                  {messages[selectedCandidate.id] && (
                    <div className={`analysis-result ${messages[selectedCandidate.id].status === "Préselectionné" ? "success" : "danger"}`}>
                      <div className="result-header">
                        <h5>Résultat de l'analyse</h5>
                        {getStatusBadge(messages[selectedCandidate.id].status)}
                      </div>
                      <div className="score-container">
                        <div className="progress-bar-container">
                          <div 
                            className={`progress-bar ${getProgressBarVariant(messages[selectedCandidate.id].score)}`}
                            style={{ width: `${messages[selectedCandidate.id].score}%` }}
                          >
                            <span className="progress-label">{messages[selectedCandidate.id].score}%</span>
                          </div>
                        </div>
                      </div>
                      <p className="result-message">
                        {messages[selectedCandidate.id].score >= 60
                          ? "Ce candidat correspond bien au poste !"
                          : "Correspondance insuffisante avec le poste."}
                      </p>
                      {messages[selectedCandidate.id].details && (
                        <div className="result-details">
                          <h6>Détails:</h6>
                          <p>{messages[selectedCandidate.id].details}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-btn secondary"
                onClick={() => setShowDetails(false)}
              >
                Fermer
              </button>
              {estPreselectionnee(selectedCandidate) && (
                <button
                  className={`modal-btn primary ${loadingId === selectedCandidate.id ? "loading" : ""}`}
                  onClick={() => {
                    handleAnalyse(selectedCandidate);
                    setShowDetails(false);
                  }}
                  disabled={loadingId === selectedCandidate.id}
                >
                  {loadingId === selectedCandidate.id ? (
                    <div className="spinner"></div>
                  ) : (
                    <FaChartLine className="icon-btn" />
                  )}
                  Analyser
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyseCandidatures;