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
            Desde a primeira aplicação, você percebe fios mais
            brilhantes, macios, alinhados e perfumados.
          </p>

        </div>

        <div className="results-grid">

          <div className="result-card">

            <img
              src={`${import.meta.env.BASE_URL}images/brilho-intenso.webp`}
              alt="Cabelos com brilho intenso após o uso do Queridinho Supreme"
            />

            <div className="result-content">

              <span>✨</span>

              <h3>
                Brilho intenso
              </h3>

              <p>
                Aspecto luminoso e acabamento sofisticado para os fios.
              </p>

            </div>

          </div>

          <div className="result-card">

            <img
              src={`${import.meta.env.BASE_URL}images/perfume-marcante.webp`}
              alt="Cabelos perfumados com a fragrância do Queridinho Supreme"
            />

            <div className="result-content">

              <span>🌸</span>

              <h3>
                Perfume marcante
              </h3>

              <p>
                Uma fragrância sofisticada que acompanha os cabelos por mais tempo.
              </p>

            </div>

          </div>

          <div className="result-card">

            <img
              src={`${import.meta.env.BASE_URL}images/maciez-absoluta.webp`}
              alt="Cabelos macios e sedosos após o uso do Queridinho Supreme"
            />

            <div className="result-content">

              <span>💎</span>

              <h3>
                Maciez e sedosidade
              </h3>

              <p>
                Toque sedoso e confortável sem deixar os fios pesados.
              </p>

            </div>

          </div>

          <div className="result-card">

            <img
              src={`${import.meta.env.BASE_URL}images/frizz-controlado.webp`}
              alt="Cabelos alinhados e com frizz controlado após o uso do Queridinho Supreme"
            />

            <div className="result-content">

              <span>✔</span>

              <h3>
                Frizz controlado
              </h3>

              <p>
                Fios mais alinhados e com aparência mais bonita.
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