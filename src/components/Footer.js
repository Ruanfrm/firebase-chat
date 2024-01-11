// Footer.js
import React from "react";
import { Typography, Link, Box } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: "20px",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        padding: "10px",
        marginBottom: '3rem'
      }}
    >
      <h1 className="title-footer">Feito com ❤️ por Ruan Freire  </h1>
      <br/>
      <Box component="span" marginRight={1}>
        <Link
          href="https://wa.me/88981558151"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon />
        </Link>
      </Box>{" "}
      <Box component="span" marginRight={1}>
        <Link
          href="https://www.instagram.com/ruan.fr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon />
        </Link>
      </Box>{" "}
      <Box component="span">
        <Link
          href="https://github.com/Ruanfrm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </Link>
      </Box>
    </footer>
  );
};

export default Footer;
