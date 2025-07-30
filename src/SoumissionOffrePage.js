import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, Box, CircularProgress, Paper, Chip } from '@mui/material';
import SoumissionCandidature from './CandidatSubmission';

function SoumissionOffrePage() {
  const { offreId } = useParams();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/offres/${offreId}`)
      .then(response => {
        setOffre(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération de l'offre:", error);
        setLoading(false);
      });
  }, [offreId]);

  if (loading) return <CircularProgress />;
  if (!offre) return <Typography color="error">Offre introuvable</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Affichage de l'offre à gauche */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>{offre.titre}</Typography>
            <Typography variant="subtitle1" gutterBottom>{offre.entreprise}</Typography>
            <Typography variant="body2" gutterBottom>{offre.missions}</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2"><strong>Type de contrat :</strong> {offre.typeContrat}</Typography>
              <Typography variant="body2"><strong>Date limite :</strong> {new Date(offre.dateLimite).toLocaleDateString('fr-FR')}</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom><strong>Compétences :</strong></Typography>
              {offre.competences.split(',').map((comp, index) => (
                <Chip key={index} label={comp.trim()} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Formulaire de candidature à droite */}
        <Grid item xs={12} md={7}>
          <SoumissionCandidature preselectedOffreId={offreId} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SoumissionOffrePage;
