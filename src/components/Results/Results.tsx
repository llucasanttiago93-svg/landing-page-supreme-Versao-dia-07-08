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
                        O RESULTADO NO ESPELHO
                    </p>

                    <h2>
                        É aqui que você percebe.<br />
                        E sente a diferença.
                    </h2>

                    <p>
                        Mais brilho.
                        Mais maciez.
                        Mais alinhamento.
                        E aquele perfume que completa tudo.
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
                                Brilho Intenso
                            </h3>

                            <p>
                                Fios com aparência mais luminosa e acabamento bonito.
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
                                Perfume Marcante
                            </h3>

                            <p>
                                Uma fragrância sofisticada que transforma a finalização.
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
                                Maciez e Sedosidade
                            </h3>

                            <p>
                                Toque macio e agradável sem sensação pesada.
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
                                Fios mais Alinhados
                            </h3>

                            <p>
                                Menos aparência de frizz e um acabamento mais polido.
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



                </motion.div>

            </div>

        </section>
    );
}

export default Results;