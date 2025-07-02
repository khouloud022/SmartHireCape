import React, { useEffect, useState } from "react";
import HeaderAndSidebarcand from "./HeaderAndSidebarcand";
import axios from "axios";
import {Container,Typography,FormControl,InputLabel,Select,MenuItem,TextField,Button,Alert,Box,Paper,Grid,useTheme,useMediaQuery,} from "@mui/material";
import './App.css';

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

  useEffect(() => {
    axios.get("http://localhost:8085/api/offres")
      .then(response => {
        setOffres(response.data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des offres:", error);
        setErrorMessage("Impossible de charger les offres.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, cv: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      await axios.post("http://localhost:8085/api/candidatures", data, {
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
            <Paper sx={{ p: 4, height: "100%", borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', background: 'white', }} elevation={0}>
              <Typography variant="h4"  gutterBottom  align="center"  fontWeight="bold"  sx={{ color: theme.palette.primary.main, mb: 4, fontSize: isMobile ? '1.8rem' : '2.125rem' }} >
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

                <TextField  label="Nom complet"  name="nomcomplet"  value={formData.nomcomplet} onChange={handleChange}  fullWidth  margin="normal"  required   sx={{ mb: 2 }} />
                <TextField  label="Email"  name="email"  type="email"  value={formData.email}  onChange={handleChange}  fullWidth  margin="normal"  required  sx={{ mb: 2 }} />
                <TextField  label="Téléphone"  name="telephone"  value={formData.telephone}  onChange={handleChange}  fullWidth  margin="normal"  required  sx={{ mb: 2 }} />
                <TextField  label="Années d'expérience"  name="experience"  type="number"   value={formData.experience}   onChange={handleChange}  fullWidth  margin="normal"  required  sx={{ mb: 2 }} />
                <TextField  label="Compétences"   name="competence"   value={formData.competence}   onChange={handleChange}  placeholder="Ex: React, Java, Spring Boot"   fullWidth  margin="normal"  required  sx={{ mb: 2 }}  />
                <TextField  label="Introduction générale"   name="introduction"  value={formData.introduction} onChange={handleChange}  fullWidth  margin="normal"  multiline  rows={3}  required  sx={{ mb: 2 }}  />
                
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Button  variant="outlined"  component="label"  fullWidth sx={{  py: 1.5, borderRadius: 2, borderWidth: 2, '&:hover': {  borderWidth: 2,  } }}>
                    Joindre votre CV
                    <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
                  </Button>
                  {formData.cv && (
                    <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                      Fichier sélectionné : {formData.cv.name}
                    </Typography>
                  )}
                </Box>

                <Box textAlign="center" mt={4}>
                  <Button type="submit" variant="contained"  color="primary"   size="large" sx={{   px: 6,  py: 1.5,  borderRadius: 2,  fontSize: '1rem', fontWeight: 'bold', textTransform: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', '&:hover': { boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)', } }}  >
                    Soumettre ma candidature
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
          <Grid  item  xs={12}  md={6}  order={isMobile ? 1 : 2} sx={{  display: "flex",  justifyContent: "center", alignItems: "center", height: isMobile ? 'auto' : '100%'  }}>
            <Box component="img"  src="/candidature.png"  alt="Candidature"  sx={{  width: "100%", maxWidth: "500px", height: "auto", objectFit: "contain", borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)'}}  />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default SoumissionCandidature;