import { motion, type Variants } from "motion/react";
import "./HowTo.css";

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
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

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
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

function HowTo() {
    return (
        <section className="howto" id="como-usar">

            <div className="container">

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
                        Três passos.
                        <br />
                        Alguns segundos.
                    </h2>

                    <p className="howto-description">
                        Transforme o acabamento dos seus cabelos em poucos
                        instantes e aproveite brilho, maciez e uma fragrância
                        sofisticada no dia a dia.
                    </p>

                </motion.div>


                <motion.div
                    className="howto-steps"
                    variants={stepsContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                >

                    <motion.div
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
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >

                            <img
                                src={`${import.meta.env.BASE_URL}images/aplicando-na-mao.webp`}
                                alt="Aplicando o Queridinho Supreme na palma das mãos"
                            />

                        </motion.div>

                        <div className="step-content">

                            <h3>
                                Aplique
                            </h3>

                            <p>
                                Coloque 1 ou 2 pumps do Queridinho Supreme na palma
                                das mãos.
                            </p>

                        </div>

                    </motion.div>


                    <div className="step-line"></div>


                    <motion.div
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
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >

                            <img
                                src={`${import.meta.env.BASE_URL}images/espalhando-no-cabelo.webp`}
                                alt="Aplicando o Queridinho Supreme no comprimento e nas pontas dos cabelos"
                            />

                        </motion.div>

                        <div className="step-content">

                            <h3>
                                Espalhe
                            </h3>

                            <p>
                                Distribua suavemente no comprimento e nas pontas,
                                evitando a raiz.
                            </p>

                        </div>

                    </motion.div>


                    <div className="step-line"></div>


                    <motion.div
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
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >

                            <img
                                src={`${import.meta.env.BASE_URL}images/finalizando.webp`}
                                alt="Cabelos finalizados com o Queridinho Supreme"
                            />

                        </motion.div>

                        <div className="step-content">

                            <h3>
                                Finalize
                            </h3>

                            <p>
                                Aproveite cabelos mais brilhantes, sedosos e com uma
                                fragrância marcante.
                            </p>

                        </div>

                    </motion.div>

                </motion.div>


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

                    <span>
                        ✨
                    </span>

                    <p>
                        Não enxágue. Pode ser usado diariamente em cabelos secos
                        ou úmidos.
                    </p>

                </motion.div>

            </div>

        </section>
    );
}

export default HowTo;