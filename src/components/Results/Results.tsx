import { motion, type Variants } from "motion/react";
import "./Results.css";

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

function Results() {
    return (
        <section className="results" id="resultados">

            <div className="container">

                <motion.div
                    className="results-header"
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                >

                    <p className="results-eyebrow">
                        RESULTADOS
                    </p>

                    <h2>
                        Seu cabelo muda.
                        <br />
                        A sensação também.
                    </h2>

                    <p>
                        Desde a primeira aplicação, você percebe fios mais
                        brilhantes, macios, alinhados e perfumados.
                    </p>

                </motion.div>


                <motion.div
                    className="results-grid"
                    variants={cardsContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                >

                    <motion.div
                        className="result-card"
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.01,
                            boxShadow:
                                "0 30px 70px rgba(0,0,0,.12)",
                        }}
                    >

                        <motion.img
                            src={`${import.meta.env.BASE_URL}images/brilho-intenso.webp`}
                            alt="Cabelos com brilho intenso após o uso do Queridinho Supreme"
                            whileHover={{
                                scale: 1.03,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        />

                        <div className="result-content">

                            <span>✨</span>

                            <h3>
                                Brilho intenso
                            </h3>

                            <p>
                                Aspecto luminoso e acabamento sofisticado para os fios.
                            </p>

                        </div>

                    </motion.div>


                    <motion.div
                        className="result-card"
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.01,
                            boxShadow:
                                "0 30px 70px rgba(0,0,0,.12)",
                        }}
                    >

                        <motion.img
                            src={`${import.meta.env.BASE_URL}images/perfume-marcante.webp`}
                            alt="Cabelos perfumados com a fragrância do Queridinho Supreme"
                            whileHover={{
                                scale: 1.03,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        />

                        <div className="result-content">

                            <span>🌸</span>

                            <h3>
                                Perfume marcante
                            </h3>

                            <p>
                                Uma fragrância sofisticada que acompanha os cabelos por mais tempo.
                            </p>

                        </div>

                    </motion.div>


                    <motion.div
                        className="result-card"
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.01,
                            boxShadow:
                                "0 30px 70px rgba(0,0,0,.12)",
                        }}
                    >

                        <motion.img
                            src={`${import.meta.env.BASE_URL}images/maciez-absoluta.webp`}
                            alt="Cabelos macios e sedosos após o uso do Queridinho Supreme"
                            whileHover={{
                                scale: 1.03,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        />

                        <div className="result-content">

                            <span>💎</span>

                            <h3>
                                Maciez e sedosidade
                            </h3>

                            <p>
                                Toque sedoso e confortável sem deixar os fios pesados.
                            </p>

                        </div>

                    </motion.div>


                    <motion.div
                        className="result-card"
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.01,
                            boxShadow:
                                "0 30px 70px rgba(0,0,0,.12)",
                        }}
                    >

                        <motion.img
                            src={`${import.meta.env.BASE_URL}images/frizz-controlado.webp`}
                            alt="Cabelos alinhados e com frizz controlado após o uso do Queridinho Supreme"
                            whileHover={{
                                scale: 1.03,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        />

                        <div className="result-content">

                            <span>✔</span>

                            <h3>
                                Frizz controlado
                            </h3>

                            <p>
                                Fios mais alinhados e com aparência mais bonita.
                            </p>

                        </div>

                    </motion.div>

                </motion.div>


                <motion.div
                    className="results-footer"
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                >

                    <div className="stars">
                        ★★★★★
                    </div>

                    <h3>
                        Avaliação média 4,9 estrelas
                    </h3>

                    <p>
                        Clientes apaixonadas pela fragrância e pelo resultado.
                    </p>

                </motion.div>

            </div>

        </section>
    );
}

export default Results;