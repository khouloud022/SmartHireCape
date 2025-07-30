import React, { useEffect, useState } from "react";
import HeaderAndSidebarcand from "./HeaderAndSidebarcand";
import axios from "axios";
import { 
  Container, Typography, FormControl, InputLabel, Select, 
  MenuItem, TextField, Button, Alert, Box, Paper, Grid, 
  useTheme, useMediaQuery, Fade, Slide, Grow, Avatar,
  InputAdornment, IconButton, CircularProgress
} from "@mui/material";
import { 
  AttachFile, CheckCircle, Send, 
  WorkOutline, PersonOutline, EmailOutlined,
  PhoneOutlined, SchoolOutlined, DescriptionOutlined
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import './App.css';
import keycloak from './keycloak';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

function SoumissionCandidature() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [offres, setOffres] = useState([]);
  const [formData, setFormData] = useState({
    offreId: "",
    nomcomplet: "",
    email: "",
    telephone: "",
    experience: "",
    competence: "",
    introduction: "",
    cv: null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [candidatureExist, setCandidatureExist] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/offres`)
      .then(response => setOffres(response.data))
      .catch(error => {
        console.error("Erreur lors du chargement des offres:", error);
        setErrorMessage("Impossible de charger les offres.");
      });
  }, []);

  useEffect(() => {
    if (keycloak.authenticated) {
      const email = keycloak.tokenParsed?.email;
      const prenom = keycloak.tokenParsed?.given_name;
      const nom = keycloak.tokenParsed?.family_name;
      setFormData(prev => ({
        ...prev,
        nomcomplet: `${prenom} ${nom}`,
        email: email,
      }));
    }
  }, []);

  useEffect(() => {
    if (formData.offreId && formData.email) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/candidatures/exists`, {
        params: {
          offreId: formData.offreId,
          email: formData.email
        }
      })
      .then(res => {
        if (res.data.exists) {
          setCandidatureExist(true);
          setErrorMessage("Vous avez déjà postulé à cette offre.");
        } else {
          setCandidatureExist(false);
          setErrorMessage("");
        }
      })
      .catch(err => {
        console.error("Erreur vérification candidature:", err);
        setCandidatureExist(false);
      });
    }
  }, [formData.offreId, formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, cv: e.target.files[0] }));
    setFileUploaded(true);
    setTimeout(() => setFileUploaded(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (candidatureExist) return;
    
    const {
      offreId, nomcomplet, email, telephone, experience, competence, introduction, cv
    } = formData;

    if (!offreId || !nomcomplet || !email || !telephone || !experience || !competence || !introduction || !cv) {
      setErrorMessage("Tous les champs sont requis.");
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("offreId", offreId);
    data.append("nomcomplet", nomcomplet);
    data.append("email", email);
    data.append("telephone", telephone);
    data.append("experience", experience);
    data.append("competence", competence);
    data.append("introduction", introduction);
    data.append("cv", cv);

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/candidatures`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Candidature soumise avec succès !");
      setErrorMessage("");
      setFormData({
        offreId: "",
        nomcomplet: "",
        email: "",
        telephone: "",
        experience: "",
        competence: "",
        introduction: "",
        cv: null,
      });
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setErrorMessage("Une erreur est survenue lors de la soumission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)'
    }}>
      <HeaderAndSidebarcand />

      <Container maxWidth="lg" sx={{ py: 15 }}>
        <Fade in timeout={800}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6} order={isMobile ? 2 : 1}>
              <Paper sx={{ 
                p: 4, 
                borderRadius: 3, 
                background: 'white',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                borderLeft: '5px solid ' + theme.palette.primary.main,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)'
                }
              }} elevation={0}>
                <Box textAlign="center" mb={4}>
                  <Avatar sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    width: 60, 
                    height: 60,
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <WorkOutline fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" sx={{ 
                    color: theme.palette.primary.main, 
                    mb: 1,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Postulez maintenant
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Remplissez le formulaire pour soumettre votre candidature
                  </Typography>
                </Box>

                {successMessage && (
                  <Grow in>
                    <Alert 
                      severity="success" 
                      icon={<CheckCircle fontSize="inherit" />}
                      sx={{ mb: 3, borderRadius: 2 }}
                    >
                      {successMessage}
                    </Alert>
                  </Grow>
                )}
                {errorMessage && (
                  <Grow in>
                    <Alert 
                      severity="error" 
                      sx={{ mb: 3, borderRadius: 2 }}
                    >
                      {errorMessage}
                    </Alert>
                  </Grow>
                )}

                <form onSubmit={handleSubmit}>
                  <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <InputLabel>Offre d'emploi</InputLabel>
                    <Select
                      name="offreId"
                      value={formData.offreId}
                      onChange={handleChange}
                      required
                      sx={{ borderRadius: 2 }}
                      startAdornment={
                        <InputAdornment position="start">
                          <WorkOutline color="action" />
                        </InputAdornment>
                      }
                    >
                      {offres.map((offre) => (
                        <MenuItem key={offre.id} value={offre.id}>
                          {offre.titre} - {offre.entreprise}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField 
                    label="Nom complet" 
                    name="nomcomplet" 
                    value={formData.nomcomplet} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    required 
                    sx={{ mb: 3 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField 
                    label="Email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    required 
                    sx={{ mb: 3 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField 
                    label="Téléphone" 
                    name="telephone" 
                    value={formData.telephone} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    required 
                    sx={{ mb: 3 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneOutlined color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField 
                    label="Années d'expérience" 
                    name="experience" 
                    type="number" 
                    value={formData.experience} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    required 
                    sx={{ mb: 3 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SchoolOutlined color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField 
                    label="Compétences" 
                    name="competence" 
                    value={formData.competence} 
                    onChange={handleChange} 
                    placeholder="Ex: React, Java, Spring Boot" 
                    fullWidth 
                    margin="normal" 
                    required 
                    sx={{ mb: 3 }} 
                  />
                  
                  <TextField 
                    label="Introduction générale" 
                    name="introduction" 
                    value={formData.introduction} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    multiline 
                    rows={4} 
                    required 
                    sx={{ mb: 3 }} 
                  />

                  <Box sx={{ mt: 3, mb: 4 }}>
                    <Button 
                      variant="outlined" 
                      component="label" 
                      fullWidth 
                      sx={{ 
                        py: 2, 
                        borderRadius: 2,
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        transition: 'all 0.3s ease',
                        animation: fileUploaded ? `${pulse} 1s ease` : 'none',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: 'rgba(25, 118, 210, 0.04)'
                        }
                      }}
                      startIcon={<AttachFile />}
                    >
                      Joindre votre CV (PDF, DOC)
                      <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
                    </Button>
                    {formData.cv && (
                      <Box sx={{ 
                        mt: 2, 
                        display: 'flex', 
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2
                      }}>
                        <DescriptionOutlined color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {formData.cv.name}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box textAlign="center" mt={4}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={candidatureExist || isSubmitting}
                      sx={{
                        px: 6, 
                        py: 1.5, 
                        borderRadius: 2, 
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        '&:hover': { 
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                          transform: 'translateY(-2px)'
                        },
                        minWidth: 220,
                        height: 48
                      }}
                      startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}
                    </Button>
                  </Box>
                </form>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} order={isMobile ? 1 : 2}>
              <Slide in direction="up" timeout={600}>
                <Box sx={{ 
                  position: 'relative',
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '100%'
                }}>
                  <Box component="img" 
                    src="/candidature.png" 
                    alt="Candidature" 
                    sx={{ 
                      width: "100%", 
                      maxWidth: "600px", 
                      height: "auto",
                      filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))'
                    }} 
                  />
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '20%',
                    background: 'linear-gradient(to top, rgba(248, 250, 252, 1) 0%, rgba(248, 250, 252, 0) 100%)',
                    zIndex: 1
                  }} />
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </div>
  );
}

export default SoumissionCandidature;