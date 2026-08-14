import "./HowTo.css";

function HowTo() {
  return (
    <section className="howto" id="como-usar">

      <div className="container">

        <div className="howto-header">

          <p className="howto-eyebrow">
            COMO USAR
          </p>

          <h2>
            Três passos.
            <br />
            Alguns segundos.
          </h2>

          <p className="howto-description">
            Transforme o acabamento dos seus cabelos em poucos
            instantes e aproveite brilho, maciez e uma fragrância
            sofisticada no dia a dia.
          </p>

        </div>

        <div className="howto-steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div className="step-image">

              <img
                src="/images/aplicando-na-mao.webp"
                alt="Aplicando o Queridinho Supreme na palma das mãos"
              />

            </div>

            <div className="step-content">

              <h3>
                Aplique
              </h3>

              <p>
                Coloque 1 ou 2 pumps do Queridinho Supreme na palma
                das mãos.
              </p>

            </div>

          </div>

          <div className="step-line"></div>

          <div className="step">

            <div className="step-number">
              02
            </div>

            <div className="step-image">

              <img
                src="/images/espalhando-no-cabelo.webp"
                alt="Aplicando o Queridinho Supreme no comprimento e nas pontas dos cabelos"
              />

            </div>

            <div className="step-content">

              <h3>
                Espalhe
              </h3>

              <p>
                Distribua suavemente no comprimento e nas pontas,
                evitando a raiz.
              </p>

            </div>

          </div>

          <div className="step-line"></div>

          <div className="step">

            <div className="step-number">
              03
            </div>

            <div className="step-image">

              <img
                src="/images/finalizando.webp"
                alt="Cabelos finalizados com o Queridinho Supreme"
              />

            </div>

            <div className="step-content">

              <h3>
                Finalize
              </h3>

              <p>
                Aproveite cabelos mais brilhantes, sedosos e com uma
                fragrância marcante.
              </p>

            </div>

          </div>

        </div>

        <div className="howto-tip">

          <span>✨</span>

          <p>
            Não enxágue. Pode ser usado diariamente em cabelos secos
            ou úmidos.
          </p>

        </div>

      </div>

    </section>
  );
}

export default HowTo;