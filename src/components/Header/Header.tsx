import { useState } from "react";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">

      <div className="container header-container">

        {/* ========================= */}
        {/* LOGO */}
        {/* ========================= */}

        <div className="header-left">

          <a
            href="#inicio"
            className="logo"
            aria-label="Vanti Cosméticos - início"
            onClick={closeMenu}
          >
            <img
              src="/images/logo.webp"
              alt="Vanti Cosméticos"
            />
          </a>

        </div>


        {/* ========================= */}
        {/* MENU */}
        {/* ========================= */}

        <nav
          id="navigation"
          className={`navigation ${menuOpen ? "active" : ""}`}
          aria-label="Navegação principal"
        >

          <a
            href="#beneficios"
            onClick={closeMenu}
          >
            Benefícios
          </a>

          <a
            href="#fragrancia"
            onClick={closeMenu}
          >
            Fragrância
          </a>

          <a
            href="#como-usar"
            onClick={closeMenu}
          >
            Como usar
          </a>

          <a
            href="#faq"
            onClick={closeMenu}
          >
            FAQ
          </a>


          {/* BOTÃO MOBILE */}

          <a
            href="#comprar"
            className="header-button mobile-button"
            onClick={closeMenu}
          >
            Comprar Agora
          </a>

        </nav>


        {/* ========================= */}
        {/* BOTÃO DESKTOP */}
        {/* ========================= */}

        <div className="header-right">

          <a
            href="#comprar"
            className="header-button desktop-button"
          >
            Comprar Agora
          </a>

        </div>


        {/* ========================= */}
        {/* MENU MOBILE */}
        {/* ========================= */}

        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="navigation"
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