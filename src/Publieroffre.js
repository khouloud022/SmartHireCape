import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, FloatingLabel, Alert, Image, Container } from 'react-bootstrap';
import HeaderAndSidebar from './HeaderAndSidebar';


const OffreEmploiForm = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [validated, setValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [offre, setOffre] = useState({
    titre: '',
    typeContrat: 'CDI',
    entreprise: '',
    description: '',
    competences: '',
    salaire: '',
    dateLimite: '',
    missions: '',
    etat: 'En cours'
  });

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/offres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offre),
      });

      if (response.ok) {
        setShowSuccess(true);
        setOffre({
          titre: '',
          typeContrat: 'CDI',
          entreprise: '',
          description: '',
          competences: '',
          salaire: '',
          dateLimite: '',
          missions: '',
          etat: 'En cours'
        });
        setValidated(false);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        throw new Error("Erreur serveur");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffre(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <HeaderAndSidebar />
      <br></br><br></br><br></br>
      <Container >
  <Card className="shadow-sm text-center bg-light border-0" style={{ borderRadius: '2rem' }}>
    <Card.Body>
      <div className="animated-text"><span>
              <span style={{ color: 'rgb(0, 125, 175)' }}>Whitecape </span>
              <span style={{ color: '#E63946' }}>est à la </span>
              <span style={{ color: '#28A745' }}>recherche </span>
              <span style={{ color: '#FFD700' }}>des nouveaux </span>
              <span style={{ color: '#4B0082' }}>profils </span>
            
            </span></div>
    </Card.Body>
  </Card>
</Container>

      <Container className="py-1">
        <Card className="shadow-lg border-0 animate__animated animate__fadeInRight" style={{ borderRadius: '1.5rem' , maxWidth: '100%' }}>
          <Row className="g-0">
            <Col md={7} className="d-none d-md-block">
              <Image src="../joinus.png" alt="Illustration" fluid style={{borderTopLeftRadius: '1.5rem',borderBottomLeftRadius: '1.5rem',height: '100%',objectFit: 'cover' }}/>
            </Col>

            <Col md={5}>
              <Card.Body className="px-5 py-4" style={{textAlign: "center"}}>
                <h4>
                 
                  Publier une offre d'emploi
                </h4>
                <br></br>
                {showSuccess && (
                  <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                    ✅ Offre publiée avec succès !
                  </Alert>
                )}
                {showError && (
                  <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                    ❌ Une erreur est survenue. Veuillez réessayer.
                  </Alert>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <FloatingLabel controlId="titre" label="Titre du poste *" className="mb-3">
                        <Form.Control required type="text" name="titre" value={offre.titre} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">Veuillez saisir un titre</Form.Control.Feedback>
                      </FloatingLabel>
                    </Col>
                    <Col md={6}>
                      <FloatingLabel controlId="typeContrat" label="Type de contrat *" className="mb-3">
                        <Form.Select required name="typeContrat" value={offre.typeContrat} onChange={handleChange}>
                          <option value="CDI">CDI</option>
                          <option value="CDD">CDD</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Alternance">Alternance</option>
                        </Form.Select>
                      </FloatingLabel>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <FloatingLabel controlId="entreprise" label="Entreprise *" className="mb-3">
                        <Form.Control required type="text" name="entreprise" value={offre.entreprise} onChange={handleChange} />
                      </FloatingLabel>
                    </Col>
                    <Col md={6}>
                      <FloatingLabel controlId="dateLimite" label="Date limite" className="mb-3">
                        <Form.Control type="date" name="dateLimite" value={offre.dateLimite} onChange={handleChange} />
                      </FloatingLabel>
                    </Col>
                  </Row>

                  <FloatingLabel controlId="description" label="Description du poste *" className="mb-3">
                    <Form.Control as="textarea" required name="description" value={offre.description} onChange={handleChange} style={{ height: '150px' }} />
                  </FloatingLabel>

                  <FloatingLabel controlId="competences" label="Compétences requises *" className="mb-3">
                    <Form.Control as="textarea" required name="competences" value={offre.competences} onChange={handleChange} style={{ height: '150px' }} />
                  </FloatingLabel>

                  <FloatingLabel controlId="missions" label="Missions principales *" className="mb-3">
                    <Form.Control as="textarea" required name="missions" value={offre.missions} onChange={handleChange} style={{ height: '150px' }} />
                  </FloatingLabel>

                  <FloatingLabel controlId="salaire" label="Salaire (confidentiel)" className="mb-4">
                    <Form.Control type="text" name="salaire" value={offre.salaire} onChange={handleChange} />
                  </FloatingLabel>

                  <div className="d-flex justify-content-end mt-4">
                    <Button variant="outline-secondary" className="me-3 rounded-pill px-4" onClick={() => window.history.back()}>
                      Annuler
                    </Button>
                    <Button type="submit" className="rounded-pill px-4 shadow-sm" style={{ backgroundColor: '#2a5bd7', borderColor: '#2a5bd7' }}>
                      <i className="fas fa-paper-plane me-2"></i>
                      Publier
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default OffreEmploiForm;
