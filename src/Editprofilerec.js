import React, { useEffect, useState } from "react";
import keycloak from "./keycloak";
import {Container,Card,CardContent,Typography,Avatar,Button,Grid,CircularProgress,} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import HeaderAndSidebar from "./HeaderAndSidebar";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (keycloak.authenticated) {
      keycloak
        .loadUserInfo()
        .then((user) => setUserInfo(user))
        .catch((err) => console.error("Error loading user info", err));
    }
  }, []);

  const handleEditProfile = () => {
    keycloak.accountManagement();
  };

  if (!userInfo) {
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div>
    <HeaderAndSidebar />
    <Container sx={{ mt: 5 }}>
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                bgcolor: "#1976d2",
              }}
            >
              <AccountCircle sx={{ fontSize: 100 }} />
            </Avatar>
          </Grid>

          <Grid item xs={12} sm={8}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {userInfo.name || userInfo.preferred_username}
              </Typography>
              <Typography variant="body1">
                <strong>Nom d'utilisateur :</strong>{" "}
                {userInfo.preferred_username}
              </Typography>
              <Typography variant="body1">
                <strong>Email :</strong> {userInfo.email}
              </Typography>
              <Typography variant="body1">
                <strong>ID utilisateur :</strong> {userInfo.sub}
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleEditProfile}
              >
                Modifier le profil
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
    </div>
  );
};

export default UserProfile;
