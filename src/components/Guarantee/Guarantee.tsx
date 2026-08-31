import { motion, type Variants } from "motion/react";
import "./Guarantee.css";


/* =====================================================
   ANIMAÇÃO DO HEADER
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

            duration: 0.8,

            ease: [
                0.22,
                1,
                0.36,
                1,
            ],

        },

    },

};


/* =====================================================
   ANIMAÇÃO DOS CARDS
===================================================== */

const cardsContainerVariants: Variants = {

    hidden: {},

    visible: {

        transition: {

            staggerChildren: 0.1,

            delayChildren: 0.15,

        },

    },

};


const cardVariants: Variants = {

    hidden: {

        opacity: 0,

        y: 35,

        scale: 0.97,

    },

    visible: {

        opacity: 1,

        y: 0,

        scale: 1,

        transition: {

            duration: 0.7,

            ease: [
                0.22,
                1,
                0.36,
                1,
            ],

        },

    },

};


/* =====================================================
   ANIMAÇÃO DO CTA
===================================================== */

const ctaVariants: Variants = {

    hidden: {

        opacity: 0,

        y: 30,

    },

    visible: {

        opacity: 1,

        y: 0,

        transition: {

            duration: 0.7,

            delay: 0.1,

            ease: [
                0.22,
                1,
                0.36,
                1,
            ],

        },

    },

};


/* =====================================================
   GUARANTEE
===================================================== */

function Guarantee() {

    return (

        <section
            className="guarantee"
            id="garantia"
        >

            <div className="container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <motion.div
                    className="guarantee-header"

                    variants={headerVariants}

                    initial="hidden"

                    whileInView="visible"

                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                >

                    <p className="guarantee-eyebrow">
                        COMPRE SEM PREOCUPAÇÃO
                    </p>


                    <h2>
                        Você já decidiu pelo seu cabelo.
                        Agora, compre com tranquilidade.
                    </h2>


                    <p className="guarantee-description">
                        Do pagamento à entrega, tudo foi pensado para tornar sua compra simples, segura e transparente.
                    </p>

                </motion.div>


                {/* =================================================
                    CARDS
                ================================================= */}

                <motion.div
                    className="guarantee-grid"

                    variants={
                        cardsContainerVariants
                    }

                    initial="hidden"

                    whileInView="visible"

                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                >


                    {/* =================================================
                        COMPRA SEGURA
                    ================================================= */}

                    <motion.article
                        className="guarantee-card"

                        variants={cardVariants}

                        whileHover={{
                            y: -8,

                            boxShadow:
                                "0 22px 60px rgba(0,0,0,.08)",

                            borderColor:
                                "#EC7404",
                        }}

                        transition={{
                            duration: 0.3,

                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >

                        <div
                            className="guarantee-icon"
                            aria-hidden="true"
                        >
                            🔒
                        </div>


                        <h3>
                            Compra segura
                        </h3>


                        <p>
                            Pagamento realizado de forma segura por meio do checkout
                            da InfinitePay.
                        </p>

                    </motion.article>


                    {/* =================================================
                        ENVIO
                    ================================================= */}

                    <motion.article
                        className="guarantee-card"

                        variants={cardVariants}

                        whileHover={{
                            y: -8,

                            boxShadow:
                                "0 22px 60px rgba(0,0,0,.08)",

                            borderColor:
                                "#EC7404",
                        }}

                        transition={{
                            duration: 0.3,

                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >

                        <div
                            className="guarantee-icon"
                            aria-hidden="true"
                        >
                            🚚
                        </div>


                        <h3>
                            Envio para todo o Brasil
                        </h3>


                        <p>
                            Enviamos seu pedido para todo o Brasil com acompanhamento
                            da entrega.
                        </p>

                    </motion.article>


                    {/* =================================================
                        PAGAMENTO
                    ================================================= */}

                    <motion.article
                        className="guarantee-card"

                        variants={cardVariants}

                        whileHover={{
                            y: -8,

                            boxShadow:
                                "0 22px 60px rgba(0,0,0,.08)",

                            borderColor:
                                "#EC7404",
                        }}

                        transition={{
                            duration: 0.3,

                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >

                        <div
                            className="guarantee-icon"
                            aria-hidden="true"
                        >
                            💳
                        </div>


                        <h3>
                            Pix e cartão
                        </h3>


                        <p>
                            Escolha a forma de pagamento disponível no checkout.
                        </p>

                    </motion.article>


                    {/* =================================================
                        PRODUTO ORIGINAL
                    ================================================= */}

                    <motion.article
                        className="guarantee-card"

                        variants={cardVariants}

                        whileHover={{
                            y: -8,

                            boxShadow:
                                "0 22px 60px rgba(0,0,0,.08)",

                            borderColor:
                                "#EC7404",
                        }}

                        transition={{
                            duration: 0.3,

                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >

                        <div
                            className="guarantee-icon"
                            aria-hidden="true"
                        >
                            ⭐
                        </div>


                        <h3>
                            Produto original
                        </h3>


                        <p>
                            Queridinho Supreme original da Vanti Cosméticos.
                        </p>

                    </motion.article>


                </motion.div>


                {/* =================================================
                    CTA
                ================================================= */}

                <motion.div
                    className="guarantee-cta"

                    variants={ctaVariants}

                    initial="hidden"

                    whileInView="visible"

                    viewport={{
                        once: true,
                        amount: 0.25,
                    }}
                >

                    <motion.a
                        href="#comprar"

                        className="guarantee-button"

                        whileHover={{
                            y: -3,

                            scale: 1.02,

                            boxShadow:
                                "0 16px 40px rgba(236,116,4,.35)",
                        }}

                        whileTap={{
                            scale: 0.97,
                        }}

                        transition={{
                            duration: 0.25,
                        }}
                    >
                        COMPRAR COM TRANQUILIDADE
                    </motion.a>

                </motion.div>

            </div>

        </section>

    );

}


export default Guarantee;