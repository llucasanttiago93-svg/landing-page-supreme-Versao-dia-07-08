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
              Compra segura
            </h3>

            <p>
              Pagamento realizado de forma segura por meio do checkout
              da InfinitePay.
            </p>

          </article>

          <article className="guarantee-card">

            <div className="guarantee-icon">
              🚚
            </div>

            <h3>
              Envio para todo o Brasil
            </h3>

            <p>
              Enviamos seu pedido para todo o Brasil com acompanhamento
              da entrega.
            </p>

          </article>

          <article className="guarantee-card">

            <div className="guarantee-icon">
              💳
            </div>

            <h3>
              Pix e cartão
            </h3>

            <p>
              Escolha a forma de pagamento disponível no checkout.
            </p>

          </article>

          <article className="guarantee-card">

            <div className="guarantee-icon">
              ⭐
            </div>

            <h3>
              Produto original
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