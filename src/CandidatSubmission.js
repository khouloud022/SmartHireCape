import React, { useEffect, useState } from "react";
import HeaderAndSidebarcand from "./HeaderAndSidebarcand";
import axios from "axios";
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Alert, Box, Paper, Grid, useTheme, useMediaQuery} from "@mui/material";
import './App.css';
import keycloak from './keycloak';

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
      console.log(email);
      const prenom = keycloak.tokenParsed?.given_name;
      console.log(prenom);
      const nom = keycloak.tokenParsed?.family_name;
      console.log(nom);
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
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <HeaderAndSidebarcand />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6} order={isMobile ? 2 : 1}>
            <Paper sx={{ p: 4, borderRadius: 3, background: 'white' }} elevation={0}>
              <Typography variant="h4" align="center" fontWeight="bold" sx={{ color: theme.palette.primary.main, mb: 4 }}>
                Postulez maintenant!
              </Typography>

              {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}
              {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}

              <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                  <InputLabel>Offre d'emploi</InputLabel>
                  <Select
                    name="offreId"
                    value={formData.offreId}
                    onChange={handleChange}
                    required
                    sx={{ borderRadius: 2 }}
                  >
                    {offres.map((offre) => (
                      <MenuItem key={offre.id} value={offre.id}>
                        {offre.titre} - {offre.entreprise}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField label="Nom complet" name="nomcomplet" value={formData.nomcomplet} onChange={handleChange} fullWidth margin="normal" required sx={{ mb: 2 }} />
                <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required sx={{ mb: 2 }} />
                <TextField label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} fullWidth margin="normal" required sx={{ mb: 2 }} />
                <TextField label="Années d'expérience" name="experience" type="number" value={formData.experience} onChange={handleChange} fullWidth margin="normal" required sx={{ mb: 2 }} />
                <TextField label="Compétences" name="competence" value={formData.competence} onChange={handleChange} placeholder="Ex: React, Java, Spring Boot" fullWidth margin="normal" required sx={{ mb: 2 }} />
                <TextField label="Introduction générale" name="introduction" value={formData.introduction} onChange={handleChange} fullWidth margin="normal" multiline rows={3} required sx={{ mb: 2 }} />

                <Box sx={{ mt: 3, mb: 3 }}>
                  <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderRadius: 2 }}>
                    Joindre votre CV
                    <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
                  </Button>
                  {formData.cv && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Fichier sélectionné : {formData.cv.name}
                    </Typography>
                  )}
                </Box>

                <Box textAlign="center" mt={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={candidatureExist}
                    sx={{
                      px: 6, py: 1.5, borderRadius: 2, fontWeight: 'bold',
                      '&:hover': { boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)' }
                    }}
                  >
                    Soumettre ma candidature
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} order={isMobile ? 1 : 2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box component="img" src="/candidature.png" alt="Candidature" sx={{ width: "100%", maxWidth: "500px", height: "auto" }} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default SoumissionCandidature;
