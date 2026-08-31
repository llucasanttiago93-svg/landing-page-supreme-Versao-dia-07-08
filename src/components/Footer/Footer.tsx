import "./Footer.css";


function Footer() {

    return (

        <footer
            className="footer"
            id="footer"
        >

            <div className="container">


                {/* =================================================
                    LOGO
                ================================================= */}

                <div className="footer-logo">

                    <a
                        href="#inicio"
                        className="logo"
                        aria-label="Voltar ao início - Vanti Cosméticos"
                    >

                        <img
                            src={`${import.meta.env.BASE_URL}images/logo-branco.webp`}
                            alt="Vanti Cosméticos"
                            loading="lazy"
                            decoding="async"
                        />

                    </a>

                </div>


                {/* =================================================
                    DESCRIÇÃO
                ================================================= */}

                <p className="footer-description">
                    Cuidado, beleza e aquele toque final que faz diferença.
                </p>


                {/* =================================================
                    REDES SOCIAIS
                ================================================= */}

                <nav
                    className="social-links"
                    aria-label="Redes sociais e canais de atendimento"
                >


                    {/* =============================================
                        INSTAGRAM
                    ============================================= */}

                    <a
                        href="https://www.instagram.com/vanticosmeticos/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram da Vanti Cosméticos"
                        title="Instagram da Vanti Cosméticos"
                    >

                        <img
                            src={`${import.meta.env.BASE_URL}images/3.webp`}
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />

                    </a>


                    {/* =============================================
                        WHATSAPP
                    ============================================= */}

                    <a
                        href="https://wa.me/5511932490047?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Queridinho%20Supreme."
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Falar com a Vanti Cosméticos pelo WhatsApp"
                        title="WhatsApp da Vanti Cosméticos"
                    >

                        <img
                            src={`${import.meta.env.BASE_URL}images/2.webp`}
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />

                    </a>


                    {/* =============================================
                        MERCADO LIVRE
                    ============================================= */}

                    <a
                        href="https://lista.mercadolivre.com.br/_CustId_486479406?item_id=MLB5944688628&category_id=MLB32130&seller_id=486479406&client=recoview-selleritems&recos_listing=true#origin=upp&component=sellerData&typeSeller=classic"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Vanti Cosméticos no Mercado Livre"
                        title="Vanti Cosméticos no Mercado Livre"
                    >

                        <img
                            src={`${import.meta.env.BASE_URL}images/1.webp`}
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />

                    </a>

                </nav>


                {/* =================================================
                    LINKS INSTITUCIONAIS
                ================================================= */}

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


                {/* =================================================
                    DIVISOR
                ================================================= */}

                <div
                    className="footer-divider"
                    aria-hidden="true"
                ></div>


                {/* =================================================
                    COPYRIGHT
                ================================================= */}

                <p className="footer-copy">
                    © 2026 Vanti Cosméticos. Todos os direitos reservados.
                </p>


            </div>

        </footer>

    );

}


export default Footer;