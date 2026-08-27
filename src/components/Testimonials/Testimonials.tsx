import { useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
import "./Testimonials.css";

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
            staggerChildren: 0.09,
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

function Testimonials() {

    const carouselRef =
        useRef<HTMLDivElement>(null);

    const [current, setCurrent] =
        useState(0);


    const testimonials = [
        {
            image:
                `${import.meta.env.BASE_URL}images/prova2.webp`
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova1.webp`
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova3.webp`
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova4.webp`
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova5.webp`
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova6.webp`
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova7.webp`
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova8.webp`
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova9.webp`
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova10.webp`
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova11.webp`
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova12.webp`
        },
    ];


    const scrollToCard = (index: number) => {

        const carousel =
            carouselRef.current;

        if (!carousel) return;


        const cards =
            carousel.querySelectorAll<HTMLElement>(
                ".testimonial-card"
            );


        const card = cards[index];

        if (!card) return;


        carousel.scrollTo({

            left: card.offsetLeft,

            behavior: "smooth",

        });


        setCurrent(index);

    };


    const nextTestimonial = () => {

        const next =
            current === testimonials.length - 1
                ? 0
                : current + 1;


        scrollToCard(next);

    };


    const previousTestimonial = () => {

        const previous =
            current === 0
                ? testimonials.length - 1
                : current - 1;


        scrollToCard(previous);

    };


    const handleScroll = () => {

        const carousel =
            carouselRef.current;

        if (!carousel) return;


        const cards =
            carousel.querySelectorAll<HTMLElement>(
                ".testimonial-card"
            );


        let closestIndex = 0;

        let closestDistance =
            Infinity;


        cards.forEach(
            (card, index) => {

                const distance =
                    Math.abs(
                        card.offsetLeft -
                        carousel.scrollLeft
                    );


                if (
                    distance <
                    closestDistance
                ) {

                    closestDistance =
                        distance;

                    closestIndex =
                        index;

                }

            }
        );


        setCurrent(closestIndex);

    };


    return (

        <section
            className="testimonials"
            id="depoimentos"
        >

            <div className="container">


                {/* =========================
                    HEADER
                ========================= */}

                <motion.div
                    className="testimonials-header"
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.25,
                    }}
                >

                    <p className="testimonials-eyebrow">
                        QUEM USA, RECOMENDA
                    </p>


                    <h2>
                        Apaixonadas pelo brilho.
                        <br />
                        Encantadas pela fragrância.
                    </h2>


                    <p className="testimonials-description">
                        Veja experiências reais de clientes que já
                        conheceram o Queridinho Supreme.
                    </p>

                </motion.div>


                {/* =========================
                    CARROSSEL
                ========================= */}

                <div className="testimonials-carousel">


                    <button
                        type="button"
                        className="carousel-button carousel-prev"
                        onClick={previousTestimonial}
                        aria-label="Prova social anterior"
                    >
                        ‹
                    </button>


                    <motion.div
                        className="testimonials-viewport"
                        ref={carouselRef}
                        onScroll={handleScroll}
                        variants={cardsContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            amount: 0.1,
                        }}
                    >

                        <div className="testimonials-track">


                            {testimonials.map(
                                (
                                    testimonial,
                                    index
                                ) => (

                                    <motion.article
                                        key={index}
                                        className={
                                            `testimonial-card ${
                                                current === index
                                                    ? "active-card"
                                                    : ""
                                            }`
                                        }
                                        variants={
                                            cardVariants
                                        }
                                        whileHover={{
                                            y: -8,
                                            scale: 1.015,
                                            boxShadow:
                                                "0 28px 60px rgba(0,0,0,.14)",
                                        }}
                                        transition={{
                                            duration: 0.3,
                                        }}
                                    >

                                        <motion.img
                                            src={
                                                testimonial.image
                                            }
                                            alt={
                                                `Experiência de cliente com o Queridinho Supreme - prova social ${index + 1}`
                                            }
                                            whileHover={{
                                                scale: 1.035,
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                ease: [
                                                    0.22,
                                                    1,
                                                    0.36,
                                                    1,
                                                ],
                                            }}
                                        />

                                    </motion.article>

                                )
                            )}

                        </div>

                    </motion.div>


                    <button
                        type="button"
                        className="carousel-button carousel-next"
                        onClick={nextTestimonial}
                        aria-label="Próxima prova social"
                    >
                        ›
                    </button>

                </div>


                {/* =========================
                    DOTS
                ========================= */}

                <div className="carousel-dots">

                    {testimonials.map(
                        (_, index) => (

                            <button
                                type="button"
                                key={index}
                                className={
                                    current === index
                                        ? "carousel-dot active"
                                        : "carousel-dot"
                                }
                                onClick={() =>
                                    scrollToCard(index)
                                }
                                aria-label={
                                    `Ir para prova social ${index + 1}`
                                }
                            />

                        )
                    )}

                </div>


                {/* =========================
                    FOOTER
                ========================= */}

                <motion.div
                    className="testimonials-footer"
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                >

                    <div className="footer-stars">
                        ★★★★★
                    </div>


                    <h3>
                        Experiências reais de quem já usou.
                    </h3>


                    <p>
                        Veja o que nossas clientes estão falando sobre o
                        Queridinho Supreme.
                    </p>

                </motion.div>


            </div>

        </section>

    );

}


export default Testimonials;