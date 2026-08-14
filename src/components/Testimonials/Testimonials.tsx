import { useRef, useState } from "react";
import "./Testimonials.css";

function Testimonials() {

    const carouselRef = useRef<HTMLDivElement>(null);

    const [current, setCurrent] = useState(0);

    const testimonials = [
        {
            image: "/images/prova2.webp",
        },
        {
            image: "/images/prova1.webp",
        },
        {
            image: "/images/prova3.webp",
        },
        {
            image: "/images/prova4.webp",
        },
        {
            image: "/images/prova5.webp",
        },
        {
            image: "/images/prova6.webp",
        },
        {
            image: "/images/prova7.webp",
        },
        {
            image: "/images/prova8.webp",
        },
        {
            image: "/images/prova9.webp",
        },
        {
            image: "/images/prova10.webp",
        },
        {
            image: "/images/prova11.webp",
        },
        {
            image: "/images/prova12.webp",
        },
    ];


    /* ========================= */
    /* IR PARA UM CARD */
    /* ========================= */

    const scrollToCard = (index: number) => {

        const carousel = carouselRef.current;

        if (!carousel) return;

        const cards =
            carousel.querySelectorAll<HTMLElement>(".testimonial-card");

        const card = cards[index];

        if (!card) return;

        carousel.scrollTo({
            left: card.offsetLeft,
            behavior: "smooth",
        });

        setCurrent(index);

    };


    /* ========================= */
    /* PRÓXIMO */
    /* ========================= */

    const nextTestimonial = () => {

        const next =
            current === testimonials.length - 1
                ? 0
                : current + 1;

        scrollToCard(next);

    };


    /* ========================= */
    /* ANTERIOR */
    /* ========================= */

    const previousTestimonial = () => {

        const previous =
            current === 0
                ? testimonials.length - 1
                : current - 1;

        scrollToCard(previous);

    };


    /* ========================= */
    /* DETECTAR ARRASTE */
    /* ========================= */

    const handleScroll = () => {

        const carousel = carouselRef.current;

        if (!carousel) return;

        const cards =
            carousel.querySelectorAll<HTMLElement>(".testimonial-card");

        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {

            const distance = Math.abs(
                card.offsetLeft - carousel.scrollLeft
            );

            if (distance < closestDistance) {

                closestDistance = distance;
                closestIndex = index;

            }

        });

        setCurrent(closestIndex);

    };


    return (

        <section className="testimonials">

            <div className="container">


                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div className="testimonials-header">

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

                </div>


                {/* ========================= */}
                {/* CARROSSEL */}
                {/* ========================= */}

                <div className="testimonials-carousel">


                    {/* SETA ANTERIOR */}

                    <button
                        className="carousel-button carousel-prev"
                        onClick={previousTestimonial}
                        aria-label="Prova social anterior"
                    >
                        ‹
                    </button>


                    {/* ÁREA DO CARROSSEL */}

                    <div
                        className="testimonials-viewport"
                        ref={carouselRef}
                        onScroll={handleScroll}
                    >

                        <div className="testimonials-track">

                            {testimonials.map((testimonial, index) => (

                                <article
                                    className="testimonial-card"
                                    key={index}
                                >

                                    <img
                                        src={testimonial.image}
                                        alt={`Experiência de cliente com o Queridinho Supreme - prova social ${index + 1}`}
                                    />

                                </article>

                            ))}

                        </div>

                    </div>


                    {/* SETA PRÓXIMA */}

                    <button
                        className="carousel-button carousel-next"
                        onClick={nextTestimonial}
                        aria-label="Próxima prova social"
                    >
                        ›
                    </button>

                </div>


                {/* ========================= */}
                {/* INDICADORES */}
                {/* ========================= */}

                <div className="carousel-dots">

                    {testimonials.map((_, index) => (

                        <button
                            key={index}
                            className={
                                current === index
                                    ? "carousel-dot active"
                                    : "carousel-dot"
                            }
                            onClick={() => scrollToCard(index)}
                            aria-label={`Ir para prova social ${index + 1}`}
                        />

                    ))}

                </div>


                {/* ========================= */}
                {/* FOOTER */}
                {/* ========================= */}

                <div className="testimonials-footer">

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

                </div>


            </div>

        </section>

    );

}

export default Testimonials;