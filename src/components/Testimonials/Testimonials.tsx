import { useRef, useState } from "react";
import "./Testimonials.css";

function Testimonials() {

    const carouselRef = useRef<HTMLDivElement>(null);

    const [current, setCurrent] = useState(0);


    const testimonials = [
        { image: `${import.meta.env.BASE_URL}images/prova2.webp` },
        { image: `${import.meta.env.BASE_URL}images/prova1.webp` },
        { image: `${import.meta.env.BASE_URL}images/prova3.webp` },
        { image: `${import.meta.env.BASE_URL}images/prova4.webp` },
        { image: `${import.meta.env.BASE_URL}images/prova5.webp` },
        { image: `${import.meta.env.BASE_URL}images/prova6.webp` },
        { image: `${import.meta.env.BASE_URL}images/prova7.webp` },
        { image: `${import.meta.env.BASE_URL}images/prova8.webp` },
        { image: `${import.meta.env.BASE_URL}images/prova9.webp` },
        { image: `${import.meta.env.BASE_URL}images/prova10.webp` },
        { image: `${import.meta.env.BASE_URL}images/prova11.webp` },
        { image: `${import.meta.env.BASE_URL}images/prova12.webp` },
    ];



    const scrollToCard = (index: number) => {

        const carousel = carouselRef.current;

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

        const carousel = carouselRef.current;

        if (!carousel) return;



        const cards =
            carousel.querySelectorAll<HTMLElement>(
                ".testimonial-card"
            );



        let closestIndex = 0;

        let closestDistance = Infinity;



        cards.forEach((card,index)=>{


            const distance =
                Math.abs(
                    card.offsetLeft -
                    carousel.scrollLeft
                );



            if(distance < closestDistance){

                closestDistance = distance;

                closestIndex = index;

            }


        });



        setCurrent(closestIndex);

    };





    return (

        <section className="testimonials section-motion">


            <div className="container">



                <div className="testimonials-header reveal-item">


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





                <div className="testimonials-carousel">



                    <button

                        className="carousel-button carousel-prev"

                        onClick={previousTestimonial}

                        aria-label="Prova social anterior"

                    >

                        ‹

                    </button>





                    <div

                        className="testimonials-viewport"

                        ref={carouselRef}

                        onScroll={handleScroll}

                    >



                        <div className="testimonials-track">



                            {testimonials.map(
                                (testimonial,index)=>(


                                <article

                                    className={
                                        `testimonial-card 
                                        ${
                                        current === index
                                        ? "active-card"
                                        : ""
                                        }`
                                    }

                                    key={index}

                                >



                                    <img

                                        className="image-motion"

                                        src={testimonial.image}

                                        alt={
                                            `Experiência de cliente com o Queridinho Supreme - prova social ${index + 1}`
                                        }

                                    />



                                </article>


                            ))}



                        </div>



                    </div>





                    <button

                        className="carousel-button carousel-next"

                        onClick={nextTestimonial}

                        aria-label="Próxima prova social"

                    >

                        ›

                    </button>



                </div>





                <div className="carousel-dots">


                    {testimonials.map((_,index)=>(


                        <button

                            key={index}

                            className={
                                current === index
                                ? "carousel-dot active"
                                : "carousel-dot"
                            }

                            onClick={() => scrollToCard(index)}

                            aria-label={
                                `Ir para prova social ${index + 1}`
                            }

                        />


                    ))}


                </div>






                <div className="testimonials-footer reveal-item">


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