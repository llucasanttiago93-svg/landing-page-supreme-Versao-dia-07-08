import { useRef, useState } from "react";
import "./Testimonials.css";

function Testimonials() {

    const carouselRef = useRef<HTMLDivElement>(null);

    const [current, setCurrent] = useState(0);

    const testimonials = [
        {
            image: "/images/brilho-intenso.png",
            text: `"Meu cabelo ficou muito mais cheiroso. Todo mundo pergunta qual perfume estou usando. Simplesmente maravilhoso."`,
            author: "Juliana M.",
        },
        {
            image: "/images/espalhando-no-cabelo.png",
            text: `"Nunca imaginei que um reparador pudesse deixar meu cabelo tão brilhante e perfumado ao mesmo tempo."`,
            author: "Camila R.",
        },
        {
            image: "/images/6 - Sentindo o Cheiro.png",
            text: `"Virou meu finalizador favorito. O brilho é incrível e o perfume dura o dia inteiro."`,
            author: "Fernanda S.",
        },
        {
            image: "/images/frizz-controlado.png",
            text: `"Virou meu finalizador favorito. O brilho é incrível e o perfume dura o dia inteiro."`,
            author: "Fernanda S.",
        },
        {
            image: "/images/woman-back.jpg",
            text: `"Virou meu finalizador favorito. O brilho é incrível e o perfume dura o dia inteiro."`,
            author: "Fernanda S.",
        },
    ];


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
                        Descubra por que o Queridinho Supreme se tornou o
                        finalizador favorito de milhares de mulheres.
                    </p>

                </div>


                {/* ========================= */}
                {/* CARROSSEL */}
                {/* ========================= */}

                <div className="testimonials-carousel">


                    <button
                        className="carousel-button carousel-prev"
                        onClick={previousTestimonial}
                        aria-label="Depoimento anterior"
                    >
                        ‹
                    </button>


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
                                        alt="Cliente satisfeita"
                                    />


                                    <div className="testimonial-content">

                                        <div className="testimonial-stars">
                                            ★★★★★
                                        </div>


                                        <p className="testimonial-text">
                                            {testimonial.text}
                                        </p>


                                        <div className="testimonial-author">

                                            <strong>
                                                {testimonial.author}
                                            </strong>

                                            <span>
                                                Cliente Verificada
                                            </span>

                                        </div>

                                    </div>

                                </article>

                            ))}


                        </div>

                    </div>


                    <button
                        className="carousel-button carousel-next"
                        onClick={nextTestimonial}
                        aria-label="Próximo depoimento"
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
                            aria-label={`Ir para depoimento ${index + 1}`}
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
                        Avaliação média 4,9 estrelas
                    </h3>

                    <p>
                        Mais de milhares de clientes satisfeitas em todo o Brasil.
                    </p>

                </div>


            </div>

        </section>

    );

}

export default Testimonials;