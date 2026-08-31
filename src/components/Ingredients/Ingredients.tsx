import { motion, type Variants } from "motion/react";
import "./Ingredients.css";


/* =====================================================
   ANIMAÇÃO DO CONTEÚDO
===================================================== */

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
   ANIMAÇÃO DA LISTA
===================================================== */

const listVariants: Variants = {

    hidden: {},

    visible: {

        transition: {

            staggerChildren: 0.09,

            delayChildren: 0.15,

        },

    },

};


/* =====================================================
   ANIMAÇÃO DOS ITENS
===================================================== */

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
   INGREDIENTS
===================================================== */

function Ingredients() {

    return (

        <section
            className="ingredients"
            id="ingredientes"
        >

            <div className="container ingredients-container">


                {/* =================================================
                    IMAGEM
                ================================================= */}

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
                        ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                        ],
                    }}
                >

                    <motion.img
                        src={`${import.meta.env.BASE_URL}images/product-angle.webp`}

                        alt="Queridinho Supreme, reparador de pontas da Vanti Cosméticos"

                        loading="lazy"

                        decoding="async"

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
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}

                        whileHover={{
                            scale: 1.03,
                            y: -6,
                        }}

                    />

                </motion.div>


                {/* =================================================
                    CONTEÚDO
                ================================================= */}

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


                    {/* =================================================
                        EYEBROW
                    ================================================= */}

                    <motion.p
                        className="ingredients-eyebrow"

                        variants={contentVariants}
                    >
                        POR TRÁS DO RESULTADO
                    </motion.p>


                    {/* =================================================
                        TÍTULO
                    ================================================= */}

                    <motion.h2
                        variants={contentVariants}
                    >

                        E isso começa
                        <br />
                        pela Fórmula.

                    </motion.h2>


                    {/* =================================================
                        DESCRIÇÃO
                    ================================================= */}

                    <motion.p
                        className="ingredients-description"

                        variants={contentVariants}
                    >

                        Uma combinação de óleos vegetais para cuidar dos fios e uma fragrância sofisticada para completar a finalização.

                    </motion.p>


                    {/* =================================================
                        LISTA DE INGREDIENTES
                    ================================================= */}

                    <motion.div
                        className="ingredients-list"

                        variants={listVariants}
                    >


                        {/* =================================================
                            JOJOBA
                        ================================================= */}

                        <motion.article
                            className="ingredient"

                            variants={itemVariants}

                            whileHover={{
                                x: 6,
                            }}
                        >

                            <div
                                className="ingredient-icon"
                                aria-hidden="true"
                            >
                                🌿
                            </div>


                            <div>

                                <h3>
                                    Óleo de Jojoba
                                </h3>

                                <p>
                                    Nutre os fios e ajuda a manter um toque leve.
                                </p>

                            </div>

                        </motion.article>


                        {/* =================================================
                            BURITI
                        ================================================= */}

                        <motion.article
                            className="ingredient"

                            variants={itemVariants}

                            whileHover={{
                                x: 6,
                            }}
                        >

                            <div
                                className="ingredient-icon"
                                aria-hidden="true"
                            >
                                🥥
                            </div>


                            <div>

                                <h3>
                                    Óleo de Buriti
                                </h3>

                                <p>
                                    Ajuda a realçar o brilho e o aspecto luminoso.
                                </p>

                            </div>

                        </motion.article>


                        {/* =================================================
                            PATUA
                        ================================================= */}

                        <motion.article
                            className="ingredient"

                            variants={itemVariants}

                            whileHover={{
                                x: 6,
                            }}
                        >

                            <div
                                className="ingredient-icon"
                                aria-hidden="true"
                            >
                                🍃
                            </div>


                            <div>

                                <h3>
                                    Óleo de Patauá
                                </h3>

                                <p>
                                    Contribui para fios mais macios e alinhados.
                                </p>

                            </div>

                        </motion.article>


                        {/* =================================================
                            FRAGRÂNCIA
                        ================================================= */}

                        <motion.article
                            className="ingredient"

                            variants={itemVariants}

                            whileHover={{
                                x: 6,
                            }}
                        >

                            <div
                                className="ingredient-icon"
                                aria-hidden="true"
                            >
                                🌸
                            </div>


                            <div>

                                <h3>
                                    Fragrância Sofisticada
                                </h3>

                                <p>
                                    O toque final que deixa o cabelo ainda mais marcante.
                                </p>

                            </div>

                        </motion.article>


                    </motion.div>

                </motion.div>

            </div>

        </section>

    );

}


export default Ingredients;