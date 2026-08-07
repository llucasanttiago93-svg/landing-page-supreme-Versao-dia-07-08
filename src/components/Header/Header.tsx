import { useState } from "react";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">

      <div className="container header-container">

        {/* ESQUERDA */}
        <div className="header-left">

          <a href="#inicio" className="logo">
            <img
              src="/images/logo.png"
              alt="Vanti Cosméticos"
            />
          </a>

        </div>

        {/* CENTRO */}
        <nav className={`navigation ${menuOpen ? "active" : ""}`}>

          <a href="#beneficios" onClick={() => setMenuOpen(false)}>
            Benefícios
          </a>

          <a href="#fragrancia" onClick={() => setMenuOpen(false)}>
            Fragrância
          </a>

          <a href="#como-funciona" onClick={() => setMenuOpen(false)}>
            Como usar
          </a>

          <a href="#faq" onClick={() => setMenuOpen(false)}>
            FAQ
          </a>

          <a
            href="#comprar"
            className="header-button mobile-button"
            onClick={() => setMenuOpen(false)}
          >
            Comprar Agora
          </a>

        </nav>

        {/* DIREITA */}
        <div className="header-right">

          <a
            href="#comprar"
            className="header-button desktop-button"
          >
            Comprar Agora
          </a>

        </div>

        {/* MENU MOBILE */}
        <button
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >

          <span></span>
          <span></span>
          <span></span>

        </button>

      </div>

    </header>
  );
}

export default Header;