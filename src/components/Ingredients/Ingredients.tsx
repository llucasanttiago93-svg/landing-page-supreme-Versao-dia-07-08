import { motion, type Variants } from "motion/react";
import "./Ingredients.css";

const contentVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 35,
    },

    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const listVariants: Variants = {
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
        y: 25,
    },

    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

function Ingredients() {
    return (
        <section className="ingredients" id="ingredientes">

            <div className="container ingredients-container">

                <motion.div
                    className="ingredients-image"
                    initial={{
                        opacity: 0,
                        scale: 1.08,
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.25,
                    }}
                    transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >

                    <motion.img
                        src={`${import.meta.env.BASE_URL}images/product-angle.webp`}
                        alt="Frasco do Queridinho Supreme, reparador de pontas da Vanti Cosméticos"
                        initial={{
                            scale: 1.08,
                        }}
                        whileInView={{
                            scale: 1,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.25,
                        }}
                        transition={{
                            duration: 1.5,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{
                            scale: 1.03,
                            y: -6,
                        }}
                    />

                </motion.div>


                <motion.div
                    className="ingredients-content"
                    variants={contentVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.25,
                    }}
                >

                    <motion.p
                        className="ingredients-eyebrow"
                        variants={contentVariants}
                    >
                        INGREDIENTES
                    </motion.p>


                    <motion.h2
                        variants={contentVariants}
                    >
                        Tratamento que cuida. Fragrância que marca.
                    </motion.h2>


                    <motion.p
                        className="ingredients-description"
                        variants={contentVariants}
                    >
                        Uma combinação de óleos vegetais nutritivos e uma fragrância
                        premium para deixar os cabelos macios, brilhantes, alinhados
                        e perfumados.
                    </motion.p>


                    <motion.div
                        className="ingredients-list"
                        variants={listVariants}
                    >

                        <motion.div
                            className="ingredient"
                            variants={itemVariants}
                            whileHover={{
                                x: 6,
                            }}
                        >

                            <div className="ingredient-icon">
                                🌿
                            </div>

                            <div>

                                <h3>
                                    Óleo de Jojoba
                                </h3>

                                <p>
                                    Ajuda a nutrir os fios sem deixar o cabelo pesado.
                                </p>

                            </div>

                        </motion.div>


                        <motion.div
                            className="ingredient"
                            variants={itemVariants}
                            whileHover={{
                                x: 6,
                            }}
                        >

                            <div className="ingredient-icon">
                                🥥
                            </div>

                            <div>

                                <h3>
                                    Óleo de Buriti
                                </h3>

                                <p>
                                    Ajuda a proporcionar brilho e um acabamento luminoso aos fios.
                                </p>

                            </div>

                        </motion.div>


                        <motion.div
                            className="ingredient"
                            variants={itemVariants}
                            whileHover={{
                                x: 6,
                            }}
                        >

                            <div className="ingredient-icon">
                                🍃
                            </div>

                            <div>

                                <h3>
                                    Óleo de Patauá
                                </h3>

                                <p>
                                    Contribui para fios mais macios, alinhados e com menos frizz.
                                </p>

                            </div>

                        </motion.div>


                        <motion.div
                            className="ingredient"
                            variants={itemVariants}
                            whileHover={{
                                x: 6,
                            }}
                        >

                            <div className="ingredient-icon">
                                🌸
                            </div>

                            <div>

                                <h3>
                                    Fragrância Premium
                                </h3>

                                <p>
                                    Perfuma os cabelos com uma fragrância sofisticada e de longa duração.
                                </p>

                            </div>

                        </motion.div>

                    </motion.div>

                </motion.div>

            </div>

        </section>
    );
}

export default Ingredients;