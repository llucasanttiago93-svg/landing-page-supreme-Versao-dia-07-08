import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-logo">

          <a
            href="#inicio"
            className="logo"
            aria-label="Voltar ao início - Vanti Cosméticos"
          >
            <img
              src="/images/logo-branco.webp"
              alt="Vanti Cosméticos"
            />
          </a>

        </div>

        <p className="footer-description">
          Brilho intenso, toque sedoso e uma fragrância marcante
          para transformar o acabamento dos seus cabelos.
        </p>


        {/* ========================= */}
        {/* REDES SOCIAIS */}
        {/* ========================= */}

        <div className="social-links">

          <a
            href="https://www.instagram.com/vanticosmeticos/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da Vanti Cosméticos"
            title="Instagram"
          >
            <img
              src="/images/3.webp"
              alt="Instagram"
            />
          </a>


          <a
            href="https://wa.me/5511932490047?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Queridinho%20Supreme."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com a Vanti Cosméticos pelo WhatsApp"
            title="WhatsApp"
          >
            <img
              src="/images/2.webp"
              alt="WhatsApp"
            />
          </a>


          <a
            href="https://lista.mercadolivre.com.br/_CustId_486479406?item_id=MLB5944688628&category_id=MLB32130&seller_id=486479406&client=recoview-selleritems&recos_listing=true#origin=upp&component=sellerData&typeSeller=classic"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vanti Cosméticos no Mercado Livre"
            title="Mercado Livre"
          >
            <img
              src="/images/1.webp"
              alt="Mercado Livre"
            />
          </a>

        </div>


        {/* ========================= */}
        {/* LINKS */}
        {/* ========================= */}

        <nav
          className="footer-links"
          aria-label="Links institucionais"
        >

          <a href="#">
            Política de Privacidade
          </a>

          <a href="#">
            Termos de Uso
          </a>

        </nav>


        <div className="footer-divider"></div>


        <p className="footer-copy">
          © 2026 Vanti Cosméticos. Todos os direitos reservados.
        </p>

      </div>

    </footer>
  );
}

export default Footer;