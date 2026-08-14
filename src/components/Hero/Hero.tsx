import "./Hero.css";

function Hero() {
    return (
        <section className="hero" id="inicio">

            <div className="hero-container">

                <div className="hero-left">

                    <p className="hero-eyebrow">
                        • QUERIDINHO SUPREME
                    </p>

                    <div className="hero-rating">

                        <span className="stars">
                            ★★★★★
                        </span>

                        <span>
                            4,9 • Avaliações Reais
                        </span>

                    </div>

                    <h1>
                        Seu cabelo <br />
                        Cheiroso, Bonito, <br />
                        <span>Inesquecível.</span>
                    </h1>

                    <p className="hero-description">

                        Tudo isso com o <strong>Queridinho Supreme.</strong>
                        {" "}Um reparador de pontas que proporciona brilho intenso,
                        toque sedoso e uma fragrância maravilhosa para transformar
                        o acabamento do seu cabelo todos os dias.

                    </p>

                    <ul className="hero-benefits">

                        <li>
                            <span className="check">✔</span>
                            <span>Brilho imediato</span>
                        </li>

                        <li>
                            <span className="check">✔</span>
                            <span>Frizz controlado</span>
                        </li>

                        <li>
                            <span className="check">✔</span>
                            <span>Perfume maravilhoso</span>
                        </li>

                        <li>
                            <span className="check">✔</span>
                            <span>Toque sedoso</span>
                        </li>

                    </ul>

                    <a
                        href="#comprar"
                        className="hero-button"
                    >
                        Comprar Agora
                    </a>

                    <div className="hero-trust">

                        <span>🔒 Compra Segura</span>

                        <span>🚚 Envio para todo o Brasil</span>

                        <span>💳 Pix e Cartão</span>

                    </div>

                </div>

                <div className="hero-right">

                    <img
                        src="/images/hero-application.webp"
                        alt="Queridinho Supreme, reparador de pontas da Vanti Cosméticos"
                    />

                </div>

            </div>

        </section>
    );
}

export default Hero;