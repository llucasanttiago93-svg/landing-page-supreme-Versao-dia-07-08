import { motion, type Variants } from "motion/react";
import "./Hero.css";

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.09,
            delayChildren: 0.15,
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 32,
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

const benefitsVariants: Variants = {
    hidden: {},

    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.15,
        },
    },
};

const benefitVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 28,
        scale: 0.97,
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.65,
            ease,
        },
    },
};

function Hero() {
    return (
        <section className="hero" id="inicio">

            <div className="hero-container">

                {/* =========================
                    CONTEÚDO
                ========================= */}

                <motion.div
                    className="hero-left"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >

                    <motion.p
                        className="hero-eyebrow"
                        variants={itemVariants}
                    >
                        • QUERIDINHO SUPREME
                    </motion.p>


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


                    <motion.h1 variants={itemVariants}>
                        Seu cabelo <br />
                        Cheiroso, Bonito, <br />

                        <span>
                            Inesquecível.
                        </span>
                    </motion.h1>


                    <motion.p
                        className="hero-description"
                        variants={itemVariants}
                    >
                        Tudo isso com o{" "}
                        <strong>Queridinho Supreme.</strong>{" "}
                        Um reparador de pontas que proporciona brilho intenso,
                        toque sedoso e uma fragrância maravilhosa para transformar
                        o acabamento do seu cabelo todos os dias.
                    </motion.p>


                    {/* =========================
                        BENEFÍCIOS
                    ========================= */}

                    <motion.ul
                        className="hero-benefits"
                        variants={benefitsVariants}
                        initial="hidden"
                        animate="visible"
                    >

                        <motion.li
                            className="hero-benefit-item"
                            variants={benefitVariants}
                            whileHover={{
                                y: -5,
                                boxShadow:
                                    "0 15px 35px rgba(0,0,0,.10)",
                            }}
                        >
                            <span className="check">
                                ✔
                            </span>

                            <span>
                                Brilho imediato
                            </span>
                        </motion.li>


                        <motion.li
                            className="hero-benefit-item"
                            variants={benefitVariants}
                            whileHover={{
                                y: -5,
                                boxShadow:
                                    "0 15px 35px rgba(0,0,0,.10)",
                            }}
                        >
                            <span className="check">
                                ✔
                            </span>

                            <span>
                                Frizz controlado
                            </span>
                        </motion.li>


                        <motion.li
                            className="hero-benefit-item"
                            variants={benefitVariants}
                            whileHover={{
                                y: -5,
                                boxShadow:
                                    "0 15px 35px rgba(0,0,0,.10)",
                            }}
                        >
                            <span className="check">
                                ✔
                            </span>

                            <span>
                                Perfume maravilhoso
                            </span>
                        </motion.li>


                        <motion.li
                            className="hero-benefit-item"
                            variants={benefitVariants}
                            whileHover={{
                                y: -5,
                                boxShadow:
                                    "0 15px 35px rgba(0,0,0,.10)",
                            }}
                        >
                            <span className="check">
                                ✔
                            </span>

                            <span>
                                Toque sedoso
                            </span>
                        </motion.li>

                    </motion.ul>


                    {/* =========================
                        BOTÃO
                    ========================= */}

                    <motion.a
                        href="#comprar"
                        className="hero-button"
                        variants={itemVariants}
                        whileHover={{
                            y: -4,
                            scale: 1.02,
                            boxShadow:
                                "0 16px 35px rgba(236,116,4,.30)",
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                    >
                        Comprar Agora
                    </motion.a>


                    {/* =========================
                        CONFIANÇA
                    ========================= */}

                    <motion.div
                        className="hero-trust"
                        variants={itemVariants}
                    >
                        <span>
                            🔒 Compra Segura
                        </span>

                        <span>
                            🚚 Envio para todo o Brasil
                        </span>

                        <span>
                            💳 Pix e Cartão
                        </span>
                    </motion.div>

                </motion.div>


                {/* =========================
                    IMAGEM
                ========================= */}

                <motion.div
                    className="hero-right"
                    initial={{
                        opacity: 0,
                        scale: 1.06,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 1.3,
                        delay: 0.05,
                        ease,
                    }}
                >

                    <div className="hero-image-wrapper">

                        <motion.img
                            src={`${import.meta.env.BASE_URL}images/hero-application.webp`}
                            alt="Queridinho Supreme reparador de pontas"
                            initial={{
                                scale: 1.12,
                            }}
                            animate={{
                                scale: 1,
                            }}
                            transition={{
                                duration: 1.8,
                                delay: 0.05,
                                ease,
                            }}
                        />

                    </div>

                </motion.div>

            </div>

        </section>
    );
}

export default Hero;