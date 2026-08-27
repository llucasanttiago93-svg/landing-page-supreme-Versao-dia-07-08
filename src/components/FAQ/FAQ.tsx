import { motion, type Variants } from "motion/react";
import "./Faq.css";


/* =====================================================
   ANIMAÇÕES
===================================================== */

const headerVariants: Variants = {

    hidden: {
        opacity: 0,
        y: 35,
    },

    visible: {
        opacity: 1,
        y: 0,

        transition: {
            duration: .8,
            ease: [.22, 1, .36, 1],
        },
    },

};


const listVariants: Variants = {

    hidden: {},

    visible: {

        transition: {
            staggerChildren: .09,
            delayChildren: .1,
        },

    },

};


const itemVariants: Variants = {

    hidden: {
        opacity: 0,
        y: 25,
        scale: .98,
    },

    visible: {

        opacity: 1,

        y: 0,

        scale: 1,

        transition: {
            duration: .6,
            ease: [.22, 1, .36, 1],
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
                        amount: .25,
                    }}
                >

                    <p className="faq-eyebrow">
                        PERGUNTAS FREQUENTES
                    </p>


                    <h2>
                        Ainda ficou alguma dúvida?
                    </h2>


                    <p>
                        Respondemos as perguntas mais comuns sobre o
                        Queridinho Supreme.
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
                        amount: .15,
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
                            duration: .25,
                            ease: [.22, 1, .36, 1],
                        }}
                    >

                        <summary>
                            O Queridinho Supreme pesa os fios?
                        </summary>

                        <p>
                            Não. O Queridinho Supreme possui uma textura leve
                            e foi desenvolvido para deixar os cabelos macios
                            e alinhados sem sensação pesada.
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
                            duration: .25,
                            ease: [.22, 1, .36, 1],
                        }}
                    >

                        <summary>
                            Posso usar o Queridinho Supreme todos os dias?
                        </summary>

                        <p>
                            Sim. Ele pode ser utilizado diariamente em cabelos
                            secos ou úmidos, aplicando uma pequena quantidade
                            no comprimento e nas pontas.
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
                            duration: .25,
                            ease: [.22, 1, .36, 1],
                        }}
                    >

                        <summary>
                            O Queridinho Supreme serve para qualquer tipo de cabelo?
                        </summary>

                        <p>
                            Sim. O produto pode ser utilizado em diferentes
                            tipos de cabelo, incluindo lisos, ondulados,
                            cacheados e crespos.
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
                            duration: .25,
                            ease: [.22, 1, .36, 1],
                        }}
                    >

                        <summary>
                            Quanto tempo dura a fragrância?
                        </summary>

                        <p>
                            A duração da fragrância pode variar de acordo
                            com o tipo de cabelo, quantidade aplicada e
                            rotina de cada pessoa.
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
                            duration: .25,
                            ease: [.22, 1, .36, 1],
                        }}
                    >

                        <summary>
                            Como funciona o envio?
                        </summary>

                        <p>
                            Enviamos para todo o Brasil. Após a confirmação
                            do pagamento, o pedido é preparado para envio
                            e você poderá acompanhar a entrega conforme
                            a modalidade disponível.
                        </p>

                    </motion.details>


                </motion.div>

            </div>

        </section>

    );

}


export default Faq;