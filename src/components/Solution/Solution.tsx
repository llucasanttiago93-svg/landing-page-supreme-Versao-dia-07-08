import "./Solution.css";

function Solution() {
  return (
    <section className="solution" id="beneficios">

      <div className="container solution-container">

        <div className="solution-image">

          <img
            src="/images/model-fragrance.webp"
            alt="Mulher aplicando o Queridinho Supreme nos cabelos"
          />

        </div>

        <div className="solution-content">

          <h2>
            O perfume que permanece
            <span> mesmo depois que você sai.</span>
          </h2>

          <p className="solution-description">

            O Queridinho Supreme combina óleos nutritivos com uma
            fragrância sofisticada para deixar seus cabelos
            brilhantes, sedosos e perfumados por muito mais tempo.

          </p>

          <div className="solution-benefits">

            <div className="solution-item">
              <span>✓</span>
              <p>Perfume marcante</p>
            </div>

            <div className="solution-item">
              <span>✓</span>
              <p>Fragrância de longa duração</p>
            </div>

            <div className="solution-item">
              <span>✓</span>
              <p>Brilho intenso</p>
            </div>

            <div className="solution-item">
              <span>✓</span>
              <p>Toque sedoso</p>
            </div>

          </div>

          <a
            href="#comprar"
            className="solution-button"
          >
            Comprar Agora
          </a>

        </div>

      </div>

    </section>
  );
}

export default Solution;