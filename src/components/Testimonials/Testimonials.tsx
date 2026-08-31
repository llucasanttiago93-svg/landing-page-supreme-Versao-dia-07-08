import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    motion,
    type Variants,
} from "motion/react";

import "./Testimonials.css";


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

            duration: 0.8,

            ease: [
                0.22,
                1,
                0.36,
                1,
            ],

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
   COMPONENTE
===================================================== */

function Testimonials() {


    /* =================================================
       REFERÊNCIA DO CARROSSEL
    ================================================= */

    const carouselRef =
        useRef<HTMLDivElement>(null);


    /* =================================================
       CARD ATUAL
    ================================================= */

    const [
        current,
        setCurrent,
    ] = useState(0);


    /* =================================================
       LIGHTBOX
    ================================================= */

    const [
        selectedTestimonial,
        setSelectedTestimonial,
    ] = useState<number | null>(null);


    /* =================================================
       SWIPE DO LIGHTBOX
    ================================================= */

    const [
        lightboxTouchStartX,
        setLightboxTouchStartX,
    ] = useState<number | null>(null);


    /* =================================================
       DEPOIMENTOS
    ================================================= */

    const testimonials = [

        {
            image:
                `${import.meta.env.BASE_URL}images/prova2.webp`,
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova1.webp`,
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova3.webp`,
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova4.webp`,
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova5.webp`,
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova6.webp`,
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova7.webp`,
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova8.webp`,
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova9.webp`,
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova10.webp`,
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova11.webp`,
        },

        {
            image:
                `${import.meta.env.BASE_URL}images/prova12.webp`,
        },

    ];


    /* =================================================
       SCROLL PARA O CARD
    ================================================= */

    const scrollToCard =
        (index: number) => {

            const carousel =
                carouselRef.current;


            if (!carousel) {

                return;

            }


            const cards =
                carousel.querySelectorAll<HTMLElement>(
                    ".testimonial-card"
                );


            const card =
                cards[index];


            if (!card) {

                return;

            }


            carousel.scrollTo({

                left:
                    card.offsetLeft,

                behavior:
                    "smooth",

            });


            setCurrent(
                index
            );

        };


    /* =================================================
       PRÓXIMO
    ================================================= */

    const nextTestimonial =
        () => {

            const next =

                current ===
                    testimonials.length - 1

                    ? 0

                    : current + 1;


            scrollToCard(
                next
            );

        };


    /* =================================================
       ANTERIOR
    ================================================= */

    const previousTestimonial =
        () => {

            const previous =

                current === 0

                    ? testimonials.length - 1

                    : current - 1;


            scrollToCard(
                previous
            );

        };


    /* =================================================
       SCROLL MANUAL
    ================================================= */

    const handleScroll =
        () => {

            const carousel =
                carouselRef.current;


            if (!carousel) {

                return;

            }


            const cards =
                carousel.querySelectorAll<HTMLElement>(
                    ".testimonial-card"
                );


            let closestIndex =
                0;


            let closestDistance =
                Infinity;


            cards.forEach(
                (
                    card,
                    index
                ) => {

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


            setCurrent(
                closestIndex
            );

        };


    /* =================================================
       ABRIR LIGHTBOX
    ================================================= */

    const openTestimonial =
        (index: number) => {

            setCurrent(
                index
            );


            setSelectedTestimonial(
                index
            );

        };


    /* =================================================
       FECHAR LIGHTBOX
    ================================================= */

    const closeTestimonial =
        () => {

            setSelectedTestimonial(
                null
            );


            setLightboxTouchStartX(
                null
            );

        };


    /* =================================================
       PRÓXIMO NO LIGHTBOX
    ================================================= */

    const nextSelectedTestimonial =
        () => {

            const next =

                selectedTestimonial ===
                    null

                    ? 0

                    : selectedTestimonial ===
                        testimonials.length - 1

                        ? 0

                        : selectedTestimonial + 1;


            setSelectedTestimonial(
                next
            );


            setCurrent(
                next
            );


            scrollToCard(
                next
            );

        };


    /* =================================================
       ANTERIOR NO LIGHTBOX
    ================================================= */

    const previousSelectedTestimonial =
        () => {

            const previous =

                selectedTestimonial ===
                    null

                    ? testimonials.length - 1

                    : selectedTestimonial ===
                        0

                        ? testimonials.length - 1

                        : selectedTestimonial - 1;


            setSelectedTestimonial(
                previous
            );


            setCurrent(
                previous
            );


            scrollToCard(
                previous
            );

        };


    /* =================================================
       TOUCH START DO LIGHTBOX
    ================================================= */

    const handleLightboxTouchStart =
        (
            event:
                React.TouchEvent<HTMLDivElement>
        ) => {

            if (
                event.touches.length !== 1
            ) {

                return;

            }


            setLightboxTouchStartX(
                event.touches[0].clientX
            );

        };


    /* =================================================
       TOUCH END DO LIGHTBOX
    ================================================= */

    const handleLightboxTouchEnd =
        (
            event:
                React.TouchEvent<HTMLDivElement>
        ) => {

            if (
                lightboxTouchStartX ===
                null
            ) {

                return;

            }


            const touch =
                event.changedTouches[0];


            if (!touch) {

                setLightboxTouchStartX(
                    null
                );

                return;

            }


            const deltaX =
                touch.clientX -
                lightboxTouchStartX;


            const minSwipeDistance =
                50;


            if (
                Math.abs(deltaX) >=
                minSwipeDistance
            ) {

                if (
                    deltaX < 0
                ) {

                    nextSelectedTestimonial();

                } else {

                    previousSelectedTestimonial();

                }

            }


            setLightboxTouchStartX(
                null
            );

        };


    /* =================================================
       TECLADO + BLOQUEIO DO BODY
    ================================================= */

    useEffect(() => {

        if (
            selectedTestimonial ===
            null
        ) {

            return;

        }


        const handleKeyDown =
            (
                event: KeyboardEvent
            ) => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeTestimonial();

                    return;

                }


                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    nextSelectedTestimonial();

                    return;

                }


                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    previousSelectedTestimonial();

                }

            };


        document.addEventListener(
            "keydown",
            handleKeyDown
        );


        document.body.style.overflow =
            "hidden";


        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );


            document.body.style.overflow =
                "";

        };

    }, [
        selectedTestimonial,
    ]);


    /* =================================================
       RENDER
    ================================================= */

    return (

        <section
            className="testimonials"
            id="depoimentos"
        >

            <div className="container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <motion.div
                    className="testimonials-header"

                    variants={
                        headerVariants
                    }

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

                        Não somos nós
                        <br />

                        que dizemos.
                        <br />

                        São elas.

                    </h2>


                    <p className="testimonials-description">

                        Veja o que nossas clientes estão falando sobre o{" "}

                        <strong>
                            Queridinho Supreme
                        </strong>.

                    </p>

                </motion.div>


                {/* =================================================
                    CARROSSEL
                ================================================= */}

                <div className="testimonials-carousel">


                    <button
                        type="button"

                        className="
                            carousel-button
                            carousel-prev
                        "

                        onClick={
                            previousTestimonial
                        }

                        aria-label="Prova social anterior"
                    >

                        ‹

                    </button>


                    <motion.div
                        className="testimonials-viewport"

                        ref={carouselRef}

                        onScroll={
                            handleScroll
                        }

                        variants={
                            cardsContainerVariants
                        }

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

                                        className={`
                                            testimonial-card
                                            ${
                                                current === index
                                                    ? "active-card"
                                                    : ""
                                            }
                                        `}

                                        variants={
                                            cardVariants
                                        }

                                        whileHover={{
                                            y: -8,

                                            scale: 1.02,

                                            boxShadow:
                                                "0 28px 60px rgba(0,0,0,.14)",
                                        }}

                                        transition={{
                                            duration: 0.25,
                                        }}

                                        role="button"

                                        tabIndex={0}

                                        onClick={() =>
                                            openTestimonial(
                                                index
                                            )
                                        }

                                        onKeyDown={(
                                            event
                                        ) => {

                                            if (
                                                event.key ===
                                                    "Enter" ||
                                                event.key ===
                                                    " "
                                            ) {

                                                event.preventDefault();

                                                openTestimonial(
                                                    index
                                                );

                                            }

                                        }}

                                        aria-label={
                                            `Ampliar prova social ${index + 1}`
                                        }

                                    >

                                        <motion.img

                                            src={
                                                testimonial.image
                                            }

                                            alt={
                                                `Experiência de cliente com o Queridinho Supreme - prova social ${index + 1}`
                                            }

                                            loading="lazy"

                                            decoding="async"

                                            whileHover={{
                                                scale: 1.035,
                                            }}

                                            transition={{
                                                duration: 0.45,

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

                        className="
                            carousel-button
                            carousel-next
                        "

                        onClick={
                            nextTestimonial
                        }

                        aria-label="Próxima prova social"
                    >

                        ›

                    </button>

                </div>


                {/* =================================================
                    DOTS
                ================================================= */}

                <div className="carousel-dots">

                    {testimonials.map(
                        (
                            _,
                            index
                        ) => (

                            <button

                                type="button"

                                key={index}

                                className={
                                    current === index
                                        ? "carousel-dot active"
                                        : "carousel-dot"
                                }

                                onClick={() =>
                                    scrollToCard(
                                        index
                                    )
                                }

                                aria-label={
                                    `Ir para prova social ${index + 1}`
                                }

                            />

                        )
                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <motion.div
                    className="testimonials-footer"

                    variants={
                        headerVariants
                    }

                    initial="hidden"

                    whileInView="visible"

                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                >

                    <div className="bottom-testimonials">

                        <h3>

                            Agora você entende
                            <br />

                            por que virou o{" "}

                            <strong>
                                Queridinho
                            </strong>.

                        </h3>


                        <p>

                            Brilho, acabamento e aquele
                            <br />

                            cheiro que faz diferença.

                        </p>

                    </div>

                </motion.div>

            </div>


            {/* =====================================================
                LIGHTBOX
            ===================================================== */}

            {selectedTestimonial !== null && (

                <div

                    className="testimonial-lightbox"

                    role="dialog"

                    aria-modal="true"

                    aria-label="Visualização ampliada da prova social"

                    onClick={
                        closeTestimonial
                    }

                    onTouchStart={
                        handleLightboxTouchStart
                    }

                    onTouchEnd={
                        handleLightboxTouchEnd
                    }

                >


                    {/* =============================================
                        FECHAR
                    ============================================= */}

                    <button

                        type="button"

                        className="lightbox-close"

                        onClick={
                            closeTestimonial
                        }

                        aria-label="Fechar prova social"

                    >

                        ×

                    </button>


                    {/* =============================================
                        ANTERIOR
                    ============================================= */}

                    <button

                        type="button"

                        className="
                            lightbox-arrow
                            lightbox-prev
                        "

                        onClick={(
                            event
                        ) => {

                            event.stopPropagation();

                            previousSelectedTestimonial();

                        }}

                        aria-label="Prova social anterior"

                    >

                        ‹

                    </button>


                    {/* =============================================
                        IMAGEM
                    ============================================= */}

                    <div

                        className="lightbox-content"

                        onClick={(
                            event
                        ) => {

                            event.stopPropagation();

                        }}

                    >

                        <img

                            src={
                                testimonials[
                                    selectedTestimonial
                                ].image
                            }

                            alt={
                                `Experiência de cliente com o Queridinho Supreme - prova social ${selectedTestimonial + 1}`
                            }

                            decoding="async"

                        />

                    </div>


                    {/* =============================================
                        PRÓXIMO
                    ============================================= */}

                    <button

                        type="button"

                        className="
                            lightbox-arrow
                            lightbox-next
                        "

                        onClick={(
                            event
                        ) => {

                            event.stopPropagation();

                            nextSelectedTestimonial();

                        }}

                        aria-label="Próxima prova social"

                    >

                        ›

                    </button>

                </div>

            )}

        </section>

    );

}


export default Testimonials;