import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import instagramLogo from "../assets/instagram.svg";
import tiktokLogo from "../assets/tiktok.svg";
import youtubeLogo from "../assets/youtube.svg";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        {/* --- Enlaces a Redes Sociales --- */}
        <div className="footer-social">
          {/* 2. Reemplazamos el texto con etiquetas <img> */}
          <a
            href="https://www.instagram.com/victecv/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagramLogo} alt="Instagram" />
          </a>
          <a
            href="https://www.tiktok.com/@vixdevcl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={tiktokLogo} alt="TikTok" />
          </a>
          <a
            href="https://www.youtube.com/@VixDevcl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={youtubeLogo} alt="YouTube" />
          </a>
        </div>

        {/* --- Texto de Copyright --- */}
        <div className="footer-copyright">
          © {new Date().getFullYear()} VicTec. Todos los derechos reservados.
        </div>

        {/* --- Enlaces de Política (opcional) --- */}
        <div className="footer-links">
          <Link to="/politica-privacidad">Política de Privacidad</Link>
          <Link to="/terminos-servicio">Términos de Servicio</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
