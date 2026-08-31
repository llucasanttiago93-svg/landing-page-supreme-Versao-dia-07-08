import { motion, type Variants } from "motion/react";
import "./Hero.css";

const ease = [0.22, 1, 0.36, 1] as const;


/* =====================================================
   ANIMAÇÃO DO CONTAINER
===================================================== */

const containerVariants: Variants = {

    hidden: {},

    visible: {

        transition: {

            staggerChildren: 0.09,

            delayChildren: 0.15,

        },

    },

};


/* =====================================================
   ANIMAÇÃO DOS ELEMENTOS
===================================================== */

const itemVariants: Variants = {

    hidden: {

        opacity: 0,

        y: 24,

    },

    visible: {

        opacity: 1,

        y: 0,

        transition: {

            duration: 0.75,

            ease,

        },

    },

};


/* =====================================================
   HERO
===================================================== */

function Hero() {

    return (

        <section
            className="hero"
            id="inicio"
        >

            <div className="hero-container">


                {/* =================================================
                    LADO ESQUERDO
                ================================================= */}

                <motion.div
                    className="hero-left"

                    variants={containerVariants}

                    initial="hidden"

                    animate="visible"
                >


                    {/* =============================================
                        EYEBROW
                    ============================================= */}

                    <motion.p
                        className="hero-eyebrow"

                        variants={itemVariants}
                    >

                        ✦ O QUERIDINHO DAS CABELEIREIRAS

                    </motion.p>


                    {/* =============================================
                        AVALIAÇÃO
                    ============================================= */}

                    <motion.div
                        className="hero-rating"

                        variants={itemVariants}
                    >

                        <span className="stars">
                            ★★★★★
                        </span>

                        <span>
                            4,9 • Avaliações Reais
                        </span>

                    </motion.div>


                    {/* =============================================
                        HEADLINE
                    ============================================= */}

                    <motion.h1 variants={itemVariants}>

                        <span className="hero-title-line">
                            Aquele cabelo de salão.
                        </span>

                        <span className="hero-title-line">
                            O cheiro que fica
                        </span>

                        <span className="hero-title-line hero-title-script">
                            na memória.
                        </span>

                    </motion.h1>


                    {/* =============================================
                        DESCRIÇÃO
                    ============================================= */}

                    <motion.p
                        className="hero-description"
                        variants={itemVariants}
                    >

                        Aquele toque final que muda tudo.

                        <br />

                        <strong>
                            Brilho, maciez e uma fragrância sofisticada.
                        </strong>

                        <br />

                        Para deixar os fios com aquela sensação
                        de cabelo recém-finalizado.

                    </motion.p>


                    {/* =============================================
                        CTA
                    ============================================= */}

                    <motion.a
                        href="#comprar"

                        className="hero-button"

                        variants={itemVariants}

                        whileHover={{
                            y: -4,
                            scale: 1.02,
                        }}

                        whileTap={{
                            scale: 0.97,
                        }}
                    >

                        QUERO EXPERIMENTAR O QUERIDINHO

                    </motion.a>


                    {/* =============================================
                        CONFIANÇA
                    ============================================= */}

                    <motion.div
                        className="hero-trust"

                        variants={itemVariants}
                    >

                        <span>
                            🔒 Compra segura
                        </span>

                        <span>
                            🚚 Envio para todo o Brasil
                        </span>

                        <span>
                            💳 Pix e Cartão
                        </span>

                    </motion.div>

                </motion.div>


                {/* =================================================
                    LADO DIREITO — IMAGEM PRINCIPAL
                ================================================= */}

                <motion.div
                    className="hero-right"

                    initial={{
                        opacity: 0,
                        scale: 1.02,
                    }}

                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}

                    transition={{
                        duration: 1.1,
                        ease,
                    }}
                >

                    <img
                        src={`${import.meta.env.BASE_URL}images/hero-supreme.webp`}

                        alt="Modelo segurando o Queridinho Supreme com cabelos brilhantes e finalizados"

                        fetchPriority="high"

                        decoding="async"
                    />

                </motion.div>

            </div>

        </section>

    );

}


export default Hero;