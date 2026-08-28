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


                        <p className="testimonials-eyebrow">
                            O DIFERENCIAL QUE VOCÊ SENTE
                        </p>
                        <h2>
                            Tem cheiro de cabelo Bem cuidado.<br/>
                            E de quem acabou de sair do Salão.
                        </h2>

                        <h3>
                            Uma fragrância sofisticada que acompanha seus fios e transforma a finalização em uma experiência.
                        </h3>

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
                                Perfume Marcante
                            </h4>

                            <p>
                                Aquele cheiro que faz você mexer no cabelo e sentir de novo.
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
                                Fragrância Sofisticada
                            </h4>

                            <p>
                                Uma presença Delicada, Elegante e nada comum.
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
                                Uma Experiência que Permanece
                            </h4>

                            <p>
                                O objetivo não é só deixar o cabelo bonito. É fazer você gostar de estar com ele.
                            </p>

                        </motion.div>

                    </motion.div>

                </div>

            </div>

        </section>
    );
}

export default Fragrance;