import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Alert, ProgressBar, Badge, Container, Row, Col } from "react-bootstrap";
import { FiUser, FiMail, FiPhone, FiAward, FiFileText, FiCalendar, FiDownload } from "react-icons/fi";
import { FaChartLine, FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import HeaderAndSidebar from "./HeaderAndSidebar";
import "./AnalyseCandidature.css";

const AnalyseCandidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [messages, setMessages] = useState({});
  const [activeFilter, setActiveFilter] = useState("tous");

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/candidatures`);
      const data = await response.json();
      console.log(response);
      console.log(data);
      setCandidatures(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des candidatures:", error);
    }
  };

 const handleAnalyse = async (candidature) => {
  setLoadingId(candidature.id);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL_ANALYSE}/analyse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        poste: candidature.offre?.titre || "",
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
      },
    }));
  } catch (err) {
    console.error("Erreur analyse du CV :", err);
    setMessages((prev) => ({
      ...prev,
      [candidature.id]: {
        score: 0,
        status: "Erreur",
        message: "Erreur lors de l’analyse du CV.",
      },
    }));
  }

  setLoadingId(null);
};

  const filteredCandidatures = candidatures.filter(cand => {
    if (activeFilter === "tous") return true;
    if (activeFilter === "preselectionnes") return messages[cand.id]?.status === "Préselectionné";
    if (activeFilter === "rejetes") return messages[cand.id]?.status === "Rejeté";
    return true;
  });

  return (
    <div className="analyse-candidatures-page" >
      <HeaderAndSidebar />
      <br></br> <br></br>
      <Container fluid className="main-content" style={{marginLeft:'300px'}}>
        <div className="page-header">
          <h1>  Analyse des Candidatures</h1>
          <div className="filter-buttons">
            <Button 
              variant={activeFilter === "tous" ? "primary" : "outline-primary"}
              onClick={() => setActiveFilter("tous")}
            >
              Tous
            </Button>
            <Button 
              variant={activeFilter === "preselectionnes" ? "success" : "outline-success"}
              onClick={() => setActiveFilter("preselectionnes")}
            >
              <FaRegThumbsUp className="mr-2" /> Présélectionnés
            </Button>
            <Button 
              variant={activeFilter === "rejetes" ? "danger" : "outline-danger"}
              onClick={() => setActiveFilter("rejetes")}
            >
              <FaRegThumbsDown className="mr-2" /> Rejetés
            </Button>
          </div>
        </div>

        {filteredCandidatures.length === 0 ? (
          <div className="no-results">
            <img src="/images/empty-state.svg" alt="Aucune candidature" />
            <h3>Aucune candidature trouvée</h3>
            <p>Il n'y a actuellement aucune candidature correspondant à vos critères.</p>
          </div>
        ) : (
          <Row>
            {filteredCandidatures.map((cand) => (
              <Col key={cand.id} lg={6} xl={4} className="mb-4">
                <Card className="candidature-card h-100">
                  <Card.Body>
                    <div className="candidate-header">
                      <div className="avatar">{cand.nomComplet.charAt(0)}</div>
                      <div>
                        <Card.Title>{cand.nomComplet}</Card.Title>
                        <Card.Subtitle className="text-muted">
                          {cand.offre?.titre || "Poste non précisé"}
                        </Card.Subtitle>
                      </div>
                    </div>

                    <div className="candidate-details">
                      <div className="detail-item">
                        <FiMail className="icon" />
                        <span>{cand.email}</span>
                      </div>
                      <div className="detail-item">
                        <FiPhone className="icon" />
                        <span>{cand.telephone}</span>
                      </div>
                      <div className="detail-item">
                        <FiAward className="icon" />
                        <span>{cand.experience} ans d'expérience</span>
                      </div>
                      <div className="detail-item">
                        <FiCalendar className="icon" />
                        <span>{new Date(cand.dateSoumission).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="skills-section">
                      <h6>Compétences</h6>
                      <div className="skills-tags">
                        {cand.competence.split(',').map((skill, i) => (
                          <Badge key={i} pill className="skill-tag">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="cv-section">
                      <Button variant="outline-primary" href={`http://localhost:8085/cv/${cand.cvpath.replace(/\\/g, "/")}`} target="_blank" className="w-100" >
                        <FiDownload className="mr-2" /> Télécharger le CV </Button>
                    </div>

                    <div className="analysis-section">
                      <Button 
                        variant="primary" 
                        onClick={() => handleAnalyse(cand)} 
                        disabled={loadingId === cand.id}
                        className="w-100 analyse-btn"
                      >
                        {loadingId === cand.id ? (
                          <>
                            <Spinner animation="border" size="sm" /> Analyse en cours...
                          </>
                        ) : (
                          <>
                            <FaChartLine className="mr-2" /> Analyser la candidature
                          </>
                        )}
                      </Button>

                      {messages[cand.id] && (
                        <div className={`result-container ${messages[cand.id].status === "Préselectionné" ? "success" : "danger"}`}>
                          <div className="result-header">
                            <h6>Résultat de l'analyse</h6>
                            <Badge pill variant={messages[cand.id].status === "Préselectionné" ? "success" : "danger"}>
                              {messages[cand.id].status}
                            </Badge>
                          </div>
                          <ProgressBar 
                            now={messages[cand.id].score} 
                            label={`${messages[cand.id].score}%`}
                            variant={messages[cand.id].score >= 60 ? "success" : "danger"}
                            className="mb-2"
                          />
                          <p className="result-message">
                            {messages[cand.id].score >= 60 ? (
                              <span>Ce candidat correspond bien au poste !</span>
                            ) : (
                              <span>Correspondance insuffisante avec le poste.</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default AnalyseCandidatures;