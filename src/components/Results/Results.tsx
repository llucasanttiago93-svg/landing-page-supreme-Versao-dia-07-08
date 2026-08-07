import "./Results.css";

function Results() {
  return (
    <section className="results" id="resultados">

      <div className="container">

        <div className="results-header">

          <p className="results-eyebrow">
            RESULTADOS
          </p>

          <h2>
            Seu cabelo muda.
            <br />
            A sensação também.
          </h2>

          <p>
            Desde a primeira aplicação você percebe fios mais
            brilhantes, macios e perfumados.
          </p>

        </div>

        <div className="results-grid">

          <div className="result-card">

            <img
              src="/images/brilho-intenso.png"
              alt=""
            />

            <div className="result-content">

              <span>✨</span>

              <h3>Brilho intenso</h3>

              <p>
                Aspecto saudável e luminoso logo nas primeiras aplicações.
              </p>

            </div>

          </div>

          <div className="result-card">

            <img
              src="/images/perfume-marcante.png"
              alt=""
            />

            <div className="result-content">

              <span>🌸</span>

              <h3>Perfume marcante</h3>

              <p>
                Um aroma sofisticado que permanece por muito mais tempo.
              </p>

            </div>

          </div>

          <div className="result-card">

            <img
              src="/images/maciez-absoluta.png"
              alt=""
            />

            <div className="result-content">

              <span>💎</span>

              <h3>Maciez absoluta</h3>

              <p>
                Toque sedoso sem deixar os fios pesados.
              </p>

            </div>

          </div>

          <div className="result-card">

            <img
              src="/images/frizz-controlado.png"
              alt=""
            />

            <div className="result-content">

              <span>✔</span>

              <h3>Frizz controlado</h3>

              <p>
                Fios alinhados e aparência muito mais bonita.
              </p>

            </div>

          </div>

        </div>

        <div className="results-footer">

          <div className="stars">

            ★★★★★

          </div>

          <h3>
            Avaliação média 4,9 estrelas
          </h3>

          <p>
            Clientes apaixonadas pela fragrância e pelo resultado.
          </p>

        </div>

      </div>

    </section>
  );
}

export default Results;