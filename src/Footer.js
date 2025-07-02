import React from "react";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

const Footer = () => {
  const footerStyles = {
    footer: {
      backgroundColor: "black",
      color: "white",
      padding: "2rem",
      fontFamily: "Arial, sans-serif"
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto"
    },
    columns: {
      display: "flex",
      flexDirection: "column",
      gap: "2rem"
    },
    column: {
      flex: 1
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "white",
      marginBottom: "1rem"
    },
    subtitle: {
      fontSize: "1.29rem",
      fontWeight: "600",
      color: "white",
      marginBottom: "1rem"
    },
    text: {
      fontSize: "1.2rem",
      lineHeight: "1.5",
      color:"white"
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: 0
    },
    listItem: {
      marginBottom: "0.5rem"
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontSize: "1.2rem"
    },
    address: {
      fontStyle: "normal",
      fontSize: "1.2rem",
      lineHeight: "1.5"
    },
    socialIcons: {
      display: "flex",
      gap: "1rem",
      marginTop: "1rem",
      color: "#666"
    },
    copyright: {
      borderTop: "1px solid #ddd",
      marginTop: "2rem",
      paddingTop: "1.5rem",
      textAlign: "center",
      fontSize: "1.2rem",
      color: "#777"
    }
  };

  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.container}>
        <div style={{...footerStyles.columns, flexDirection: "row", flexWrap: "wrap"}}>
          <div style={{...footerStyles.column, flexBasis: "40%"}}>
            
            <img src="/logo1.png" alt="logo" style={{ height:'40px' }}></img>
            <h1 style={footerStyles.title}>Whitecape</h1>
            <p style={footerStyles.text}>
              Whitecape est une entreprise Franco-Tunisienne qui a cumulé une longue expérience 
              dans la gestion de projets en local et en mode Nearshore...
            </p>
          </div>

          <div style={footerStyles.column}>
            <h2 style={footerStyles.subtitle}>Liens utiles</h2>
            <ul style={footerStyles.list}>
              <li style={footerStyles.listItem}><a href="https://www.whitecapetech.com/" style={footerStyles.link}>Accueil</a></li>
              <li style={footerStyles.listItem}><a href="https://www.whitecapetech.com/accompagnement-editeurs-logiciels" style={footerStyles.link}>Savoir-faire</a></li>
              <li style={footerStyles.listItem}><a href="https://www.whitecapetech.com/test-logiciel" style={footerStyles.link}>Expertise</a></li>
              <li style={footerStyles.listItem}><a href="https://www.whitecapetech.com/valeur-management" style={footerStyles.link}>Valeurs</a></li>
            </ul>
            
          </div>

          <div style={footerStyles.column}>
           <h2 style={footerStyles.subtitle}></h2><br></br>
            <ul style={footerStyles.list}>
            <li style={footerStyles.listItem}><a href="https://www.whitecapetech.com/blogs" style={footerStyles.link}>Blog</a></li>
              <li style={footerStyles.listItem}><a href="https://www.whitecapetech.com/contact" style={footerStyles.link}>Contact</a></li>
              <li style={footerStyles.listItem}><a href="https://www.whitecapetech.com/carriere" style={footerStyles.link}>Carrières</a></li>
            </ul>
          </div>

          <div style={footerStyles.column}>
            <h2 style={footerStyles.subtitle}>Contactez Nous</h2>
            <address style={footerStyles.address}>
              <p>Avenue de la République Akouda 4022</p>
              <p>Sousse - Tunisie</p>
              <p style={{marginTop: "0.5rem"}}>Tel : +216 31 20 88 88</p>
              <p>+33 5 32 10 80 56</p>
            </address>
            <div style={footerStyles.socialIcons}>
              <a href="https://fr-fr.facebook.com/WhitecapeTech/"><FaFacebook size={18} /></a>
              <a href="https://x.com/whitecape_tech"><FaTwitter size={18} /></a>
              <a href="https://www.linkedin.com/company/whitecape-technologies"><FaLinkedin size={18} /></a>
            </div>
          </div>
        </div>

        <div style={footerStyles.copyright}>
          <p>Copyright © 2025 Whitecape Technologies</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;