import "./Offer.css";

function Offer() {
  return (
    <section className="offer" id="comprar">

      <div className="container">

        <div className="offer-header">

          <p className="offer-eyebrow">
            ESCOLHA SUA OFERTA
          </p>

          <h2>
            Leve brilho, perfume e
            <br />
            tratamento para o seu cabelo.
          </h2>

          <p className="offer-description">
            Escolha a opção ideal para você e descubra por que o
            Queridinho Supreme conquistou milhares de clientes.
          </p>

        </div>

        <div className="pricing-grid">

          {/* CARD 1 */}

          <article className="pricing-card">

            <h3>
              1 Unidade
            </h3>

            <img
              src="/images/product-front.png"
              alt="1 Unidade Queridinho Supreme"
              className="pricing-image"
            />

            <div className="price">

              <span>R$</span>

              <strong>57</strong>

              <small>,00</small>

            </div>

            <ul>

              <li>✔ Brilho intenso</li>

              <li>✔ Fragrância Premium</li>

              <li>✔ Controle do frizz</li>

              <li>✔ Toque sedoso</li>

            </ul>

            <a
              href="#"
              className="pricing-button"
            >
              Comprar Agora
            </a>

          </article>

          {/* CARD 2 */}

          <article className="pricing-card featured">

            <div className="badge">
              MAIS VENDIDO
            </div>

            <h3>
              2 Unidades
            </h3>

            <img
              src="/images/product-front.png"
              alt="2 Unidades Queridinho Supreme"
              className="pricing-image featured-image"
            />

            <div className="price">

              <span>R$</span>

              <strong>97</strong>

              <small>,00</small>

            </div>

            <ul>

              <li>✔ Melhor custo-benefício</li>

              <li>✔ Fragrância Premium</li>

              <li>✔ Brilho intenso</li>

              <li>✔ Controle do frizz</li>

            </ul>

            <a
              href="#"
              className="pricing-button featured-button"
            >
              Comprar Agora
            </a>

          </article>

        </div>

        <div className="offer-footer">

          <span>🔒 Compra Segura</span>

          <span>🚚 Envio para todo o Brasil</span>

          <span>💳 Pix e Cartão</span>

        </div>

      </div>

    </section>
  );
}

export default Offer;