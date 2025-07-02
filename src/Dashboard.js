import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Container, Row, Col, Navbar, Nav, Card, Button, ListGroup, Badge, ProgressBar, Dropdown, Form, Image, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import keycloak from './keycloak';
import { Link } from 'react-router-dom';
import HeaderAndSidebar from './HeaderAndSidebar';

function App( { authenticated, keycloak }) {
  const [nombreOffres, setNombreOffres] = useState(0);
  const [nombreCandidats, setNombreCandidats] = useState(0);
  const [offresAssignees, setOffresAssignees] = useState(0);
  const [candidats, setCandidats] = useState([]);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/offres/count`)
      .then((response) => {
        setNombreOffres(response.data);
      })
      .catch(console.error);
   axios.get(`${process.env.REACT_APP_API_BASE_URL}/candidatures/count`)
    .then((response) => {
      setNombreCandidats(response.data);
    })
    .catch((error) => {
      console.error("Erreur lors du chargement du nombre de candidatures :", error);
    });
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/offres`)
      .then(response => {
       
        const offresAvecEtat = response.data.map(offre => ({
          ...offre,
          etat: offre.etat || "En cours"
        }));
        setOffres(offresAvecEtat);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des offres:", error);
        setError("Erreur lors du chargement des offres");
        setLoading(false);
      });
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/candidatures`)
  .then((response) => {
    const candidatsFormates = response.data.map((candidat) => ({
      id: candidat.id,
      nom: `${candidat.nomComplet}`,
      poste: candidat.offre?.titre || "Non spécifié",
      statut: candidat.statut || "En attente",
      date: candidat.dateSoumission ? new Date(candidat.dateSoumission).toLocaleDateString() : "—",
      score: candidat.score || 0
    }));
    setCandidats(candidatsFormates);
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des candidats :", error);
  });

  }, []);
  const handleLogout = () => {
    keycloak.logout({ redirectUri: 'http://localhost:3000/' });
  };
   const renderStatutBadge = (etat) => {
    switch (etat) {
      case 'En cours':
        return <Badge bg="success" style={{ backgroundColor: '#28a745' }}>Active</Badge>;
      case 'Clôturée':
        return <Badge bg="secondary">Clôturée</Badge>;
      case 'Bientôt clôturée':
        return <Badge bg="warning" style={{ backgroundColor: '#ffc107', color: '#212529' }}>Bientôt clôturée</Badge>;
      default:
        return <Badge bg="light" text="dark">Inconnu</Badge>;
    }
  };

  return (
    <div className="App d-flex">
   <HeaderAndSidebar authenticated={authenticated} keycloak={keycloak}  />
      <div className="flex-grow-1" style={{marginLeft: '280px'}}>
        <main style={{marginTop: "60px", padding: '30px'}}>
          <Container fluid className="px-4">
            
            <Row className="mb-4">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="h3 mb-1 text-dark">Tableau de bord</h1>
                    <p className="text-muted mb-0">Bienvenue, Recruteur</p>
                  </div>
                  <Link to="/Publieroffre" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Button variant="primary" className="px-4" style={{ backgroundColor: '#2a5bd7',borderColor: '#2a5bd7'}}>
                    <i className="fas fa-plus me-2"></i>Nouvelle offre
                  </Button>
                  </Link>
                </div>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={6} lg={3}>
                <Card className="mb-4 border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title className="text-muted small text-uppercase fw-bold">Candidats</Card.Title>
                        <h2 className="mb-0 text-dark">{nombreCandidats}</h2>
                      </div>
                      <div className="p-3 rounded" style={{backgroundColor: 'rgba(42, 91, 215, 0.1)'}}>
                        <i className="fas fa-users fa-2x" style={{color: '#2a5bd7'}}></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3}>
                <Card className="mb-4 border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title className="text-muted small text-uppercase fw-bold">Offres publiées</Card.Title>
                        <h2 className="mb-0 text-dark">{nombreOffres}</h2>
                      </div>
                      <div className="p-3 rounded" style={{backgroundColor: 'rgba(40, 167, 69, 0.1)'}}>
                        <i className="fas fa-file-alt fa-2x" style={{color: '#28a745'}}></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3}>
                <Card className="mb-4 border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title className="text-muted small text-uppercase fw-bold">Offres assignées</Card.Title>
                        <h2 className="mb-0 text-dark"></h2>
                      </div>
                      <div className="p-3 rounded" style={{backgroundColor: 'rgba(220, 53, 69, 0.1)'}}>
                        <i className="fas fa-tasks fa-2x" style={{color: '#dc3545'}}></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3}>
                <Card className="mb-4 border-0 shadow-sm h-100" style={{borderRadius: '12px'}}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title className="text-muted small text-uppercase fw-bold">Entretiens</Card.Title>
                        <h2 className="mb-0 text-dark"></h2>
                      </div>
                      <div className="p-3 rounded" style={{backgroundColor: 'rgba(23, 162, 184, 0.1)'}}>
                        <i className="fas fa-calendar-check fa-2x" style={{color: '#17a2b8'}}></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={8}>
                <Card className="mb-4 border-0 shadow-sm" style={{borderRadius: '12px'}}>
                  <Card.Header className="bg-white border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 text-dark">Dernières offres publiées</h5>
                      <Link to="/Listoffre" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Button variant="outline-primary" size="sm" style={{color: '#2a5bd7',borderColor: '#2a5bd7'}}>
                        Voir tout
                      </Button>
                      </Link>
                    </div>
                  </Card.Header>
                  <Card.Body>
  <div className="table-responsive">
      <Table hover className="mb-0">
        <thead className="bg-light">
          <tr>
            <th className="border-0">Poste</th>
            <th className="border-0">Type</th>
            <th className="border-0">Entreprise</th>
            <th className="border-0">Date limite</th>
            <th className="border-0">Statut</th>
            <th className="border-0">Actions</th>
          </tr>
        </thead>
        <tbody>
          {offres.length > 0 ? (
            offres.map((offre) => (
              <tr key={offre.id}>
                <td>{offre.titre}</td>
                <td>{offre.typeContrat}</td>
                <td>{offre.entreprise}</td>
                <td>{offre.dateLimite ? new Date(offre.dateLimite).toLocaleDateString() : '—'}</td>
                <td>{renderStatutBadge(offre.etat)}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-1 border-0">
                    <i className="fas fa-eye text-primary"></i>
                  </Button>
                  <Button variant="outline-success" size="sm" className="border-0">
                    <i className="fas fa-edit text-success"></i>
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">Aucune offre disponible</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="mb-4 border-0 shadow-sm" style={{borderRadius: '12px'}}>
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0 text-dark">Progression des recrutements</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted fw-bold">Phase de présélection</small>
                        <small className="text-muted">65%</small>
                      </div>
                      <ProgressBar now={65} className="rounded" style={{
                        height: "6px",
                        backgroundColor: 'rgba(42, 91, 215, 0.1)'
                      }} />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted fw-bold">Entretiens techniques</small>
                        <small className="text-muted">45%</small>
                      </div>
                      <ProgressBar now={45} className="rounded" style={{
                        height: "6px",
                        backgroundColor: 'rgba(40, 167, 69, 0.1)'
                      }} />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted fw-bold">Entretiens RH</small>
                        <small className="text-muted">30%</small>
                      </div>
                      <ProgressBar now={30} className="rounded" style={{
                        height: "6px",
                        backgroundColor: 'rgba(23, 162, 184, 0.1)'
                      }} />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted fw-bold">Offres envoyées</small>
                        <small className="text-muted">15%</small>
                      </div>
                      <ProgressBar now={15} className="rounded" style={{
                        height: "6px",
                        backgroundColor: 'rgba(255, 193, 7, 0.1)'
                      }} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col>
                <Card className="shadow-sm border-0" style={{borderRadius: '12px'}}>
                  <Card.Header className="bg-white border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 text-dark">Derniers candidats</h5>
                      <div>
                        <Button variant="outline-secondary" size="sm" className="me-2">
                          <i className="fas fa-filter me-1"></i>Filtrer
                        </Button>
                        <Button variant="primary" size="sm" style={{
                          backgroundColor: '#2a5bd7',
                          borderColor: '#2a5bd7'
                        }}>
                          <i className="fas fa-download me-1"></i>Exporter
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="border-0">Nom</th>
                            <th className="border-0">Poste</th>
                            <th className="border-0">Score</th>
                            <th className="border-0">Statut</th>
                            <th className="border-0">Date</th>
                            <th className="border-0">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidats.map(candidat => (
                            <tr key={candidat.id}>
                              <td className="fw-bold">{candidat.nom}</td>
                              <td>{candidat.poste}</td>
                              <td>
                                <ProgressBar 
                                  now={candidat.score} 
                                  label={`${candidat.score}%`} 
                                  variant={candidat.score > 80 ? "success" : candidat.score > 50 ? "warning" : "danger"}
                                  className="w-75"
                                  style={{
                                    height: '6px',
                                    backgroundColor: candidat.score > 80 ? 'rgba(40, 167, 69, 0.1)' : 
                                                    candidat.score > 50 ? 'rgba(255, 193, 7, 0.1)' : 'rgba(220, 53, 69, 0.1)'
                                  }}
                                />
                              </td>
                              <td>
                                <Badge 
                                  bg={
                                    candidat.statut === "Accepté" ? "success" : 
                                    candidat.statut === "En revue" ? "warning" : "secondary"
                                  }
                                  style={{
                                    backgroundColor: candidat.statut === "Accepté" ? '#28a745' : 
                                                   candidat.statut === "En revue" ? '#ffc107' : '#6c757d',
                                    color: candidat.statut === "En revue" ? '#212529' : 'white'
                                  }}
                                >
                                  {candidat.statut}
                                </Badge>
                              </td>
                              <td>{candidat.date}</td>
                              <td>
                                <Dropdown>
                                  <Dropdown.Toggle variant="light" size="sm" id="dropdown-actions" className="border-0 bg-transparent">
                                    <i className="fas fa-ellipsis-v text-muted"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className="border-0 shadow-sm">
                                    <Dropdown.Item href="#" className="text-dark">
                                      <i className="fas fa-eye me-2 text-primary"></i>Voir
                                    </Dropdown.Item>
                                    <Dropdown.Item href="#" className="text-dark">
                                      <i className="fas fa-edit me-2 text-primary"></i>Modifier
                                    </Dropdown.Item>
                                    <Dropdown.Item href="#" className="text-dark">
                                      <i className="fas fa-comment me-2 text-primary"></i>Commenter
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#" className="text-danger">
                                      <i className="fas fa-trash me-2"></i>Supprimer
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Affichage de 1 à {candidats.length} sur {candidats.length} entrées</small>
                      <div>
                        <Button variant="outline-secondary" size="sm" disabled className="me-2">
                          <i className="fas fa-chevron-left"></i>
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                          <i className="fas fa-chevron-right"></i>
                        </Button>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>

        <footer className="py-3" style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #eaeaea',marginLeft: '-280px', paddingLeft: '280px' }}>
          <Container>
            <Row className="align-items-center">
              <Col md={6} className="text-center text-md-start">
                <small className="text-muted">© 2025 SmartHireCape by Whitecape Technologies. Tous droits réservés.</small>
              </Col>
              <Col md={6} className="text-center text-md-end">
                <small className="text-muted">
                  <a href="#" className="text-decoration-none me-3">Confidentialité</a>
                  <a href="#" className="text-decoration-none me-3">Conditions</a>
                  <a href="#" className="text-decoration-none">Support</a>
                </small>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    </div>
  );
}

export default App;