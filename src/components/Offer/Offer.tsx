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
            Seu cabelo merece
            <br />
            mais.
          </h2>

          <p className="offer-description">
            Escolha sua quantidade e leve para casa o
            <strong> Queridinho Supreme</strong> que combina
            tratamento, brilho e uma fragrância marcante.
          </p>

        </div>


        <div className="pricing-grid">


          {/* ========================= */}
          {/* 1 UNIDADE */}
          {/* ========================= */}

          <article className="pricing-card">

            <div className="card-label">
              Para experimentar
            </div>

            <h3>
              1 Unidade
            </h3>

            <p className="card-description">
              Perfeito para conhecer o <span>QUERIDINHO SUPREME</span>.
            </p>

            <div className="product-wrapper">

              <img
                src="/images/product-front.png"
                alt="1 Unidade Queridinho Supreme"
                className="pricing-image"
              />

            </div>


            <div className="price">

              <span>R$</span>

              <strong>57</strong>

              <small>,00</small>

            </div>


            <ul className="pricing-benefits">

              <li>
                <span className="benefit-check">✓</span>
                <span>Brilho intenso</span>
              </li>

              <li>
                <span className="benefit-check">✓</span>
                <span>Fragrância Premium</span>
              </li>

              <li>
                <span className="benefit-check">✓</span>
                <span>Controle do frizz</span>
              </li>

              <li>
                <span className="benefit-check">✓</span>
                <span>Toque sedoso</span>
              </li>

            </ul>


            <a
              href="#"
              className="pricing-button"
            >
              Comprar 1 Unidade
            </a>

            <p className="card-secure">
              🔒 Compra segura
            </p>

          </article>



          {/* ========================= */}
          {/* 2 UNIDADES */}
          {/* ========================= */}

          <article className="pricing-card featured">

            <div className="badge">
              🔥 MAIS VENDIDO
            </div>

            <div className="card-label featured-label">
              Melhor escolha
            </div>

            <h3>
              2 Unidades
            </h3>

            <p className="card-description">
              Mais produto, mais economia e mais tempo de uso.
            </p>


            <div className="product-wrapper featured-product">

              <img
                src="/images/product-front-2un.png"
                alt="2 Unidades Queridinho Supreme"
                className="pricing-image featured-image"
              />


            </div>


            <div className="price-old">
              De <s>R$114,00</s>
            </div>


            <div className="price">

              <span>R$</span>

              <strong>97</strong>

              <small>,00</small>

            </div>


            <div className="saving">
              ✓ Você economiza R$17,00
            </div>


            <ul className="pricing-benefits">

              <li>
                <span className="benefit-check">✓</span>
                <span>Melhor custo-benefício</span>
              </li>

              <li>
                <span className="benefit-check">✓</span>
                <span>Fragrância Premium</span>
              </li>

              <li>
                <span className="benefit-check">✓</span>
                <span>Brilho intenso</span>
              </li>

              <li>
                <span className="benefit-check">✓</span>
                <span>Controle do frizz</span>
              </li>

            </ul>


            <a
              href="#"
              className="pricing-button featured-button"
            >
              Quero 2 Unidades
            </a>


            <p className="card-secure">
              🔒 Compra segura · Pix e Cartão
            </p>

          </article>

        </div>



        {/* ========================= */}
        {/* SEGURANÇA */}
        {/* ========================= */}

        <div className="offer-footer">

          <div className="offer-trust-item">
            <span className="trust-icon">🔒</span>
            <span>Compra Segura</span>
          </div>

          <div className="offer-trust-item">
            <span className="trust-icon">🚚</span>
            <span>Envio para todo o Brasil</span>
          </div>

          <div className="offer-trust-item">
            <span className="trust-icon">💳</span>
            <span>Pix e Cartão</span>
          </div>

        </div>


        <p className="offer-bottom-text">
          Escolha sua oferta e transforme o acabamento dos seus cabelos.
        </p>

      </div>

    </section>
  );
}

export default Offer;