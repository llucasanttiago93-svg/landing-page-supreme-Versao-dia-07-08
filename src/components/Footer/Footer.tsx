import "./Footer.css";


function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-logo">

          <a href="#inicio" className="logo">
            <img
              src="/images/logo-branco.png"
              alt="Vanti Cosméticos"
            />
          </a>

        </div>

        <p className="footer-description">
          Brilho intenso, toque sedoso e uma fragrância marcante
          para transformar o acabamento dos seus cabelos.
        </p>

        <div className="social-links">

          <a
            href="https://www.instagram.com/vanticosmeticos/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <img
              src="/images/3.png"
              alt="Instagram"
            />
          </a>

          <a
            href="https://wa.me/5511932490047?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Queridinho%20Supreme."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <img
              src="/images/2.png"
              alt="WhatsApp"

            />
          </a>

          <a
            href="https://lista.mercadolivre.com.br/_CustId_486479406?item_id=MLB5944688628&category_id=MLB32130&seller_id=486479406&client=recoview-selleritems&recos_listing=true#origin=upp&component=sellerData&typeSeller=classic"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mercado Livre"
            title="Mercado Livre"
          >
            <img
              src="/images/1.png"
              alt="Mercado Livre"
            />
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