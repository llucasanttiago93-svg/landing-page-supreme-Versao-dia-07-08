import "./Guarantee.css";

function Guarantee() {
  return (
    <section className="guarantee">

      <div className="container">

        <div className="guarantee-header">

          <p className="guarantee-eyebrow">
            COMPRE COM TRANQUILIDADE
          </p>

          <h2>
            Sua experiência começa
            antes mesmo da entrega.
          </h2>

          <p className="guarantee-description">
            Do pagamento ao recebimento do produto, tudo foi pensado
            para oferecer uma compra segura, rápida e confiável.
          </p>

        </div>

        <div className="guarantee-grid">

          <article className="guarantee-card">

            <div className="guarantee-icon">
              🔒
            </div>

            <h3>
              Compra Segura
            </h3>

            <p>
              Pagamentos protegidos com criptografia e total segurança.
            </p>

          </article>

          <article className="guarantee-card">

            <div className="guarantee-icon">
              🚚
            </div>

            <h3>
              Envio Rápido
            </h3>

            <p>
              Enviamos para todo o Brasil com rastreamento.
            </p>

          </article>

          <article className="guarantee-card">

            <div className="guarantee-icon">
              💳
            </div>

            <h3>
              Pix e Cartão
            </h3>

            <p>
              Escolha a forma de pagamento que preferir.
            </p>

          </article>

          <article className="guarantee-card">

            <div className="guarantee-icon">
              ⭐
            </div>

            <h3>
              Produto Original
            </h3>

            <p>
              Queridinho Supreme original da Vanti Cosméticos.
            </p>

          </article>

        </div>

        <div className="guarantee-cta">

          <a
            href="#comprar"
            className="guarantee-button"
          >
            Comprar Agora
          </a>

        </div>

      </div>

    </section>
  );
}

export default Guarantee;