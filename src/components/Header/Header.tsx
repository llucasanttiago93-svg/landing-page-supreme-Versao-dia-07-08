import { useEffect, useState } from "react";
import "./Header.css";

function Header() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };

  }, []);



  const closeMenu = () => {
    setMenuOpen(false);
  };


  return (

    <header
      className={`header ${scrolled ? "scrolled" : ""}`}
    >

      <div className="container header-container">


        <div className="header-left">

          <a
            href="#inicio"
            className="logo"
            aria-label="Vanti Cosméticos - início"
            onClick={closeMenu}
          >

            <img
              src={`${import.meta.env.BASE_URL}images/logo.webp`}
              alt="Vanti Cosméticos"
            />

          </a>

        </div>



        <nav
          id="navigation"
          className={`navigation ${menuOpen ? "active" : ""}`}
        >

          <a href="#beneficios" onClick={closeMenu}>
            Benefícios
          </a>

          <a href="#fragrancia" onClick={closeMenu}>
            Fragrância
          </a>

          <a href="#como-usar" onClick={closeMenu}>
            Como usar
          </a>

          <a href="#faq" onClick={closeMenu}>
            FAQ
          </a>


          <a
            href="#comprar"
            className="header-button mobile-button"
            onClick={closeMenu}
          >
            Comprar Agora
          </a>


        </nav>



        <div className="header-right">

          <a
            href="#comprar"
            className="header-button desktop-button"
          >
            Comprar Agora
          </a>

        </div>



        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
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