import "./Testimonials.css";

function Testimonials() {
  return (
    <section className="testimonials" id="depoimentos">

      <div className="container">

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

        <div className="testimonials-grid">

          <article className="testimonial-card">

            <img
              src="/images/testimonial-1.webp"
              alt="Cliente satisfeita"
            />

            <div className="testimonial-content">

              <div className="testimonial-stars">
                ★★★★★
              </div>

              <p className="testimonial-text">
                "Meu cabelo ficou muito mais cheiroso.
                Todo mundo pergunta qual perfume estou usando.
                Simplesmente maravilhoso."
              </p>

              <div className="testimonial-author">

                <strong>Juliana M.</strong>

                <span>Cliente Verificada</span>

              </div>

            </div>

          </article>

          <article className="testimonial-card">

            <img
              src="/images/testimonial-2.webp"
              alt="Cliente satisfeita"
            />

            <div className="testimonial-content">

              <div className="testimonial-stars">
                ★★★★★
              </div>

              <p className="testimonial-text">
                "Nunca imaginei que um reparador pudesse deixar
                meu cabelo tão brilhante e perfumado ao mesmo tempo."
              </p>

              <div className="testimonial-author">

                <strong>Camila R.</strong>

                <span>Cliente Verificada</span>

              </div>

            </div>

          </article>

          <article className="testimonial-card">

            <img
              src="/images/testimonial-3.webp"
              alt="Cliente satisfeita"
            />

            <div className="testimonial-content">

              <div className="testimonial-stars">
                ★★★★★
              </div>

              <p className="testimonial-text">
                "Virou meu finalizador favorito.
                O brilho é incrível e o perfume dura
                o dia inteiro."
              </p>

              <div className="testimonial-author">

                <strong>Fernanda S.</strong>

                <span>Cliente Verificada</span>

              </div>

            </div>

          </article>

        </div>

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