import Keycloak from 'keycloak-js';
const API_URL = process.env.REACT_APP_API_URL;
const keycloak = new Keycloak({
  url: API_URL,
  realm: 'master',
  clientId: 'react-client',
});

export default keycloak;
  

