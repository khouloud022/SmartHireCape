import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderAndSidebar from './HeaderAndSidebarcand';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Alert, useTheme, Box, LinearProgress,
  TableContainer, Avatar, Chip, Slide, Fade, Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import keycloak from './keycloak';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  marginTop: theme.spacing(4),
  boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px -5px rgba(0,0,0,0.15)'
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transition: 'background-color 0.3s ease'
  }
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
  fontWeight: 600,
  ...(status.includes('Accept') && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark
  }),
  ...(status.includes('Rejet') && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark
  }),
  ...(status.includes('En cours') && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark
  })
}));

function MesSoumissions() {
  const [candidatures, setCandidatures] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (keycloak.authenticated) {
      const email = keycloak.tokenParsed?.email;

      axios.get(`http://localhost:8085/api/candidatures/by-email`, {
        params: { email }
      })
      .then(res => {
        setCandidatures(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("Impossible de récupérer vos candidatures.");
        setLoading(false);
      });
    }
  }, []);

  const getStatusIcon = (status) => {
    if (status.includes('Accept')) return <CheckCircleIcon style={{ marginRight: 5 }} />;
    if (status.includes('Rejet')) return <CancelIcon style={{ marginRight: 5 }} />;
    return <HourglassEmptyIcon style={{ marginRight: 5 }} />;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <HeaderAndSidebar />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mt: 10, 
              mb: 6, 
              textAlign: 'center', 
              fontWeight: 700, 
              color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
              textShadow: theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '80px',
                height: '4px',
                background: theme.palette.secondary.main,
                margin: '16px auto 0',
                borderRadius: '2px'
              }
            }}
          >
            Mes Candidatures
          </Typography>
        </Zoom>

        {loading ? (
          <Box sx={{ width: '100%', mt: 4 }}>
            <LinearProgress color="secondary" />
          </Box>
        ) : (
          <>
            {errorMessage && (
              <Fade in={!!errorMessage}>
                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                  {errorMessage}
                </Alert>
              </Fade>
            )}

            {candidatures.length === 0 ? (
              <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                  <Typography variant="h6" color="textSecondary">
                    Aucune candidature trouvée
                  </Typography>
                </Paper>
              </Slide>
            ) : (
              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.primary.main }}>
                      <TableCell sx={{ color: theme.palette.common.white, fontWeight: 600 }}>Offre</TableCell>
                      <TableCell sx={{ color: theme.palette.common.white, fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ color: theme.palette.common.white, fontWeight: 600 }}>Expérience</TableCell>
                      <TableCell sx={{ color: theme.palette.common.white, fontWeight: 600 }}>État</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {candidatures.map((cand, index) => (
                      <Fade in={true} key={cand.id} style={{ transitionDelay: `${index * 50}ms` }}>
                        <StyledTableRow>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ 
                                bgcolor: theme.palette.secondary.main, 
                                mr: 2,
                                width: 36,
                                height: 36,
                                fontSize: '1rem'
                              }}>
                                {cand.offre?.titre?.charAt(0) || 'N'}
                              </Avatar>
                              <Typography fontWeight="500">
                                {cand.offre?.titre || "N/A"}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary">
                              {new Date(cand.dateSoumission).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${cand.experience} an(s)`} 
                              color="info"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <StatusChip
                              icon={getStatusIcon(cand.etat)}
                              label={cand.etat}
                              status={cand.etat}
                            />
                          </TableCell>
                        </StyledTableRow>
                      </Fade>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default MesSoumissions;