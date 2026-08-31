import { motion, type Variants } from "motion/react";
import "./Solution.css";


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
   ANIMAÇÃO DOS BENEFÍCIOS
===================================================== */

const benefitsContainerVariants: Variants = {

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

    y: 25,

    scale: 0.97,

  },

  visible: {

    opacity: 1,

    y: 0,

    scale: 1,

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
   SOLUTION
===================================================== */

function Solution() {

  return (

    <section
      className="solution"
      id="beneficios"
    >

      <div className="container solution-container">


        {/* =================================================
            IMAGEM
        ================================================= */}

        <motion.div
          className="solution-image"

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
            src={`${import.meta.env.BASE_URL}images/model-fragrance.webp`}

            alt="Mulher aplicando o Queridinho Supreme nos cabelos"

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
              scale: 1.025,
            }}

          />

        </motion.div>


        {/* =================================================
            CONTEÚDO
        ================================================= */}

        <motion.div
          className="solution-content"

          variants={contentVariants}

          initial="hidden"

          whileInView="visible"

          viewport={{
            once: true,
            amount: 0.25,
          }}
        >


          {/* =================================================
              TÍTULO
          ================================================= */}

          <motion.h2
            variants={contentVariants}
          >

            O toque final <br />
            que muda o cabelo.

            <span>
              E muda a sensação de estar com ele.
            </span>

          </motion.h2>


          {/* =================================================
              DESCRIÇÃO
          ================================================= */}

          <motion.p
            className="solution-description"

            variants={contentVariants}
          >

            Depois da finalização, os fios ficam mais Bonitos, Alinhados e Macios.

            <br />

            E aquele <i>Perfume Sofisticado</i> faz parte da experiência.

          </motion.p>


          {/* =================================================
              BENEFÍCIOS
          ================================================= */}

          <motion.div
            className="solution-benefits"

            variants={
              benefitsContainerVariants
            }
          >


            <motion.div
              className="solution-item"

              variants={benefitVariants}

              whileHover={{
                y: -5,

                boxShadow:
                  "0 15px 35px rgba(0,0,0,.10)",
              }}
            >

              <span aria-hidden="true">
                ✓
              </span>

              <p>
                Brilho que Aparece
              </p>

            </motion.div>


            <motion.div
              className="solution-item"

              variants={benefitVariants}

              whileHover={{
                y: -5,

                boxShadow:
                  "0 15px 35px rgba(0,0,0,.10)",
              }}
            >

              <span aria-hidden="true">
                ✓
              </span>

              <p>
                Fios mais Alinhados
              </p>

            </motion.div>


            <motion.div
              className="solution-item"

              variants={benefitVariants}

              whileHover={{
                y: -5,

                boxShadow:
                  "0 15px 35px rgba(0,0,0,.10)",
              }}
            >

              <span aria-hidden="true">
                ✓
              </span>

              <p>
                Toque Macio e Sedoso
              </p>

            </motion.div>


            <motion.div
              className="solution-item"

              variants={benefitVariants}

              whileHover={{
                y: -5,

                boxShadow:
                  "0 15px 35px rgba(0,0,0,.10)",
              }}
            >

              <span aria-hidden="true">
                ✓
              </span>

              <p>
                Fragrância que Marca
              </p>

            </motion.div>


          </motion.div>


          {/* =================================================
              CTA
          ================================================= */}

          <motion.a
            href="#comprar"

            className="solution-button"

            variants={contentVariants}

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

            QUERO ESSE RESULTADO

          </motion.a>


        </motion.div>

      </div>

    </section>

  );

}


export default Solution;