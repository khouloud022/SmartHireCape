import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderWithSidebar from "./HeaderAndSidebarcand";
import { Container, Typography, Paper, Button, Chip, Box, IconButton,Grid,Card,CardContent,CardActions,Avatar, Divider} from "@mui/material";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CodeIcon from '@mui/icons-material/Code';
import { useNavigate } from 'react-router-dom';
import SoumissionOffrePage from "./SoumissionOffrePage";
function ListeOffres() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
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
  }, []);

  const handleEdit = (id) => {
    console.log("Éditer l'offre avec l'ID:", id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      axios.delete(`http://localhost:8085/api/offres/${id}`)
        .then(() => {
          setOffres(offres.filter(offre => offre.id !== id));
        })
        .catch(error => {
          console.error("Erreur lors de la suppression de l'offre:", error);
        });
    }
  };

  const handleTerminer = (id) => {
    axios.patch(`http://localhost:8085/api/offres/${id}`, { etat: "Assignée" })
      .then(response => {
        setOffres(offres.map(offre => 
          offre.id === id ? { ...offre, etat: "Assignée" } : offre
        ));
      })
      .catch(error => {
        console.error("Erreur lors de la mise à jour de l'état:", error);
      });
  };

  if (loading) return <Typography>Chargement en cours...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (offres.length === 0) return <Typography>Aucune offre disponible</Typography>;

  const getEtatColor = (etat) => {
    switch(etat) {
      case 'Assignée': return 'success';
      case 'En cours': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="App">
      <HeaderWithSidebar />
      
      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Box sx={{ position: 'relative', mb: 6,borderRadius: 2,overflow: 'hidden',height: '200px'}}>
          <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Offres d'emploi" style={{ width: '100%', height: '100%', objectFit: 'cover',filter: 'brightness(0.7)'}}/>
          <Typography variant="h3" component="h1" sx={{position: 'absolute',bottom: 0,left: 0,p: 3,color: 'white',fontWeight: 'bold',textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Offres d'Emploi Disponibles
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {offres.map((offre) => (
            <Grid item xs={12} md={6} lg={4} key={offre.id}>
              <Card elevation={3}
                sx={{height: '100%',display: 'flex',flexDirection: 'column',transition: 'transform 0.3s','&:hover': {transform: 'translateY(-5px)'}}}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <WorkIcon />
                    </Avatar>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                      {offre.titre}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BusinessIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">{offre.entreprise}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {format(new Date(offre.dateLimite), 'PPP', { locale: fr })}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={offre.typeContrat} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={offre.etat} 
                      color={getEtatColor(offre.etat)}
                      variant="filled"
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AssignmentIcon color="action" sx={{ mr: 1 }} />
                      Missions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {offre.missions}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CodeIcon color="action" sx={{ mr: 1 }} />
                      Compétences requises
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {offre.competences.split(',').map((competence, index) => (
                        <Chip 
                          key={index} 
                          label={competence.trim()} 
                          color="secondary"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                  
                   
                    {offre.etat === "En cours" && (
                      <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}
                        onClick={() => navigate('/SoumissionOffrePage')}
                        size="small"
                      >
                        Soumettre
                      </Button>
                    )}
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default ListeOffres;