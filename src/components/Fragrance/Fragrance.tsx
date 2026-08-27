import { motion, type Variants } from "motion/react";
import "./Fragrance.css";

const contentVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 35,
    },

    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

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
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

function Fragrance() {
    return (
        <section
            className="fragrance"
            id="fragrancia"
            style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}images/fragrance-bg.webp)`,
            }}
        >

            <div className="fragrance-overlay">

                <div className="container">


                    <motion.div
                        className="fragrance-content"
                        variants={contentVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            amount: 0.3,
                        }}
                    >

                        <h2>
                            Não é apenas um reparador.
                        </h2>

                        <h3>
                            É a fragrância que transforma a presença dos seus cabelos.
                        </h3>

                        <p className="fragrance-description">
                            Brilho, maciez e uma fragrância sofisticada que acompanha você
                            durante o dia. Cada movimento dos fios revela uma experiência
                            elegante e marcante.
                        </p>

                    </motion.div>


                    <motion.div
                        className="fragrance-cards"
                        variants={cardsContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            amount: 0.15,
                        }}
                    >

                        <motion.div
                            className="fragrance-card"
                            variants={cardVariants}
                            whileHover={{
                                y: -8,
                                scale: 1.015,
                                boxShadow:
                                    "0 25px 60px rgba(0,0,0,.25)",
                            }}
                        >

                            <div className="card-icon">
                                ✨
                            </div>

                            <h4>
                                Fragrância sofisticada
                            </h4>

                            <p>
                                Aroma elegante e marcante que deixa os cabelos
                                perfumados ao longo do dia.
                            </p>

                        </motion.div>


                        <motion.div
                            className="fragrance-card"
                            variants={cardVariants}
                            whileHover={{
                                y: -8,
                                scale: 1.015,
                                boxShadow:
                                    "0 25px 60px rgba(0,0,0,.25)",
                            }}
                        >

                            <div className="card-icon">
                                🌸
                            </div>

                            <h4>
                                Perfume premium
                            </h4>

                            <p>
                                Uma fragrância floral, quente e envolvente para
                                cabelos marcantes e inesquecíveis.
                            </p>

                        </motion.div>


                        <motion.div
                            className="fragrance-card"
                            variants={cardVariants}
                            whileHover={{
                                y: -8,
                                scale: 1.015,
                                boxShadow:
                                    "0 25px 60px rgba(0,0,0,.25)",
                            }}
                        >

                            <div className="card-icon">
                                ⏳
                            </div>

                            <h4>
                                Longa duração
                            </h4>

                            <p>
                                Sensação de cabelo recém-perfumado por muito mais tempo.
                            </p>

                        </motion.div>

                    </motion.div>

                </div>

            </div>

        </section>
    );
}

export default Fragrance;