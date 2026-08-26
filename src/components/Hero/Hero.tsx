import "./Hero.css";

function Hero() {
    return (
        <section className="hero" id="inicio">

            <div className="hero-container">


                <div className="hero-left">


                    <p className="hero-eyebrow delay-1">
                        • QUERIDINHO SUPREME
                    </p>


                    <div className="hero-rating delay-2">

                        <span className="stars">
                            ★★★★★
                        </span>

                        <span>
                            4,9 • Avaliações Reais
                        </span>

                    </div>



                    <h1 className=" delay-3">

                        Seu cabelo <br />

                        Cheiroso, Bonito, <br />

                        <span>
                            Inesquecível.
                        </span>

                    </h1>



                    <p className="hero-description delay-4">

                        Tudo isso com o <strong>Queridinho Supreme.</strong>{" "}
                        Um reparador de pontas que proporciona brilho intenso,
                        toque sedoso e uma fragrância maravilhosa para transformar
                        o acabamento do seu cabelo todos os dias.

                    </p>




                    <ul className="hero-benefits">


                        <li className="hero-benefit-item delay-5">

                            <span className="check">
                                ✔
                            </span>

                            <span>
                                Brilho imediato
                            </span>

                        </li>



                        <li className="hero-benefit-item delay-6">

                            <span className="check">
                                ✔
                            </span>

                            <span>
                                Frizz controlado
                            </span>

                        </li>




                        <li className="hero-benefit-item delay-7">

                            <span className="check">
                                ✔
                            </span>

                            <span>
                                Perfume maravilhoso
                            </span>

                        </li>



                        <li className="hero-benefit-item delay-8">

                            <span className="check">
                                ✔
                            </span>

                            <span>
                                Toque sedoso
                            </span>

                        </li>



                    </ul>




                    <a
                        href="#comprar"
                        className="hero-button delay-9"
                    >

                        Comprar Agora

                    </a>




                    <div className="hero-trust delay-10">


                        <span>
                            🔒 Compra Segura
                        </span>


                        <span>
                            🚚 Envio para todo o Brasil
                        </span>


                        <span>
                            💳 Pix e Cartão
                        </span>


                    </div>



                </div>





                <div className="hero-right">


                    <div className="hero-image-wrapper">


                        <img
                            src={`${import.meta.env.BASE_URL}images/hero-application.webp`}
                            alt="Queridinho Supreme reparador de pontas"
                        />


                    </div>


                </div>



            </div>


        </section>
    );
}


export default Hero;