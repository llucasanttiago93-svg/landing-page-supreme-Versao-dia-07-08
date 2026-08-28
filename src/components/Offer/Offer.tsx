import { useState } from "react";
import { motion, type Variants } from "motion/react";
import "./Offer.css";
import Checkout from "../Checkout/Checkout";


/* =====================================================
   ANIMAÇÕES
===================================================== */

const headerVariants: Variants = {

    hidden: {
        opacity: 0,
        y: 35,
    },

    visible: {
        opacity: 1,
        y: 0,

        transition: {
            duration: .8,
            ease: [.22, 1, .36, 1],
        },
    },

};


const cardsContainerVariants: Variants = {

    hidden: {},

    visible: {

        transition: {

            staggerChildren: .12,

            delayChildren: .1,

        },

    },

};


const cardVariants: Variants = {

    hidden: {

        opacity: 0,

        y: 40,

        scale: .97,

    },

    visible: {

        opacity: 1,

        y: 0,

        scale: 1,

        transition: {

            duration: .75,

            ease: [.22, 1, .36, 1],

        },

    },

};


const footerVariants: Variants = {

    hidden: {

        opacity: 0,

        y: 30,

    },

    visible: {

        opacity: 1,

        y: 0,

        transition: {

            duration: .7,

            ease: [.22, 1, .36, 1],

        },

    },

};


/* =====================================================
   COMPONENTE
===================================================== */

