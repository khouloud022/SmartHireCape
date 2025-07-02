import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderWithSidebarcand from "./HeaderAndSidebarcand";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, Box, IconButton } from "@mui/material";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ListeOffres() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <HeaderWithSidebarcand />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          mb: 4,
          textAlign: 'center'
        }}>
          <br></br>
          Offres d'Emploi Disponibles
        </Typography>
        
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="tableau des offres">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Titre</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Entreprise</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type de contrat</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>État</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date limite</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Compétences</TableCell>
                 <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Missions</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offres.map((offre) => (
                <TableRow key={offre.id} hover>
                  <TableCell sx={{ fontWeight: 'bold' }}>{offre.titre}</TableCell>
                  <TableCell>{offre.entreprise}</TableCell>
                  <TableCell>
                    <Chip 
                      label={offre.typeContrat} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={offre.etat} 
                      color={getEtatColor(offre.etat)}
                      variant="filled"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(offre.dateLimite), 'PPP', { locale: fr })}
                    
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {offre.competences.split(',').map((competence, index) => (
                        <Chip 
                          key={index} 
                          label={competence.trim()} 
                          color="secondary"
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {offre.missions}
                    
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default ListeOffres;