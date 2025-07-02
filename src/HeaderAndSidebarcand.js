import React from 'react';
import { Navbar, Nav, Container, Form, Button, Dropdown, ListGroup, Image, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import keycloak from './keycloak';


const HeaderAndSidebar = () => {
    const handleLogout = () => {
    keycloak.logout({ redirectUri: 'http://localhost:3000/' });
  };
  return (
    <>
      <div className="sidebar bg-white d-none d-lg-block" style={{ width: '280px', minHeight: '100vh', position: 'fixed', borderRight: '1px solid #eaeaea', boxShadow: '2px 0 10px rgba(185, 55, 55, 0.03)' }}>
        <div className="p-4" style={{ borderBottom: '1px solid #f0f0f0' }}>
          <Col md={5} className="d-none d-md-block">
          <Image src="../logo1.png" alt="Illustration offre d'emploi" fluid style={{ borderRadius: '10px' }} />
        </Col>
          <h5 className="mb-0 text-primary">
            <Link to="/Dashboardcandidat" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>
              <span style={{ color: 'rgb(0, 125, 175)' }}>Sma</span>
              <span style={{ color: '#E63946' }}>rt</span>
              <span style={{ color: '#28A745' }}>Hire</span>
              <span style={{ color: '#FFD700' }}>Ca</span>
              <span style={{ color: '#4B0082' }}>pe</span>
            
            </span>
              </Link>
          </h5>
        </div>
       <ListGroup variant="flush" className="mt-3" style={{ fontSize: '1.1rem' }}>
                 <ListGroup.Item as={Link} to="/Dashboardcandidat" action active className="border-0 ">
                   <i className="fas fa-tachometer-alt me-2"></i> Tableau de bord
                 </ListGroup.Item>
                 <ListGroup.Item as={Link} to="/Listoffrecand" action className="border-0 text-dark hover-bg-light">
                   <i className="fas fa-users me-2"></i> Consulter les offres d'emploi 
                 </ListGroup.Item>
                 <ListGroup.Item as={Link} to="/CandidatSubmission" action className="border-0 text-dark hover-bg-light">
                   <i className="fas fa-file-alt me-2"></i> Candidater
                 </ListGroup.Item>
                 <ListGroup.Item action className="border-0 text-dark hover-bg-light">
                   <i className="fas fa-chart-line me-2"></i>Consulter les résultats des soumissions
                 </ListGroup.Item>
                 <ListGroup.Item action className="border-0 text-dark hover-bg-light">
                   <i className="fas fa-calendar-alt me-2"></i> Entretiens
                 </ListGroup.Item>
                 <ListGroup.Item action className="border-0 text-dark hover-bg-light">
                   <i className="fas fa-cog me-2"></i> Paramètres
                 </ListGroup.Item>
                 <ListGroup.Item  href='https://www.whitecapetech.com/contact' action className="border-0 text-dark hover-bg-light">
                   <i className="fas fa-question-circle me-2"></i> Aide
                 </ListGroup.Item>
        </ListGroup>
      </div>

      <Navbar expand="lg" className="fixed-top shadow-sm bg-white" style={{left: '280px', right: 0,borderBottom: '1px solid #eaeaea'}}>
        <Container fluid>
          <Navbar.Brand href="#" className="fw-bold d-lg-none text-primary">
            <i className="fas fa-brain me-2"></i>IntelliRecrut
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/Dashboardcandidat" active className="text-primary">Tableau de bord</Nav.Link>
              <Nav.Link href="http://localhost:3000/" className="text-dark">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/Listoffrecand" className="text-dark">Offres d'emploi</Nav.Link>
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link} className="text-dark">Soumissions</Dropdown.Toggle>
                <Dropdown.Menu className="border-0 shadow-sm">
                  <Dropdown.Item as={Link} to="">Toutes les soumissions</Dropdown.Item>
                  <Dropdown.Item href="#">Catégories</Dropdown.Item>
                  <Dropdown.Item href="#">Archives</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
            <Form className="d-flex me-3">
              <Form.Control type="search" placeholder="Rechercher..." className="me-2 border-light" aria-label="Search" style={{ minWidth: '250px' }}/>
              <Button variant="outline-primary">
                <i className="fas fa-search"></i>
              </Button>
            </Form>
            <Nav>
              <Dropdown align="end">
                <Dropdown.Toggle as={Nav.Link} className="text-dark">
                  <i className="fas fa-user-circle me-1"></i>
                  <span className="d-none d-lg-inline">Candidat</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end border-0 shadow-sm">
                  <Dropdown.Item as={Link} to="/Editprofilecand" className="text-dark">
                    <i className="fas fa-user me-2 text-primary"></i> Profil
                  </Dropdown.Item>
                  <Dropdown.Item href="#" className="text-dark">
                    <i className="fas fa-cog me-2 text-primary"></i> Paramètres
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-dark">
                    <i className="fas fa-sign-out-alt me-2 text-primary"></i> Déconnexion
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default HeaderAndSidebar;