function Offer() {


    /* =================================================
       LÓGICA DO CHECKOUT
       NÃO ALTERADA
    ================================================= */

    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const [checkoutQuantity, setCheckoutQuantity] =
        useState<1 | 2>(1);


    const handleBuy = (quantity: 1 | 2) => {

        setCheckoutQuantity(quantity);

        setCheckoutOpen(true);

    };


    const handleCloseCheckout = () => {

        setCheckoutOpen(false);

    };


    return (

        <>

            <section
                className="offer"
                id="comprar"
            >

                <div className="container">


                    {/* =================================
                        HEADER
                    ================================= */}

                    <motion.div
                        className="offer-header"

                        variants={headerVariants}

                        initial="hidden"

                        whileInView="visible"

                        viewport={{
                            once: true,
                            amount: .25,
                        }}
                    >

                        <p className="offer-eyebrow">

                            ESCOLHA COMO QUER COMEÇAR

                        </p>


                        <h2>

                            Leve o seu Queridinho.<br />
                            Ou já garanta o próximo.

                        </h2>


                        <p className="offer-description">

                            Escolha a opção que combina com você e <br />leve o acabamento de salão para a sua rotina.

                        </p>

                    </motion.div>



                    {/* =================================
                        CARDS
                    ================================= */}

                    <motion.div
                        className="pricing-grid"

                        variants={cardsContainerVariants}

                        initial="hidden"

                        whileInView="visible"

                        viewport={{
                            once: true,
                            amount: .15,
                        }}
                    >


                        {/* =================================
                            1 UNIDADE
                        ================================= */}

                        <motion.article
                            className="pricing-card"

                            variants={cardVariants}

                            whileHover={{
                                y: -7,
                                boxShadow:
                                    "0 30px 70px rgba(0,0,0,.25)",
                            }}

                            transition={{
                                duration: .3,
                                ease: [.22, 1, .36, 1],
                            }}
                        >

                            <div className="card-label">

                                PARA CONHECER

                            </div>


                            <h3>

                                1 Queridinho

                            </h3>


                            <p className="card-description">
                                Para experimentar e descobrir o acabamento que virou favorito.

                            </p>


                            <motion.div
                                className="product-wrapper"

                                whileHover={{
                                    scale: 1.02,
                                }}

                                transition={{
                                    duration: .4,
                                    ease: [.22, 1, .36, 1],
                                }}
                            >

                                <img
                                    src={`${import.meta.env.BASE_URL}images/product-front.webp`}
                                    alt="Reparador de pontas Queridinho Supreme - 1 unidade"
                                    className="pricing-image"
                                />

                            </motion.div>


                            <div className="price">

                                <span>
                                    R$
                                </span>

                                <strong>
                                    57
                                </strong>

                                <small>
                                    ,00
                                </small>

                            </div>


                            <ul className="pricing-benefits">

                                <li>

                                    <span className="benefit-check">
                                        ✓
                                    </span>

                                    <span>
                                        Descubra seu novo finalizador favorito
                                    </span>

                                </li>


                                <li>

                                    <span className="benefit-check">
                                        ✓
                                    </span>

                                    <span>
                                        Ideal para começar
                                    </span>

                                </li>


                                <li>

                                    <span className="benefit-check">
                                        ✓
                                    </span>

                                    <span>
                                        30 ml para sua rotina
                                    </span>

                                </li>



                            </ul>


                            <motion.button
                                type="button"

                                className="pricing-button"

                                onClick={() =>
                                    handleBuy(1)
                                }

                                whileHover={{
                                    y: -2,
                                    scale: 1.01,
                                }}

                                whileTap={{
                                    scale: .97,
                                }}

                                transition={{
                                    duration: .2,
                                }}
                            >

                                QUERO 1 QUERIDINHO

                            </motion.button>


                            <p className="card-secure">

                                🔒 Compra segura

                            </p>

                        </motion.article>



                        {/* =================================
                            2 UNIDADES
                        ================================= */}

                        <motion.article
                            className="pricing-card featured"

                            variants={cardVariants}

                            whileHover={{
                                y: -9,
                                scale: 1.015,
                                boxShadow:
                                    "0 35px 90px rgba(236,116,4,.32)",
                            }}

                            transition={{
                                duration: .3,
                                ease: [.22, 1, .36, 1],
                            }}
                        >

                            <div className="badge">

                                🔥 MAIS VENDIDO

                            </div>


                            <div className="card-label featured-label">

                                PARA NÃO FICAR SEM

                            </div>


                            <h3>

                                2 Queridinhos

                            </h3>


                            <p className="card-description">

                                Mais praticidade para manter seu cabelo sempre finalizado.

                            </p>


                            <motion.div
                                className="product-wrapper featured-product"

                                whileHover={{
                                    scale: 1.02,
                                }}

                                transition={{
                                    duration: .4,
                                    ease: [.22, 1, .36, 1],
                                }}
                            >

                                <img
                                    src={`${import.meta.env.BASE_URL}images/product-front-2un.webp`}
                                    alt="Reparador de pontas Queridinho Supreme - 2 unidades"
                                    className="pricing-image featured-image"
                                />

                            </motion.div>


                            <div className="price-old">

                                De <s>R$114,00</s>

                            </div>




                            <div className="price">

                                <span>
                                    R$
                                </span>

                                <strong>
                                    97
                                </strong>

                                <small>
                                    ,00
                                </small>



                            </div>
                            R$48,50 cada<br />

                            <div className="saving">


                                Economize R$17

                            </div>


                            <ul className="pricing-benefits">

                                <li>

                                    <span className="benefit-check">
                                        ✓
                                    </span>

                                    <span>
                                        Melhor custo por Unidade
                                    </span>

                                </li>


                                <li>

                                    <span className="benefit-check">
                                        ✓
                                    </span>

                                    <span>
                                        Mais Praticidade
                                    </span>

                                </li>


                                <li>

                                    <span className="benefit-check">
                                        ✓
                                    </span>

                                    <span>
                                        Tenha uma reposição garantida
                                    </span>

                                </li>



                            </ul>


                            <motion.button
                                type="button"

                                className="pricing-button featured-button"

                                onClick={() =>
                                    handleBuy(2)
                                }

                                whileHover={{
                                    y: -2,
                                    scale: 1.01,
                                }}

                                whileTap={{
                                    scale: .97,
                                }}

                                transition={{
                                    duration: .2,
                                }}
                            >

                                QUERO 2 QUERIDINHOS

                            </motion.button>


                            <p className="card-secure">

                                🔒 Compra segura · Pix e Cartão

                            </p>

                        </motion.article>

                    </motion.div>



                    {/* =================================
                        SEGURANÇA
                    ================================= */}

                    <motion.div
                        className="offer-footer"

                        variants={footerVariants}

                        initial="hidden"

                        whileInView="visible"

                        viewport={{
                            once: true,
                            amount: .25,
                        }}
                    >

                        <div className="offer-trust-item">

                            <span className="trust-icon">
                                🔒
                            </span>

                            <span>
                                Compra segura
                            </span>

                        </div>


                        <div className="offer-trust-item">

                            <span className="trust-icon">
                                🚚
                            </span>

                            <span>
                                Envio para todo o Brasil
                            </span>

                        </div>


                        <div className="offer-trust-item">

                            <span className="trust-icon">
                                💳
                            </span>

                            <span>
                                Pix e Cartão
                            </span>

                        </div>

                    </motion.div>



                    <motion.p
                        className="offer-bottom-text"

                        variants={footerVariants}

                        initial="hidden"

                        whileInView="visible"

                        viewport={{
                            once: true,
                            amount: .25,
                        }}
                    >

                        Seu próximo cabelo favorito está a um clique.

                    </motion.p>


                </div>

            </section>



            {/* =========================================
                CHECKOUT

                LÓGICA ORIGINAL PRESERVADA
            ========================================= */}

            <Checkout
                isOpen={checkoutOpen}
                quantity={checkoutQuantity}
                onClose={handleCloseCheckout}
            />

        </>

    );

}


export default Offer;