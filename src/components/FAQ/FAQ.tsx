import { motion, type Variants } from "motion/react";
import "./Faq.css";


/* =====================================================
   ANIMAÇÕES
   Mais leves para reduzir trabalho de renderização.
===================================================== */

const headerVariants: Variants = {

    hidden: {
        opacity: 0,
    },

    visible: {

        opacity: 1,

        transition: {
            duration: 0.35,
            ease: "easeOut",
        },

    },

};


const listVariants: Variants = {

    hidden: {},

    visible: {},

};


const itemVariants: Variants = {

    hidden: {
        opacity: 0,
    },

    visible: {

        opacity: 1,

        transition: {
            duration: 0.3,
            ease: "easeOut",
        },

    },

};


/* =====================================================
   COMPONENTE
===================================================== */

function Faq() {

    return (

        <section
            className="faq"
            id="faq"
        >

            <div className="container">


                {/* =====================================
                    HEADER
                ===================================== */}

                <motion.div
                    className="faq-header"

                    variants={headerVariants}

                    initial="hidden"

                    whileInView="visible"

                    viewport={{
                        once: true,
                        amount: 0.25,
                    }}
                >

                    <p className="faq-eyebrow">
                        ANTES DE PEDIR O SEU
                    </p>


                    <h2>
                        Ficou com alguma dúvida?
                        <br />
                        A gente responde.
                    </h2>


                    <p>
                        Tudo o que você precisa saber antes de experimentar o Queridinho Supreme.
                    </p>

                </motion.div>


                {/* =====================================
                    FAQ
                ===================================== */}

                <motion.div
                    className="faq-list"

                    variants={listVariants}

                    initial="hidden"

                    whileInView="visible"

                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                >


                    {/* =================================
                        PERGUNTA 1
                    ================================= */}

                    <motion.details
                        variants={itemVariants}

                        whileHover={{
                            y: -2,
                        }}

                        transition={{
                            duration: 0.2,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >

                        <summary>
                            Vai pesar meu cabelo?
                        </summary>

                        <p>
                            Não. A fórmula foi pensada para proporcionar
                            brilho, maciez e alinhamento sem deixar aquela
                            sensação pesada nos fios. Aplique uma pequena
                            quantidade no comprimento e nas pontas.
                        </p>

                    </motion.details>


                    {/* =================================
                        PERGUNTA 2
                    ================================= */}

                    <motion.details
                        variants={itemVariants}

                        whileHover={{
                            y: -2,
                        }}

                        transition={{
                            duration: 0.2,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >

                        <summary>
                            Posso usar todos os dias?
                        </summary>

                        <p>
                            Sim. O Queridinho Supreme pode ser usado
                            diariamente em cabelos secos ou úmidos.
                            Aplique no comprimento e nas pontas,
                            evitando a raiz.
                        </p>

                    </motion.details>


                    {/* =================================
                        PERGUNTA 3
                    ================================= */}

                    <motion.details
                        variants={itemVariants}

                        whileHover={{
                            y: -2,
                        }}

                        transition={{
                            duration: 0.2,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >

                        <summary>
                            Serve para o meu tipo de cabelo?
                        </summary>

                        <p>
                            Sim. Pode ser usado em diferentes tipos de
                            cabelo, inclusive lisos, ondulados, cacheados
                            e crespos.
                        </p>

                    </motion.details>


                    {/* =================================
                        PERGUNTA 4
                    ================================= */}

                    <motion.details
                        variants={itemVariants}

                        whileHover={{
                            y: -2,
                        }}

                        transition={{
                            duration: 0.2,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >

                        <summary>
                            E o perfume, fica por quanto tempo?
                        </summary>

                        <p>
                            A percepção da fragrância varia de acordo
                            com o tipo de cabelo, a quantidade aplicada
                            e a rotina de cada pessoa. A proposta é
                            deixar os fios perfumados com uma
                            fragrância sofisticada após a finalização.
                        </p>

                    </motion.details>


                    {/* =================================
                        PERGUNTA 5
                    ================================= */}

                    <motion.details
                        variants={itemVariants}

                        whileHover={{
                            y: -2,
                        }}

                        transition={{
                            duration: 0.2,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >

                        <summary>
                            Como vou receber meu pedido?
                        </summary>

                        <p>
                            Enviamos para todo o Brasil. Após a confirmação
                            do pagamento, seu pedido é preparado para envio
                            e você poderá acompanhar a entrega conforme a
                            modalidade disponível.
                        </p>

                    </motion.details>


                    {/* =================================
                        PERGUNTA 6
                    ================================= */}

                    <motion.details
                        variants={itemVariants}

                        whileHover={{
                            y: -2,
                        }}

                        transition={{
                            duration: 0.2,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                    >

                        <summary>
                            Como é feito o pagamento?
                        </summary>

                        <p>
                            O pagamento é realizado com segurança pelo
                            checkout da InfinitePay, com as opções
                            disponíveis no momento da compra.
                        </p>

                    </motion.details>

                </motion.div>


                {/* =====================================
                    CTA FINAL
                ===================================== */}

                <motion.div
                    className="faq-cta"

                    initial={{
                        opacity: 0,
                    }}

                    whileInView={{
                        opacity: 1,
                    }}

                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}

                    transition={{
                        duration: 0.35,
                        ease: "easeOut",
                    }}
                >

                    <p className="faq-cta-text">
                        Agora você já sabe o que esperar.
                    </p>


                    <motion.a
                        href="#comprar"

                        className="faq-cta-button"

                        whileHover={{
                            y: -3,
                            scale: 1.01,
                        }}

                        whileTap={{
                            scale: 0.97,
                        }}
                    >
                        QUERO MEU QUERIDINHO
                    </motion.a>

                </motion.div>

            </div>

        </section>

    );

}


export default Faq;