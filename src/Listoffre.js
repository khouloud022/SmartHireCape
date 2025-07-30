import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderWithSidebar from "./HeaderAndSidebar";
import { 
  Container, Typography, Paper, Button, Chip, Box, IconButton,
  Grid, Card, CardContent, CardActions, Avatar, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Snackbar, Alert
} from "@mui/material";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CodeIcon from '@mui/icons-material/Code';
import CloseIcon from '@mui/icons-material/Close';

function ListeOffres() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentOffre, setCurrentOffre] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchOffres();
  }, []);

  const fetchOffres = () => {
    setLoading(true);
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
  };

  const handleEditClick = (offre) => {
    setCurrentOffre(offre);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setCurrentOffre(null);
  };

  const handleEditSubmit = () => {
    axios.put(`${process.env.REACT_APP_API_BASE_URL}/offres/${currentOffre.id}`, currentOffre)
      .then(() => {
        setSnackbar({ open: true, message: 'Offre mise à jour avec succès', severity: 'success' });
        fetchOffres();
        handleEditClose();
      })
      .catch(error => {
        console.error("Erreur lors de la mise à jour de l'offre:", error);
        setSnackbar({ open: true, message: 'Erreur lors de la mise à jour', severity: 'error' });
      });
  };

  const handleFieldChange = (field) => (event) => {
    setCurrentOffre({
      ...currentOffre,
      [field]: event.target.value
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      axios.delete(`${process.env.REACT_APP_API_BASE_URL}/offres/${id}`)
        .then(() => {
          setOffres(offres.filter(offre => offre.id !== id));
          setSnackbar({ open: true, message: 'Offre supprimée avec succès', severity: 'success' });
        })
        .catch(error => {
          console.error("Erreur lors de la suppression de l'offre:", error);
          setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
        });
    }
  };

  const handleTerminer = (id) => {
    axios.patch(`${process.env.REACT_APP_API_BASE_URL}/offres/${id}`, { etat: "Assignée" })
      .then(() => {
        setOffres(offres.map(offre => 
          offre.id === id ? { ...offre, etat: "Assignée" } : offre
        ));
        setSnackbar({ open: true, message: 'Offre marquée comme terminée', severity: 'success' });
      })
      .catch(error => {
        console.error("Erreur lors de la mise à jour de l'état:", error);
        setSnackbar({ open: true, message: 'Erreur lors de la mise à jour', severity: 'error' });
      });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getEtatColor = (etat) => {
    switch(etat) {
      case 'Assignée': return 'success';
      case 'En cours': return 'info';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Chargement en cours...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (offres.length === 0) return <Typography>Aucune offre disponible</Typography>;

  return (
    <div className="App">
      <HeaderWithSidebar />
      
      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Box sx={{ position: 'relative', mb: 6, borderRadius: 2, overflow: 'hidden', height: '200px'}}>
          <img 
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Offres d'emploi" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
          />
          <Typography variant="h3" component="h1" sx={{
            position: 'absolute', bottom: 0, left: 0, p: 3,
            color: 'white', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Offres d'Emploi Disponibles
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {offres.map((offre) => (
            <Grid item xs={12} md={6} lg={4} key={offre.id}>
              <Card elevation={3} sx={{
                height: '100%', display: 'flex', flexDirection: 'column',
                transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' }
              }}>
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
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditClick(offre)}
                      aria-label="éditer"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(offre.id)}
                      aria-label="supprimer"
                    >
                      <DeleteIcon />
                    </IconButton>
                    {offre.etat === "En cours" && (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleTerminer(offre.id)}
                        size="small"
                      >
                        Terminer
                      </Button>
                    )}
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Dialog pour l'édition d'une offre */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Modifier l'offre
          <IconButton onClick={handleEditClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {currentOffre && (
            <Grid container spacing={3} sx={{ pt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Titre"
                  fullWidth
                  value={currentOffre.titre}
                  onChange={handleFieldChange('titre')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Entreprise"
                  fullWidth
                  value={currentOffre.entreprise}
                  onChange={handleFieldChange('entreprise')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Type de contrat"
                  select
                  fullWidth
                  value={currentOffre.typeContrat}
                  onChange={handleFieldChange('typeContrat')}
                  margin="normal"
                >
                  <MenuItem value="CDI">CDI</MenuItem>
                  <MenuItem value="CDD">CDD</MenuItem>
                  <MenuItem value="Stage">Stage</MenuItem>
                  <MenuItem value="Alternance">Alternance</MenuItem>
                  <MenuItem value="Freelance">Freelance</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date limite"
                  type="date"
                  fullWidth
                  value={currentOffre.dateLimite.split('T')[0]}
                  onChange={handleFieldChange('dateLimite')}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Missions"
                  multiline
                  rows={4}
                  fullWidth
                  value={currentOffre.missions}
                  onChange={handleFieldChange('missions')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Compétences requises (séparées par des virgules)"
                  fullWidth
                  value={currentOffre.competences}
                  onChange={handleFieldChange('competences')}
                  margin="normal"
                  helperText="Exemple: Java, React, Communication"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Annuler</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ListeOffres;