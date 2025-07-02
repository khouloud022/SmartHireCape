import React, { useEffect, useState } from "react";
import { Container,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Alert,CircularProgress,Box,InputAdornment,TextField} from "@mui/material";
import HeaderAndSidebar from "./HeaderAndSidebar";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

function ListeCandidats() {
  const [candidatures, setCandidatures] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8085/api/candidatures")
      .then(response => {
        setCandidatures(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des candidatures :", err);
        setError("Impossible de charger les candidatures.");
        setLoading(false);
      });
  }, []);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchId(value);
    const filtered = candidatures.filter(
      (c) => c.offre?.id?.toString().includes(value)
    );
    setFilteredCandidatures(filtered);
  };

  return (
    <div>
      <HeaderAndSidebar /><br></br><br></br>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
          Liste des candidatures
        </Typography>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <TextField label="Rechercher par ID de l'offre" variant="outlined" value={searchId} onChange={handleSearchChange} sx={{ width: 400 }} InputProps={{startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper} elevation={3} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nom Complet</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Téléphone</strong></TableCell>
                  <TableCell><strong>Expérience (ans)</strong></TableCell>
                  <TableCell><strong>Compétences</strong></TableCell>
                  <TableCell><strong>Offre ID</strong></TableCell>
                  <TableCell><strong>CV</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidatures.map((candidat, index)  => (
                  <TableRow key={index}>
                    <TableCell>{candidat.nomComplet}</TableCell>
                    <TableCell>{candidat.email}</TableCell>
                    <TableCell>{candidat.telephone}</TableCell>
                    <TableCell>{candidat.experience}</TableCell>
                    <TableCell>{candidat.competence}</TableCell>
                    <TableCell>{candidat.offre.id}</TableCell>
                    <TableCell>
                      {candidat.cvpath && (
                        <a href={`http://localhost:8085/api/candidatures/download-cv/${candidat.cvpath}`} target="_blank" rel="noopener noreferrer">
  Télécharger
</a>

                      )}
                      
                    </TableCell>
                  </TableRow>
                ))}
                
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </div>
  );
}

export default ListeCandidats;







