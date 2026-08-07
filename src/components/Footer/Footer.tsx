import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-logo">

          <img
            src="/images/logo.png"
            alt="Vanti Cosméticos"
          />

        </div>

        <h3>
          Vanti Cosméticos
        </h3>

        <p className="footer-description">
          Brilho intenso, toque sedoso e uma fragrância marcante
          para transformar o acabamento dos seus cabelos.
        </p>

        <div className="footer-social">

          <a href="#">
            Instagram
          </a>

          <a href="#">
            WhatsApp
          </a>

          <a href="#">
            Mercado Livre
          </a>

        </div>

        <div className="footer-links">

          <a href="#">
            Política de Privacidade
          </a>

          <a href="#">
            Termos de Uso
          </a>

        </div>

        <div className="footer-divider"></div>

        <p className="footer-copy">
          © 2026 Vanti Cosméticos. Todos os direitos reservados.
        </p>

      </div>

    </footer>
  );
}

export default Footer;