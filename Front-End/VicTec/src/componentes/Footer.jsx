import React from "react";
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
            href="https://instagram.com/tu-usuario"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagramLogo} alt="Instagram" />
          </a>
          <a
            href="https://tiktok.com/@tu-usuario"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={tiktokLogo} alt="TikTok" />
          </a>
          <a
            href="https://youtube.com/c/tu-canal"
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
          <a href="/politica-privacidad">Política de Privacidad</a>
          <a href="/terminos-servicio">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
