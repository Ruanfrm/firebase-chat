import React from "react";
import { Typography, Link, Box } from "@mui/material/";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import logo from "../imagens/logo2-removebg.png";

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: "auto",
        padding: "20px",
        backgroundColor: "#f0f0f0",
        color: "#000",
        marginTop: "1rem",
      }}
    >
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        © {new Date().getFullYear()} Todos os direitos reservados
      </Typography>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
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
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Link
          className="footer-link"
          href="/terms"
          color="inherit"
          style={{ margin: "0 10px", textDecoration: "none" }}
        >
          Termos de Uso
        </Link>
        <Link
          className="footer-link"
          href="/politics"
          color="inherit"
          style={{ margin: "0 10px", textDecoration: "none" }}
        >
          Política de Privacidade
        </Link>
      </div>
      <div className="logo-back">
        {" "}
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "200px",
            height: "auto",
            marginBottom: "10px",
            marginTop: '10px'
          }}
        />
      </div>
    </footer>
  );
};

export default Footer;
