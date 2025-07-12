import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell,  TableContainer, TableHead, TableRow, Paper, Alert,  CircularProgress, Box, InputAdornment, TextField, Chip, Avatar, Link, Skeleton, IconButton, Tooltip} from "@mui/material";
import HeaderAndSidebar from "./HeaderAndSidebar";
import { Search as SearchIcon,  Download as DownloadIcon, FilterList as FilterIcon, Refresh as RefreshIcon} from "@mui/icons-material";
import axios from "axios";
import { lightBlue, deepOrange, green, purple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transition: 'background-color 0.3s ease',
  },
}));

const ExperienceChip = styled(Chip)(({ value }) => ({
  backgroundColor: value > 5 ? green[500] : value > 2 ? lightBlue[500] : deepOrange[500],
  color: 'white',
  fontWeight: 'bold',
}));

function ListeCandidats() {
  const [candidatures, setCandidatures] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    setRefreshing(true);
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/candidatures`)
      .then(response => {
        setCandidatures(response.data);
        setFilteredCandidatures(response.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des candidatures :", err);
        setError("Impossible de charger les candidatures.");
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchId(value);
    const filtered = candidatures.filter(
      (c) => c.offre?.id?.toString().includes(value)
    );
    setFilteredCandidatures(filtered);
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh'}}>
      <HeaderAndSidebar />
      <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
        <Box sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          p: 4,
          mb: 4
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Liste des Candidatures
            </Typography>
            <Box>
              <Tooltip title="Actualiser">
                <IconButton onClick={handleRefresh} color="primary" disabled={refreshing}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filtrer">
                <IconButton color="primary">
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <TextField
              label="Rechercher par ID de l'offre"
              variant="outlined"
              value={searchId}
              onChange={handleSearchChange}
              sx={{ width: 400 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Chip 
              label={`${filteredCandidatures.length} candidatures trouvées`} 
              color="primary" 
              variant="outlined"
            />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          ) : filteredCandidatures.length === 0 ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              textAlign: 'center'
            }}>
              <SearchIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                Aucune candidature trouvée
              </Typography>
              <Typography color="textSecondary">
                Essayez de modifier vos critères de recherche
              </Typography>
            </Box>
          ) : (
            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="table des candidats">
                <TableHead sx={{ backgroundColor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Candidat</TableCell>
                    <TableCell sx={{ color: 'white' }}>Contact</TableCell>
                    <TableCell align="center" sx={{ color: 'white' }}>Expérience</TableCell>
                    <TableCell sx={{ color: 'white' }}>Compétences</TableCell>
                    <TableCell align="center" sx={{ color: 'white' }}>Offre ID</TableCell>
                    <TableCell align="center" sx={{ color: 'white' }}>CV</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCandidatures.map((candidat, index) => (
                    <StyledTableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: purple[500] }}>
                            {candidat.nomComplet.charAt(0)}
                          </Avatar>
                          <Typography fontWeight="medium">
                            {candidat.nomComplet}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{candidat.email}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {candidat.telephone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <ExperienceChip 
                          label={`${candidat.experience} ans`} 
                          value={candidat.experience}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {candidat.competence.split(',').map((skill, i) => (
                            <Chip 
                              key={i} 
                              label={skill.trim()} 
                              size="small" 
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`#${candidat.offre.id}`} 
                          color="secondary" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {candidat.cvpath && (
                          <Tooltip title="Télécharger le CV">
                            <IconButton
                              component={Link}
                              href={`http://localhost:8085/api/candidatures/download-cv/${candidat.cvpath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              color="primary"
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default ListeCandidats;