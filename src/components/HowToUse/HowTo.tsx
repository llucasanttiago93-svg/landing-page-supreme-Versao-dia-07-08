import { motion, type Variants } from "motion/react";
import "./HowTo.css";


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
   ANIMAÇÃO DOS PASSOS
===================================================== */

const stepsContainerVariants: Variants = {

    hidden: {},

    visible: {

        transition: {

            staggerChildren: 0.12,

            delayChildren: 0.15,

        },

    },

};


const stepVariants: Variants = {

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
   ANIMAÇÃO DA DICA
===================================================== */

const tipVariants: Variants = {

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
   HOW TO USE
===================================================== */

function HowTo() {

    return (

        <section
            className="howto"
            id="como-usar"
        >

            <div className="container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <motion.div
                    className="howto-header"

                    variants={headerVariants}

                    initial="hidden"

                    whileInView="visible"

                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                >

                    <p className="howto-eyebrow">
                        COMO USAR
                    </p>


                    <h2>
                        Seu cabelo bonito em 3 passos.
                    </h2>


                    <p className="howto-description">

                        Um toque no comprimento.
                        Espalhe nas pontas.
                        Finalize como de costume.

                    </p>

                </motion.div>


                {/* =================================================
                    PASSOS
                ================================================= */}

                <motion.div
                    className="howto-steps"

                    variants={
                        stepsContainerVariants
                    }

                    initial="hidden"

                    whileInView="visible"

                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                >


                    {/* =================================================
                        PASSO 01
                    ================================================= */}

                    <motion.article
                        className="step"

                        variants={stepVariants}
                    >

                        <div className="step-number">
                            01
                        </div>


                        <motion.div
                            className="step-image"

                            whileHover={{
                                y: -6,
                                scale: 1.015,
                            }}

                            transition={{
                                duration: 0.35,

                                ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1,
                                ],
                            }}
                        >

                            <img
                                src={`${import.meta.env.BASE_URL}images/aplicando-na-mao.webp`}

                                alt="Aplicando o Queridinho Supreme na palma das mãos"

                                loading="lazy"

                                decoding="async"
                            />

                        </motion.div>


                        <div className="step-content">

                            <h3>
                                Aplique
                            </h3>

                            <p>
                                1 ou 2 pumps na palma das mãos.
                            </p>

                        </div>

                    </motion.article>


                    {/* =================================================
                        DIVISOR
                    ================================================= */}

                    <div
                        className="step-line"
                        aria-hidden="true"
                    ></div>


                    {/* =================================================
                        PASSO 02
                    ================================================= */}

                    <motion.article
                        className="step"

                        variants={stepVariants}
                    >

                        <div className="step-number">
                            02
                        </div>


                        <motion.div
                            className="step-image"

                            whileHover={{
                                y: -6,
                                scale: 1.015,
                            }}

                            transition={{
                                duration: 0.35,

                                ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1,
                                ],
                            }}
                        >

                            <img
                                src={`${import.meta.env.BASE_URL}images/espalhando-no-cabelo.webp`}

                                alt="Aplicando o Queridinho Supreme no comprimento e nas pontas dos cabelos"

                                loading="lazy"

                                decoding="async"
                            />

                        </motion.div>


                        <div className="step-content">

                            <h3>
                                Espalhe
                            </h3>

                            <p>
                                Passe no comprimento e nas pontas. Evite a raiz.
                            </p>

                        </div>

                    </motion.article>


                    {/* =================================================
                        DIVISOR
                    ================================================= */}

                    <div
                        className="step-line"
                        aria-hidden="true"
                    ></div>


                    {/* =================================================
                        PASSO 03
                    ================================================= */}

                    <motion.article
                        className="step"

                        variants={stepVariants}
                    >

                        <div className="step-number">
                            03
                        </div>


                        <motion.div
                            className="step-image"

                            whileHover={{
                                y: -6,
                                scale: 1.015,
                            }}

                            transition={{
                                duration: 0.35,

                                ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1,
                                ],
                            }}
                        >

                            <img
                                src={`${import.meta.env.BASE_URL}images/finalizando.webp`}

                                alt="Cabelos finalizados com o Queridinho Supreme"

                                loading="lazy"

                                decoding="async"
                            />

                        </motion.div>


                        <div className="step-content">

                            <h3>
                                Finalize
                            </h3>

                            <p>
                                Pronto. Cabelos Alinhados, Macios e Perfumados.
                            </p>

                        </div>

                    </motion.article>

                </motion.div>


                {/* =================================================
                    DICA
                ================================================= */}

                <motion.div
                    className="howto-tip"

                    variants={tipVariants}

                    initial="hidden"

                    whileInView="visible"

                    viewport={{
                        once: true,
                        amount: 0.25,
                    }}
                >

                    <span
                        aria-hidden="true"
                    >
                        ✨
                    </span>


                    <p>
                        Pode usar no cabelo seco ou úmido. Não precisa enxaguar.
                    </p>

                </motion.div>

            </div>

        </section>

    );

}


export default HowTo;